const { UserRepository } = require("../repositories/user.repository");
const { reportController } = require("./report.controller");
const { deleteUserAndNotify } = require("../middlewares/mailerConfig");
const {
  NoDataError,
  DataNotExistsError,
  FormError,
  DataAlreadyExistsError,
  FailedCRUD,
  ServerError,
} = require("../errors/general.error");
const { InvalidRoleError } = require("../errors/user.error");
const {
  sendReportNotificationForCreateNewUser,
  changePasswordAndNotify,
} = require("../middlewares/mailerConfig");

exports.userController = {
  async getAllUsers(req, res) {
    try {
      const result = {
        status: 200,
        data: await UserRepository.find(),
      };
      if (result.data.length === 0) {
        throw new NoDataError("getAllUsers");
      }
      res.status(result.status).json(result.data);
    } catch (error) {
      res.status(error?.status || 500).json(error.message);
    }
  },
  async getUser(req, res) {
    try {
      const result = {
        status: 200,
        data: await UserRepository.retrieve(req.params.id),
      };
      if (!result.data) {
        throw new DataNotExistsError("getUser", req.params.id);
      }
      res.status(result.status).json(result.data);
    } catch (error) {
      switch (error.name) {
        case "DataNotExistsError":
          res.status(error.status).json(error.message);
          break;
        default:
          const serverError = new ServerError();
          res.status(serverError.status).json(serverError.message);
      }
    }
  },
  async createUser(req, res) {
    try {
      const body = req.body;
      if (body.role === "service_provider") {
        if (
          body.username &&
          body.email &&
          body.password &&
          body.location &&
          body.profession
        ) {
          const existingUser = await UserRepository.find();
          existingUser.forEach((user) => {
            if (
              user.username === body.username &&
              user.password === body.password &&
              user.email === body.email
            ) {
              throw new DataAlreadyExistsError(
                "User with this username or password or email already exists"
              );
            }
          });
          const result = {
            status: 201,
            data: await UserRepository.create(body),
          };
          if (result.data === null) {
            throw new FailedCRUD("Failed to create a user");
          }
          const emailResult = await sendReportNotificationForCreateNewUser(
            result.data.email
          );
          if (emailResult === null) {
            console.error("Failed to send email");
          }
          res.status(result.status).json(result.data);
        } else {
          throw new FormError(
            "Please provide all required fields at createUser"
          );
        }
      } else {
        if (body.role === "service_request") {
          if (body.username && body.password && body.location && body.email) {
            const existingUser = await UserRepository.find();
            existingUser.forEach((user) => {
              if (
                user.username === body.username &&
                user.password === body.password &&
                user.email === body.email
              ) {
                throw new DataAlreadyExistsError(
                  "User with this username or password or email already exists"
                );
              }
            });
            const result = {
              status: 201,
              data: await UserRepository.create(body),
            };
            if (result.data === null) {
              throw new FailedCRUD("Failed to create a user");
            }
            const emailResult = await sendReportNotificationForCreateNewUser(
              result.data.email
            );
            if (emailResult === null) {
              console.error("Failed to send email");
            }
            res.status(result.status).json(result.data);
          } else {
            throw new FormError(
              "Please provide all required fields at createUser"
            );
          }
        } else {
          throw new InvalidRoleError(body.role);
        }
      }
    } catch (error) {
      switch (error.name) {
        case "DataAlreadyExistsError":
          res.status(error.status).json(error.message);
          break;
        case "FormError":
          res.status(error.status).json(error.message);
          break;
        case "InvalidRoleError":
          res.status(error.status).json(error.message);
          break;
        case "FailedCRUD":
          res.status(error.status).json(error.message);
          break;
        default:
          const serverError = new ServerError();
          res.status(serverError.status).json(serverError.message);
      }
    }
  },
  async deleteUser(req, res) {
    try {
      const id = req.params.id;
      const user = await UserRepository.retrieve(id);
      if (!user) {
        throw new DataNotExistsError("deleteUser", id);
      }
      if (user.reports.length <= 0) {
        const result = {
          status: 200,
          data: await UserRepository.delete(id),
        };
        if (result.data === null) {
          throw new FailedCRUD("Failed to delete a user");
        }
        res.status(result.status).json("User has been deleted");
      } else {
        const tempRes = {
          status: (statusCode) => {
            tempRes.statusCode = statusCode;
            return tempRes;
          },
          json: (data) => {
            tempRes.data = data;
            return tempRes;
          },
        };
        for (let i = 0; i < user.reports.length; i++) {
          const tempReq = {
            body: {
              _id: user.reports[i],
              whoDelete: user.role,
            },
          };
          await reportController.deleteReport(tempReq, tempRes);
          if (tempRes.statusCode !== 200) {
            res.status(tempRes.statusCode).json(tempRes.data);
          }
        }
        const result = {
          status: 200,
          data: await UserRepository.delete(id),
        };
        if (result.data === null) {
          throw new FailedCRUD("Failed to delete a user");
        }
        const emailResult = await deleteUserAndNotify(
          user.email,
          user.username
        );
        if (emailResult === null) {
          console.error("Failed to send email");
        }
        res.status(result.status).json("User has been deleted");
      }
    } catch (error) {
      switch (error.name) {
        case "DataNotExistsError":
          res.status(error.status).json(error.message);
          break;
        case "FailedCRUD":
          res.status(error.status).json(error.message);
          break;
        default:
          const serverError = new ServerError();
          res.status(serverError.status).json(serverError.message);
      }
    }
  },
  async updateUserPassword(req, res) {
    try {
      const body = req.body;
      const id = req.params.id;

      if (!body.password || !id) {
        throw new FormError("Please provide all required fields at updateUser");
      }
      const user = await UserRepository.retrieve(id);
      if (!user) {
        throw new DataNotExistsError("updateUser", id);
      }
      if (body.password === user.password) {
        throw new FormError("New password must be different from the old one");
      }
      const result = {
        status: 200,
        data: await UserRepository.updatePassword(body.password, user._id),
      };
      if (result.data === null) {
        throw new FailedCRUD("Failed to update a user");
      }
      const emailResult = await changePasswordAndNotify(
        user.email,
        user.username
      );
      if (emailResult === false) {
        console.error("Failed to send email");
      }
      res.status(result.status).json("Password has been updated");
    } catch (error) {
      switch (error.name) {
        case "DataNotExistsError":
          res.status(error.status).json(error.message);
          break;
        case "FormError":
          res.status(error.status).json(error.message);
          break;
        case "FailedCRUD":
          res.status(error.status).json(error.message);
          break;
        default:
          const serverError = new ServerError();
          res.status(serverError.status).json(serverError.message);
      }
    }
  },
};
