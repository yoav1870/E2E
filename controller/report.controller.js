const { reportRepository } = require("../repository/report.repository");
const {
  NoDataError,
  ReportAlreadyExists,
  ReportDoesntExist,
  formErorr,
} = require("../errors/errors");

const exist = async (id) => {
  const reports = await reportRepository.find();
  const reportExists = reports.find((report) => report.id == id);
  if (!reportExists) {
    throw new ReportDoesntExist(id);
  }
};

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
  async updateReport(req, res) {
    try {
      const {
        body: report,
        params: { id },
      } = req;
      // const reports = await reportRepository.find();
      // const reportExists = reports.find((report) => report.id == id);
      // if (!reportExists) {
      //   throw new ReportDoesntExist(id);
      // }
      await exist(id);
      const result = {
        status: 200,
        message: "updeated successfully report with id: " + id + ".",
        data: await reportRepository.update(id, report),
      };
      res.status(result.status);
      res.json(result.message);
    } catch (error) {
      res.status(error?.status || 500).json(error.message);
    }
  },
  async deleteReport(req, res) {
    try {
      const { id } = req.params;

      // const reports = await reportRepository.find();
      // const reportExists = reports.find((report) => report.id == id);
      // if (!reportExists) {
      //   throw new ReportDoesntExist(id);
      // }
      await exist(id);
      const result = {
        status: 200,
        message: "report with id: " + id + " deleted successfully.",
        data: await reportRepository.delete(id),
      };
      if (result.data === null) {
        throw new ReportDoesntExist(id);
      }
      res.status(result.status);
      res.json(result.message);
    } catch (error) {
      res.status(error?.status || 500).json(error.message);
    }
  },
};
