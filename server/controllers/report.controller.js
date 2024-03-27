const { reportRepository } = require("../repositories/report.repository");
const { UserRepository } = require("../repositories/user.repository");
const {
  NoDataError,
  DataNotExistsError,
  FormError,
  DataAlreadyExistsError, // צריך להחליט עפי איזה נתונים טופס הוא אותו טופס
  FailedCRUD,
} = require("../errors/general.error");

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
        await UserRepository.updateReports(
          assignedServiceProvider._id,
          assignedServiceProvider.reports
        );
        if (!result.data) {
          throw new FailedCRUD("Failed to update the service provider");
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
};
