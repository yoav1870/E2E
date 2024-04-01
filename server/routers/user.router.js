const { Router } = require("express");
const { userController } = require("../controllers/user.controller");
const { NotFoundCRUD, RequiredIdError } = require("../errors/general.error");
const authenticateToken = require("../middlewares/authenticateToken");
const UserRouter = new Router();

UserRouter.post("/sign-in", userController.signInUser);
UserRouter.post("/sign-up", userController.createUser);

UserRouter.put("/:id", authenticateToken, userController.updateUserPassword);

UserRouter.delete("/:id", authenticateToken, userController.deleteUser);

UserRouter.get("/:id", authenticateToken, userController.getUser);

// UserRouter.get("/", userController.getAllUsers);
// UserRouter.put("/", (req, res, next) => {
//   next(new RequiredIdError("put", "user"));
// });
// UserRouter.delete("/", (req, res, next) => {
//   next(new RequiredIdError("delete", "user"));
// });
UserRouter.all("*", (req, res, next) => {
  next(new NotFoundCRUD());
});
module.exports = UserRouter;
