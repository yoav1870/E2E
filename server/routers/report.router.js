const { Router } = require("express");
const { reportController } = require("../controllers/report.controller");
const authenticateToken = require("../middlewares/authenticateToken");
const upload = require("../middlewares/fileUpload");
const { NotFoundCRUD } = require("../errors/general.error");
const reportRouter = new Router();

reportRouter.get(
  "/home",
  authenticateToken,
  reportController.getAllReportsOfUser
);

reportRouter.get(
  "/past",
  authenticateToken,
  reportController.getOldReportsOfUser
);
reportRouter.get("/:id", authenticateToken, reportController.getReport);

reportRouter.post("/", authenticateToken, upload.single('photo'), reportController.createReport);

reportRouter.put(
  "/updateDate/:id",
  authenticateToken,
  reportController.updateDateOfResolve
);

reportRouter.put(
  "/updateStatus/:id",
  authenticateToken,
  reportController.updateStatus
);

reportRouter.delete("/", authenticateToken, reportController.deleteReport);

reportRouter.all("*", (req, res, next) => {
  next(new NotFoundCRUD());
});

module.exports = reportRouter;
