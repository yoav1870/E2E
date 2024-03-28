const { Router } = require("express");
const { reportController } = require("../controllers/report.controller");
const { NotFoundCRUD, RequiredIdError } = require("../errors/general.error");
const reportRouter = new Router();

reportRouter.get("/", reportController.getAllReports);
reportRouter.get("/:id", reportController.getReport);
reportRouter.post("/", reportController.createReport);
reportRouter.put("/:id", reportController.updateDateOfResolve);
reportRouter.put("/", (req, res, next) => {
  next(new RequiredIdError("put", "report"));
});
reportRouter.delete("/:id", reportController.deleteReport);
reportRouter.delete("/", (req, res, next) => {
  next(new RequiredIdError("delete", "report"));
});
reportRouter.all("*", (req, res, next) => {
  next(new NotFoundCRUD());
});

module.exports = reportRouter;
