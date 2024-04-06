const { reportRepository } = require("../repositories/report.repository");
const { UserRepository } = require("../repositories/user.repository");
const {
  NoDataError,
  DataNotExistsError,
  FormError,
  FailedCRUD,
  NoProviderAvailableError,
  ServerError,
  ForbiddenError,
} = require("../errors/general.error");
const {
  sendReportNotificationForCreateNewReport,
  sendUpdateDateOfResolveNotification,
  deleteReportAndNotify,
} = require("../middlewares/mailerConfig");

exports.reportController = {
  async getAllReportsOfUser(req, res) {
    try {
      const userId = req.user.userId;
      if (!userId) {
        throw new FormError("Please provide the user id");
      }
      const user = await UserRepository.retrieve(userId);
      if (!user) {
        throw new DataNotExistsError("getAllReportsOfUser", userId);
      }
      const result = {
        status: 200,
        data: await reportRepository.findReportsOfUser(user, false),
      };
      if (result.data.length === 0) {
        throw new NoDataError("getAllReportsOfUser");
      }
      res.status(result.status).json(result.data);
    } catch (error) {
      switch (error.name) {
        case "DataNotExistsError":
        case "NoDataError":
        case "FormError":
          res.status(error.status).json(error.message);
          break;
        default:
          const serverError = new ServerError();
          res.status(serverError.status).json(serverError.message);
      }
    }
  },
  // async searchReportsByProfession(req, res) {
  //   try {
  //     const userId = req.user.userId;
  //     const prof = req.params.profession;
  //     if (!userId || !prof) {
  //       throw new FormError("Please provide the user id and the profession");
  //     }
  //     const user = await UserRepository.retrieve(userId);
  //     if (!user) {
  //       throw new DataNotExistsError("searchReportsByProfession", userId);
  //     }
  //     const reports = await reportRepository.findReportsOfUser(user, false);
  //     if (!reports || reports.length === 0) {
  //       throw new NoDataError("searchReportsByProfession");
  //     }
  //     const result = {
  //       status: 200,
  //       data: reports.filter((report) => report.profession === prof),
  //     };

  //     if (result.data.length === 0) {
  //       throw new NoDataError("searchReportsByProfession");
  //     }

  //     res.status(result.status).json(result.data);
  //   } catch (error) {
  //     switch (error.name) {
  //       case "DataNotExistsError":
  //       case "NoDataError":
  //       case "FormError":
  //         res.status(error.status).json(error.message);
  //         break;
  //       default:
  //         const serverError = new ServerError();
  //         res.status(serverError.status).json(serverError.message);
  //     }
  //   }
  // },
  // async getReportsByStatus(req, res) {
  //   try {
  //     const userId = req.user.userId;
  //     const status = req.params.status;
  //     if (!userId || !status) {
  //       throw new FormError("Please provide the user id and the status");
  //     }
  //     const user = await UserRepository.retrieve(userId);
  //     if (!user) {
  //       throw new DataNotExistsError("getReportsByStatus", userId);
  //     }
  //     const reports = await reportRepository.findReportsOfUser(user, false);
  //     if (!reports || reports.length === 0) {
  //       throw new NoDataError("getReportsByStatus");
  //     }
  //     const result = {
  //       status: 200,
  //       data: reports.filter((report) => report.status === status),
  //     };

  //     if (result.data.length === 0) {
  //       throw new NoDataError("getReportsByStatus");
  //     }

  //     res.status(result.status).json(result.data);
  //   } catch (error) {
  //     switch (error.name) {
  //       case "DataNotExistsError":
  //       case "NoDataError":
  //       case "FormError":
  //         res.status(error.status).json(error.message);
  //         break;
  //       default:
  //         const serverError = new ServerError();
  //         res.status(serverError.status).json(serverError.message);
  //     }
  //   }
  // },
  async getOldReportsOfUser(req, res) {
    try {
      const userId = req.user.userId;
      const user = await UserRepository.retrieve(userId);
      if (!user) {
        throw new DataNotExistsError("getOldReportsOfUser", userId);
      }

      const reports = await reportRepository.findReportsOfUser(user, true);
      if (!reports || reports.length === 0) {
        throw new NoDataError("getOldReportsOfUser");
      }

      res.status(200).json(reports);
    } catch (error) {
      switch (error.name) {
        case "DataNotExistsError":
        case "NoDataError":
          res.status(error.status).json(error.message);
          break;
        default:
          const serverError = new ServerError();
          res.status(serverError.status).json(serverError.message);
      }
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

      if (req.user.role === "service_provider") {
        if (result.data.assignedUser.toString() !== req.user.userId) {
          throw new ForbiddenError();
        }
      } else if (req.user.role === "service_request") {
        if (result.data.reportByUser.toString() !== req.user.userId) {
          throw new ForbiddenError();
        }
      }

      res.status(result.status).json(result.data);
    } catch (error) {
      switch (error.name) {
        case "DataNotExistsError":
        case "ForbiddenError":
          res.status(error.status).json(error.message);
          break;
        default:
          const serverError = new ServerError();
          res.status(serverError.status).json(serverError.message);
      }
    }
  },

  async createReport(req, res) {
    try {
      const {
        location,
        description,
        urgency,
        dateOfResolve,
        profession,
        range,
      } = req.body;
      const userId = req.user.userId;

      const userSubmit = await UserRepository.retrieve(userId);
      if (!userSubmit) {
        throw new DataNotExistsError("createReport", userId);
      }
      if (userSubmit.role !== "service_request") {
        throw new FormError("Only service request users can submit reports.");
      }

      if (
        location &&
        description &&
        urgency &&
        dateOfResolve &&
        profession &&
        range
      ) {
        const serviceProviders = await UserRepository.findNearbyAndByProfession(
          location,
          profession,
          range
        );
        if (!serviceProviders || serviceProviders.length === 0) {
          throw new NoProviderAvailableError(
            "No service provider available for this report. Please try again later."
          );
        }

        serviceProviders.sort((a, b) => b.ranking - a.ranking);

        const assignedServiceProvider = await findAvailableServiceProvider(
          serviceProviders,
          { ...req.body, reportByUser: userId }
        );
        if (!assignedServiceProvider) {
          throw new NoProviderAvailableError(
            "No service provider available for this report. Please try again later."
          );
        }
        const newReport = {
          location,
          description,
          photo: req.body.photo,
          urgency,
          reportByUser: userId,
          dateOfResolve,
          assignedUser: assignedServiceProvider._id,
          profession,
        };
        const result = {
          status: 201,
          data: await reportRepository.create(newReport),
        };
        if (!result.data) {
          throw new FailedCRUD("Failed to create a report");
        }
        assignedServiceProvider.reports.push(result.data._id);
        if (assignedServiceProvider.ranking < 5) {
          assignedServiceProvider.ranking += 1;
        }
        const updateResult = await UserRepository.updateReports(
          assignedServiceProvider._id,
          assignedServiceProvider.reports,
          assignedServiceProvider.ranking
        );
        if (!updateResult) {
          throw new FailedCRUD("Failed to update the service provider");
        }
        userSubmit.reports.push(result.data._id);
        const updateResultUser = await UserRepository.updateReports(
          userSubmit._id,
          userSubmit.reports,
          1
        );
        if (!updateResultUser) {
          throw new FailedCRUD("Failed to update the user");
        }
        if (process.env.NODE_ENV !== "test") {
          const emailResult = await sendReportNotificationForCreateNewReport(
            userSubmit.email,
            userSubmit.username,
            assignedServiceProvider.email,
            assignedServiceProvider.username
          );
          if (emailResult === null) {
            console.error("Failed to send email");
          }
        }
        res.status(result.status).json("Report created");
      } else {
        throw new FormError(
          "Please provide all required fields at createReport"
        );
      }
    } catch (error) {
      switch (error.name) {
        case "DataNotExistsError":
        case "FormError":
        case "NoProviderAvailableError":
        case "FailedCRUD":
          res.status(error.status).json(error.message);
          break;
        default:
          const serverError = new ServerError();
          res.status(serverError.status).json(serverError.message);
      }
    }
  },

  async updateDateOfResolve(req, res) {
    try {
      const userId = req.user.userId;
      const newDateOfResolve = req.body.newDateOfResolve;
      const reportId = req.params.id;

      if (!newDateOfResolve || !reportId) {
        throw new FormError("Please provide a new date and the report id");
      }
      const newReportDate = new Date(newDateOfResolve);

      if (newReportDate < new Date()) {
        throw new FormError("The date must be in the future");
      }

      const user = await UserRepository.retrieve(userId);

      if (!user) {
        throw new DataNotExistsError("updateDateOfResolve", userId);
      }

      if (user.role !== "service_request") {
        throw new ForbiddenError();
      }

      const report = await reportRepository.retrieve(reportId);

      if (!report) {
        throw new DataNotExistsError("updateDateOfResolve", reportId);
      }
      if (report.dateOfResolve.getTime() === newReportDate.getTime()) {
        throw new FormError("The new date must be different from the old date");
      }

      const userAssigned = await UserRepository.retrieve(report.assignedUser);

      if (!userAssigned) {
        throw new DataNotExistsError(
          "updateDateOfResolve, fetch the user assigned to the report",
          report.assignedUser
        );
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
          reportId,
          newReportDate
        ),
      };

      if (!result.data) {
        throw new FailedCRUD("Failed to update the report");
      }

      if (process.env.NODE_ENV !== "test") {
        const emailResult = await sendUpdateDateOfResolveNotification(
          userAssigned.email,
          userAssigned.username,
          report.dateOfResolve,
          report.description,
          newReportDate
        );
        if (emailResult === null) {
          console.error("Failed to send email");
        }
      }
      res.status(result.status).json("Report updated");
    } catch (error) {
      switch (error.name) {
        case "DataNotExistsError":
        case "FormError":
        case "FailedCRUD":
        case "ForbiddenError":
          res.status(error.status).json(error.message);
          break;
        default:
          const serverError = new ServerError();
          res.status(serverError.status).json(serverError.message);
      }
    }
  },
  async deleteReport(req, res) {
    try {
      const reportId = req.body.id;
      const userIdWTD = req.user.userId;
      const roleWTD = req.user.role;
      if (!reportId) {
        throw new FormError("Please provide the report id");
      }

      const report = await reportRepository.retrieve(reportId);

      if (!report) {
        throw new DataNotExistsError("deleteReport", reportId);
      }

      if (roleWTD === "service_request") {
        if (report.reportByUser.toString() !== userIdWTD) {
          throw new ForbiddenError();
        }

        const userAssigned = await UserRepository.retrieve(report.assignedUser);

        if (!userAssigned) {
          throw new DataNotExistsError(
            "deleteReport, fetch the user assigned to the report",
            report.assignedUser
          );
        }
        const userSubmit = await UserRepository.retrieve(report.reportByUser);

        if (!userSubmit) {
          throw new DataNotExistsError(
            "deleteReport, fetch the user that submit the report",
            report.reportByUser
          );
        }
        const result = await deleteReportAndUpdate(
          reportId,
          userSubmit,
          userAssigned
        );
        const emailResult = await deleteReportAndNotify(
          userSubmit.email,
          userSubmit.username,
          userAssigned.email,
          userAssigned.username,
          report.description,
          "request_delete"
        );

        if (emailResult === null) {
          console.error("Failed to send email");
        }

        res.status(result.status).json("Report deleted");
      } else {
        if (report.assignedUser.toString() !== userIdWTD) {
          throw new ForbiddenError();
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
            "deleteReport, fetch the user assigned to the report",
            report.assignedUser
          );
        }
        const serviceProviders = await UserRepository.findNearbyAndByProfession(
          report.location,
          report.profession,
          50
        );
        // there are no users to replace the service provider
        if (!serviceProviders) {
          const result = await deleteReportAndUpdate(
            reportId,
            userSubmit,
            userAssigned
          );

          const emailResult = await deleteReportAndNotify(
            userSubmit.email,
            userSubmit.username,
            userAssigned.email,
            userAssigned.username,
            report.description,
            "provider_delete_but_no_provider_available"
          );

          if (emailResult === null) {
            console.error("Failed to send email");
          }

          res.status(result.status).json("Report deleted");
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

        // only replacement is the same service provider

        if (assignedServiceProvider === null) {
          const result = await deleteReportAndUpdate(
            reportId,
            userSubmit,
            userAssigned
          );

          const emailResult = await deleteReportAndNotify(
            userSubmit.email,
            userSubmit.username,
            userIdWTD.email,
            userIdWTD.username,
            report.description,
            "provider_delete_but_no_provider_available"
          );

          if (emailResult === null) {
            console.error("Failed to send email");
          }

          res.status(result.status).json("Report deleted");
        } else {
          assignedServiceProvider.reports.push(report._id);

          if (assignedServiceProvider.ranking < 5) {
            assignedServiceProvider.ranking += 1;
          }

          const updateProviderReports = await UserRepository.updateReports(
            assignedServiceProvider._id,
            assignedServiceProvider.reports,
            assignedServiceProvider.ranking
          );

          if (!updateProviderReports) {
            throw new FailedCRUD("Failed to update the service provider");
          }

          await removeReportFromUser(userIdWTD, reportId);

          const result = {
            status: 200,
            data: await reportRepository.updateAssignedTo(
              reportId,
              assignedServiceProvider._id
            ),
          };

          if (!result.data) {
            throw new FailedCRUD("Failed to update the report");
          }

          const emailResult = await deleteReportAndNotify(
            userSubmit.email,
            userSubmit.username,
            userAssigned.email,
            userAssigned.username,
            report.description,
            "report_transfered_to_another_service_provider"
          );

          if (emailResult === null) {
            console.error("Failed to send email");
          }

          res
            .status(result.status)
            .json("Report transfered to another service provider");
        }
      }
    } catch (error) {
      switch (error.name) {
        case "DataNotExistsError":
        case "FormError":
        case "FailedCRUD":
        case "ForbiddenError":
          res.status(error.status).json(error.message);
          break;
        default:
          const serverError = new ServerError();
          res.status(serverError.status).json(serverError.message);
      }
    }
  },
};

