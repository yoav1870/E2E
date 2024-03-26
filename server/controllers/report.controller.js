const { reportRepository } = require("../repositories/report.repository");
const { UserRepository } = require("../repositories/user.repository");

exports.reportController = {
  async getAllReports(req, res) {
    try {
      const result = {
        status: 200,
        data: await reportRepository.find(),
      };
      if (result.data.length === 0) {
        throw {
          status: 404,
          message: "No reports found",
        };
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
        throw {
          status: 404,
          message: "Report not found",
        };
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
        throw {
          status: 400,
          message: "User that submited the report not found",
        };
      }
      if (userSubmit.role !== "service_request") {
        throw {
          status: 400,
          message: "User that submited the report is not a service request",
        };
      }
      if (
        body.location &&
        body.description &&
        body.status &&
        body.urgency &&
        body.reportByUser &&
        body.profession
      ) {
        const serviceProviders = await UserRepository.findByRoleAndProfession(
          "service_provider",
          body.profession
        );
        serviceProviders.sort((a, b) => b.ranking - a.ranking);

        const assignedServiceProvider =
          serviceProviders.length > 0 ? serviceProviders[0] : null;

        if (!assignedServiceProvider) {
          throw {
            status: 400,
            message: "No service provider available",
          };
        }

        const newReport = {
          location: body.location,
          description: body.description,
          status: body.status,
          photo: body.photo,
          urgency: body.urgency,
          reportByUser: body.reportByUser,
          assignedUser: assignedServiceProvider,
          profession: body.profession,
        };
        const result = {
          status: 201,
          data: await reportRepository.create(newReport),
        };
        if (!result.data) {
          throw {
            status: 400,
            message: "Report not created",
          };
        }
        assignedServiceProvider.reports.push(result.data._id);
        await UserRepository.updateReports(
          assignedServiceProvider._id,
          assignedServiceProvider.reports
        );
        res.status(result.status).json("Report created");
      } else {
        throw {
          status: 400,
          message: "Please provide all required fields",
        };
      }
    } catch (error) {
      res.status(error?.status || 500).json(error.message);
    }
  },
};
