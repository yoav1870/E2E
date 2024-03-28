const { UserRepository } = require("../repositories/user.repository");
const {
  NoDataError,
  DataNotExistsError,
  FormError,
  DataAlreadyExistsError,
  FailedCRUD,
} = require("../errors/general.error");
const { InvalidRoleError } = require("../errors/user.error");
const {
  sendReportNotificationForCreateNewUser,
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
      res.status(error?.status || 500).json(error.message);
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
          body.profession &&
          body.availability &&
          body.ranking
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
      res.status(error?.status || 500).json(error.message);
    }
  },
};