// FUNCS:

const removeReportFromUser = async (userId, reportId) => {
  const user = await UserRepository.retrieve(userId);
  const indexReport = user.reports.indexOf(reportId);
  if (indexReport > -1) {
    user.reports.splice(indexReport, 1);
    if ((user.role = "service_provider")) {
      if (user.ranking > 1) user.ranking -= 1;
    }
    const updateResult = await UserRepository.updateReports(
      user._id,
      user.reports,
      user.ranking
    );
    if (!updateResult) {
      throw new FailedCRUD("Failed to update the user");
    }
  }
};

const deleteReportAndUpdate = async (reportId, userSubmit, userAssigned) => {
  const result = {
    status: 200,
    data: await reportRepository.delete(reportId),
  };
  if (!result.data) {
    throw new FailedCRUD("Failed to delete the report");
  }
  await removeReportFromUser(userSubmit._id, reportId);
  await removeReportFromUser(userAssigned._id, reportId);

  return result;
};

const findAvailableServiceProvider = async (serviceProviders, body) => {
  let assignedServiceProvider = null;
  const newReportDate = new Date(body.dateOfResolve);

  if (newReportDate < new Date()) {
    return false;
  }

  for (const provider of serviceProviders) {
    let isAvailable = true;
    for (const reportId of provider.reports) {
      if (!reportId) continue;
      const report = await reportRepository.retrieve(reportId);
      if (report) {
        const reportDate = new Date(report.dateOfResolve);

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

  return assignedServiceProvider;
};
