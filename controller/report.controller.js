const { reportRepository } = require("../repository/report.repository");
const {
  NoDataError,
  // RequiredIdError,
  // InvalidIdError,
  ReportAlreadyExists,
  ReportDoesntExist,
  formErorr,
} = require("../errors/errors");

exports.reportController = {
  async getAllReports(req, res) {
    try {
      const result = {
        status: 200,
        data: await reportRepository.find(),
      };
      if (result.data.length === 0) {
        throw new NoDataError();
      }
      res.status(result.status);
      res.json(result.data);
    } catch (error) {
      res.status(error?.status || 500).json(error.message);
    }
  },
  async getReport(req, res) {
    try {
      const { id } = req.params;
      const result = {
        status: 200,
        data: await reportRepository.retrieve(id),
      };
      if (result.data === null) {
        throw new ReportDoesntExist(id);
      }
      res.status(result.status);
      res.json(result.data);
    } catch (error) {
      res.status(error?.status || 500).json(error.message);
    }
  },

  async createReport(req, res) {
    try {
      const { body } = req;
      if (
        !body.location ||
        !body.description ||
        !body.severity ||
        !body.status ||
        !body.timestamp ||
        !body.submittedBy ||
        !body.assignedTo
      ) {
        throw new formErorr();
      }
      const reports = await reportRepository.find();
      const reportExists = reports.find(
        (report) =>
          report.location === body.location &&
          report.description === body.description
      );
      if (reportExists) {
        throw new ReportAlreadyExists(body.location, body.description);
      }
      const result = {
        status: 201,
        data: await reportRepository.create(body),
      };
      res.status(result.status);
      res.json(result.data);
    } catch (error) {
      res.status(error?.status || 500).json(error.message);
    }
  },
  async updateReport() {
    // try {
    //   const {
    //     body: plan,
    //     params: { id },
    //   } = req;
    //   if (isNaN(id) || id <= 0) {
    //     throw new InvalidIdError(id);
    //   }
    //   const plans = await reportRepository.find();
    //   const planExists = plans.find((plan) => plan.id == Number(id));
    //   if (!planExists) {
    //     throw new ReportDoesntExist(id);
    //   }
    //   const result = {
    //     status: 200,
    //     message: "updeated successfully plan with id: " + id + ".",
    //     data: await reportRepository.update(id, plan),
    //   };
    //   res.status(result.status);
    //   res.json(result.message);
    // } catch (error) {
    //   res.status(error?.status || 500).json(error.message);
    // }
  },
  async deleteReport() {
    //   try {
    //     const { id } = req.params;
    //     if (isNaN(id) || id <= 0) {
    //       throw new InvalidIdError(id);
    //     }
    //     const plans = await reportRepository.find();
    //     const planExists = plans.find((plan) => plan.id == Number(id));
    //     if (!planExists) {
    //       throw new ReportDoesntExist(id);
    //     }
    //     const result = {
    //       status: 200,
    //       message: "deleted successfully plan with id: " + id + ".",
    //       data: await reportRepository.delete(id),
    //     };
    //     res.status(result.status);
    //     res.json(result.message);
    //   } catch (error) {
    //     res.status(error?.status || 500).json(error.message);
    //   }
  },
};
