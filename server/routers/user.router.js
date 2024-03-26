const { Router } = require("express");
const { userController } = require("../controllers/user.controller");
const UserRouter = new Router();

UserRouter.get("/", userController.getAllUsers);
UserRouter.get("/:id", userController.getUser);
UserRouter.post("/", userController.createUser);
// UserRouter.put("/:id", userController.updateUser); // still not working
// UserRouter.delete("/:id", userController.deleteUser); // still not working

module.exports = UserRouter;
