const { Router } = require("express");
const { reportController } = require("../controller/report.controller");
const { RequiredIdError, NotFoundCRUD } = require("../errors/errors");

const reportRouter = new Router();
reportRouter.get("/", reportController.getAllReports);
reportRouter.get("/:id", reportController.getReport);
reportRouter.post("/", reportController.createReport);
reportRouter.put("/", (req, res, next) => {
  next(new RequiredIdError("put"));
});
reportRouter.put("/:id", reportController.updateReport);
reportRouter.delete("/", (req, res, next) => {
  next(new RequiredIdError("delete"));
});
reportRouter.delete("/:id", reportController.deleteReport);
reportRouter.all("*", (req, res, next) => {
  next(new NotFoundCRUD());
});
module.exports = { reportRouter };
