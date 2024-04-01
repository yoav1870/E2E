const { Router } = require("express");
const { reportController } = require("../controllers/report.controller");
const { NotFoundCRUD, RequiredIdError } = require("../errors/general.error");
const { report } = require("superagent");
const reportRouter = new Router();

reportRouter.get("/", reportController.getAllReports);
reportRouter.get("/home", reportController.getAllReportsOfUser);
reportRouter.get("/:id", reportController.getReport);
reportRouter.post("/", reportController.createReport);
reportRouter.put("/:id", reportController.updateDateOfResolve);
reportRouter.put("/", (req, res, next) => {
  next(new RequiredIdError("put", "report"));
});
reportRouter.delete("/", reportController.deleteReport);
reportRouter.all("*", (req, res, next) => {
  next(new NotFoundCRUD());
});

module.exports = reportRouter;
