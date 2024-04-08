const { Router } = require("express");
const { userController } = require("../controllers/user.controller");
const { NotFoundCRUD, RequiredIdError } = require("../errors/general.error");
const authenticateToken = require("../middlewares/authenticateToken");
const upload = require("../middlewares/fileUpload");
const UserRouter = new Router();

UserRouter.post("/sign-in", userController.signInUser);
UserRouter.post('/sign-up', upload.single('photo'), userController.createUser);

UserRouter.get("/home", authenticateToken, userController.getUser);
UserRouter.get("/:id", authenticateToken, userController.getUserById);

UserRouter.put(
  "/updatePassword",
  authenticateToken,
  userController.updateUserPassword
);

UserRouter.delete("/deleteUser", authenticateToken, userController.deleteUser);

UserRouter.all("*", (req, res, next) => {
  next(new NotFoundCRUD());
});
module.exports = UserRouter;
