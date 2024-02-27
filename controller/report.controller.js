const { reportRepository } = require("../repository/report.repository");
const {
  NoDataError,
  InvalidIdError,
  PlanDoesNotExistError,
  RequiredIdError,
  PlanAlreadyExistsError,
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
      if (isNaN(id) || id <= 0) {
        throw new InvalidIdError(id);
      }
      const result = {
        status: 200,
        data: await reportRepository.retrieve(id),
      };
      if (result.data.length === 0) {
        throw new PlanDoesNotExistError(id);
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
      if (!body.id) {
        throw new RequiredIdError("create");
      }
      if (isNaN(body.id) || body.id <= 0) {
        throw new InvalidIdError(body.id);
      }
      const plans = await reportRepository.find();
      const planExists = plans.find((plan) => plan.id == body.id);
      if (planExists) {
        throw new PlanAlreadyExistsError(body.id);
      }
      const result = {
        status: 201,
        message: "created",
        data: await reportRepository.create(body),
      };
      res.status(result.status);
      res.json(result.message);
    } catch (error) {
      res.status(error?.status || 500).json(error.message);
    }
  },
  async updateReport(req, res) {
    try {
      const {
        body: plan,
        params: { id },
      } = req;
      if (isNaN(id) || id <= 0) {
        throw new InvalidIdError(id);
      }
      const plans = await reportRepository.find();
      const planExists = plans.find((plan) => plan.id == Number(id));
      if (!planExists) {
        throw new PlanDoesNotExistError(id);
      }
      const result = {
        status: 200,
        message: "updeated successfully plan with id: " + id + ".",
        data: await reportRepository.update(id, plan),
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
      if (isNaN(id) || id <= 0) {
        throw new InvalidIdError(id);
      }
      const plans = await reportRepository.find();
      const planExists = plans.find((plan) => plan.id == Number(id));
      if (!planExists) {
        throw new PlanDoesNotExistError(id);
      }
      const result = {
        status: 200,
        message: "deleted successfully plan with id: " + id + ".",
        data: await reportRepository.delete(id),
      };
      res.status(result.status);
      res.json(result.message);
    } catch (error) {
      res.status(error?.status || 500).json(error.message);
    }
  },
};
