const { reportRepository } = require("../repositories/report.repository");
const { UserRepository } = require("../repositories/user.repository");
const {
  NoDataError,
  DataNotExistsError,
  FormError,
  DataAlreadyExistsError, // צריך להחליט עפי איזה נתונים טופס הוא אותו טופס
  FailedCRUD,
  NoProviderAvailableError,
} = require("../errors/general.error");
const {
  sendReportNotificationForCreateNewReport,
} = require("../middlewares/mailerConfig");

exports.reportController = {
  async getAllReports(req, res) {
    try {
      const result = {
        status: 200,
        data: await reportRepository.find(),
      };
      if (result.data.length === 0) {
        throw new NoDataError("getAllReports");
      }
      res.status(result.status).json(result.data);
    } catch (error) {
      res.status(error?.status || 500).json(error.message);
    }
  },
  async getReport(req, res) {
    try {
      const result = {
        status: 200,
        data: await reportRepository.retrieve(req.params.id),
      };
      if (!result.data) {
        throw new DataNotExistsError("getReport", req.params.id);
      }
      res.status(result.status).json(result.data);
    } catch (error) {
      res.status(error?.status || 500).json(error.message);
    }
  },
  async createReport(req, res) {
    try {
      const body = req.body;
      userSubmit = await UserRepository.retrieve(body.reportByUser);
      if (!userSubmit) {
        throw new DataNotExistsError("createReport", body.reportByUser);
      }
      if (userSubmit.role !== "service_request") {
        throw new FormError(
          "User that submited the report is not a service request"
        );
      }
      if (
        body.location &&
        body.description &&
        body.status &&
        body.urgency &&
        body.reportByUser &&
        body.profession &&
        body.dateOfResolve
      ) {
        //find the nearest service provider by profession and by location up to 20km
        const serviceProviders = await UserRepository.findNearbyAndByProfession(
          body.location,
          body.profession
        );
        if (!serviceProviders) {
          throw new NoDataError("createReport. No service provider available");
        }
        // sort the service providers by ranking in the 20km radius
        serviceProviders.sort((a, b) => b.ranking - a.ranking);
        // check if the service provider has a report on the same date

        let assignedServiceProvider = null;
        const newReportDate = new Date(body.dateOfResolve);
        if (newReportDate < new Date()) {
          throw new FormError("The date must be in the future");
        }
        for (const provider of serviceProviders) {
          let isAvailable = true;
          for (const reportId of provider.reports) {
            if (!reportId) continue;
            const report = await reportRepository.retrieve(reportId);
            if (report) {
              const reportDate = report.dateOfResolve;

              if (reportDate.getTime() === newReportDate.getTime()) {
                isAvailable = false;
                break;
              }
            }
          }

          if (isAvailable) {
            assignedServiceProvider = provider;
            break;
          }
        }
        if (!assignedServiceProvider) {
          throw new NoProviderAvailableError(
            "No service provider available for this report plz try again later"
          );
        }
        const newReport = {
          location: body.location,
          description: body.description,
          status: body.status,
          photo: body.photo,
          urgency: body.urgency,
          reportByUser: body.reportByUser,
          dateOfResolve: body.dateOfResolve,
          assignedUser: assignedServiceProvider,
          profession: body.profession,
        };
        const result = {
          status: 201,
          data: await reportRepository.create(newReport),
        };
        if (!result.data) {
          throw new FailedCRUD("Failed to create a report");
        }
        assignedServiceProvider.reports.push(result.data._id);
        const updateResult = await UserRepository.updateReports(
          assignedServiceProvider._id,
          assignedServiceProvider.reports
        );
        if (!updateResult) {
          throw new FailedCRUD("Failed to update the service provider");
        }
        userSubmit.reports.push(result.data._id);
        const updateResultUser = await UserRepository.updateReports(
          userSubmit._id,
          userSubmit.reports
        );
        if (!updateResultUser) {
          throw new FailedCRUD("Failed to update the user");
        }
        const emailResult = await sendReportNotificationForCreateNewReport(
          assignedServiceProvider.email,
          assignedServiceProvider.username,
          userSubmit.email,
          userSubmit.username
        );
        if (emailResult === null) {
          console.error("Failed to send email");
        }
        res.status(result.status).json("Report created");
      } else {
        throw new FormError(
          "Please provide all required fields at createReport"
        );
      }
    } catch (error) {
      res.status(error?.status || 500).json(error.message);
    }
  },
  async updateDateOfResolve(req, res) {
    // נצטרך לקבל עוד משתנה שמציג מי מהמשתמשים שלנו בחר למחוק את הטופס
    // נקרא לו whodelete
    try {
      const body = req.body;
      if (req.params.id === undefined) {
        throw new FormError("Please provide a report id");
      }
      if (!body.newDateOfResolve || !body.whoDelete) {
        throw new FormError(
          "Please provide a new date and the user that delete"
        );
      }
      if (body.whoDelete !== "service_request") {
        throw new FormError("Only service request can update the date");
      }
      const report = await reportRepository.retrieve(req.params.id);
      const newReportDate = new Date(body.newDateOfResolve);
      if (newReportDate < new Date()) {
        throw new FormError("The date must be in the future");
      }
      if (newReportDate === report.dateOfResolve) {
        throw new FormError("The new date must be different from the old date");
      }

      const userAssigned = await UserRepository.retrieve(report.assignedUser);
      if (!userAssigned) {
        throw new DataNotExistsError("updateReportDate", report.assignedUser);
      }
      for (const reportId of userAssigned.reports) {
        if (!reportId) continue;
        const tempReport = await reportRepository.retrieve(reportId);
        if (tempReport) {
          const reportDate = tempReport.dateOfResolve;
          if (reportDate.getTime() === newReportDate.getTime()) {
            throw new FormError(
              "The service provider is not available at this date because he has another report at the same date"
            );
          }
        }
      }

      const result = {
        status: 200,
        data: await reportRepository.updateDateOfResolve(
          req.params.id,
          newReportDate
        ),
      };
      if (!result.data) {
        throw new FailedCRUD("Failed to update the report");
      }
      res.status(result.status).json("Report updated");
    } catch (error) {
      res.status(error?.status || 500).json(error.message);
    }
  },
  async deleteReport(req, res) {
    // נצטרך לקבל עוד משתנה שמציג מי מהמשתמשים שלנו בחר למחוק את הטופס
    // נקרא לו whodelete
    try {
      const body = req.body;
      if (!body.whoDelete) {
        throw new FormError("Please provide the user that delete the report");
      }
      const report = await reportRepository.retrieve(req.params.id);
      if (!report) {
        throw new DataNotExistsError(
          "deleteReport, fetch the report to delete",
          req.params.id
        );
      }
      const userSubmit = await UserRepository.retrieve(report.reportByUser);
      if (!userSubmit) {
        throw new DataNotExistsError(
          "deleteReport, fetch the user that submit the report",
          report.reportByUser
        );
      }
      const userAssigned = await UserRepository.retrieve(report.assignedUser);
      if (!userAssigned) {
        throw new DataNotExistsError(
          "deleteReport , fetch the user assaigned to the report",
          report.assignedUser
        );
      }
      if (body.whoDelete === "service_request") {
        const result = {
          status: 200,
          data: await reportRepository.delete(req.params.id),
        };
        if (!result.data) {
          throw new FailedCRUD("Failed to delete the report");
        }
        const indexProvider = userAssigned.reports.indexOf(req.params.id);
        if (indexProvider > -1) {
          userAssigned.reports.splice(indexProvider, 1);
        }
        const updateAssignedReports = await UserRepository.updateReports(
          userAssigned,
          userAssigned.reports
        );
        if (!updateAssignedReports) {
          throw new FailedCRUD("Failed to update the service provider");
        }
        const indexRequest = userSubmit.reports.indexOf(req.params.id);
        if (indexRequest > -1) {
          userSubmit.reports.splice(indexRequest, 1);
        }
        const updateSubmitReports = await UserRepository.updateReports(
          userSubmit,
          userSubmit.reports
        );
        if (!updateSubmitReports) {
          throw new FailedCRUD("Failed to update the user");
        }
        res.status(result.status).json("Report deleted");
      } else if (body.whoDelete === "service_provider") {
        const serviceProviders = await UserRepository.findNearbyAndByProfession(
          report.location,
          report.profession
        );
        if (!serviceProviders) {
          // need to delete the report and send mail to the user that the report was deleted
        }
        serviceProviders.sort((a, b) => b.ranking - a.ranking);

        let assignedServiceProvider = null;
        for (const provider of serviceProviders) {
          let isAvailable = true;
          for (const reportId of provider.reports) {
            if (!reportId) continue;
            const report = await reportRepository.retrieve(reportId);
            if (report) {
              const reportDate = report.dateOfResolve;
              if (reportDate.getTime() === report.dateOfResolve.getTime()) {
                isAvailable = false;
                break;
              }
            }
          }
          if (isAvailable) {
            if (provider._id !== userAssigned) {
              assignedServiceProvider = provider;
              break;
            }
          }
        }
        if (!assignedServiceProvider) {
          // need to delete the report and send mail to the user that the report was deleted
          // const result = {
          //   status: 200,
          //   data: await reportRepository.delete(req.params.id),
          // };
          // if (!result.data) {
          //   throw new FailedCRUD("Failed to delete the report");
          // }
          // res.status(result.status).json("Report deleted");
        } else {
          assignedServiceProvider.reports.push(report._id);
          const updateProviderReports = await UserRepository.updateReports(
            assignedServiceProvider._id,
            assignedServiceProvider.reports
          );
          if (!updateProviderReports) {
            throw new FailedCRUD("Failed to update the service provider");
          }
          const indexProvider = userAssigned.reports.indexOf(req.params.id);
          if (indexProvider > -1) {
            userAssigned.reports.splice(indexProvider, 1);
          }
          const updateAssignedReports = await UserRepository.updateReports(
            userAssigned,
            userAssigned.reports
          );
          if (!updateAssignedReports) {
            throw new FailedCRUD("Failed to update the service provider");
          }
          const result = {
            status: 200,
            data: await reportRepository.updateAssignedTo(
              req.params.id,
              assignedServiceProvider._id
            ),
          };
          if (!result.data) {
            throw new FailedCRUD("Failed to update the report");
          }
          res
            .status(result.status)
            .json("Report transfered to another service provider");
        }
      } else {
        throw new FormError("Please provide the user that delete the report");
      }
    } catch (error) {
      res.status(error?.status || 500).json(error.message);
    }
  },
};
