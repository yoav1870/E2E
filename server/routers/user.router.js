const { Router } = require("express");
const { userController } = require("../controllers/user.controller");
const { NotFoundCRUD, RequiredIdError } = require("../errors/general.error");
const UserRouter = new Router();

UserRouter.get("/", userController.getAllUsers);
UserRouter.get("/:id", userController.getUser);
UserRouter.post("/", userController.createUser);
// UserRouter.put("/:id", userController.updateUser); // still not working
UserRouter.delete("/:id", userController.deleteUser);
UserRouter.delete("/", (req, res, next) => {
  next(new RequiredIdError("delete", "user"));
});
UserRouter.all("*", (req, res, next) => {
  next(new NotFoundCRUD());
});
module.exports = UserRouter;
