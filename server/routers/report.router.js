const { Router } = require("express");
const { reportController } = require("../controllers/report.controller");

const reportRouter = new Router();

reportRouter.get("/", reportController.getAllReports);
reportRouter.get("/:id", reportController.getReport);
reportRouter.post("/", reportController.createReport);
// reportRouter.delete("/:id", reportController.deleteReport);
// reportController.put("/:id", reportController.updateReport);

module.exports = reportRouter;
