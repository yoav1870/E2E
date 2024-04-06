const { Router } = require("express");
const { reportController } = require("../controllers/report.controller");
const authenticateToken = require("../middlewares/authenticateToken");
const reportRouter = new Router();

reportRouter.get(
  "/home",
  authenticateToken,
  reportController.getAllReportsOfUser
);

// reportRouter.get(
//   "/search/:profession",
//   authenticateToken,
//   reportController.searchReportsByProfession
// );

// reportRouter.get(
//   "/status/:status",
//   authenticateToken,
//   reportController.getReportsByStatus
// );

reportRouter.get(
  "/past",
  authenticateToken,
  reportController.getOldReportsOfUser
);
reportRouter.get("/:id", authenticateToken, reportController.getReport);

reportRouter.post("/", authenticateToken, reportController.createReport);

reportRouter.put(
  "/updateDate/:id",
  authenticateToken,
  reportController.updateDateOfResolve
);

reportRouter.delete("/", authenticateToken, reportController.deleteReport);

reportRouter.all("*", (req, res, next) => {
  next(new NotFoundCRUD());
});

module.exports = reportRouter;
