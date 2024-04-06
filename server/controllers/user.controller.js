const { UserRepository } = require("../repositories/user.repository");
const { reportController } = require("./report.controller");
const { deleteUserAndNotify } = require("../middlewares/mailerConfig");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  DataNotExistsError,
  FormError,
  DataAlreadyExistsError,
  FailedCRUD,
  ServerError,
  SignInError,
} = require("../errors/general.error");
const { InvalidRoleError } = require("../errors/user.error");
const {
  sendReportNotificationForCreateNewUser,
  changePasswordAndNotify,
} = require("../middlewares/mailerConfig");

exports.userController = {
  async signInUser(req, res) {
    try {
      const { email, password } = req.body;
      if (!password || !email) {
        throw new FormError("Please provide all required fields at signInUser");
      }
      const user = await UserRepository.findByEmail(email);
      if (!user) {
        throw new SignInError();
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new SignInError();
      }
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );
      res.status(200).json({ token });
    } catch (error) {
      switch (error.name) {
        case "FormError":
        case "SignInError":
          res.status(error.status).json(error.message);
          break;
        default:
          const serverError = new ServerError();
          res.status(serverError.status).json(serverError.message);
      }
    }
  },
  // by token
  async getUser(req, res) {
    try {
      const userId = req.user.userId;
      const result = {
        status: 200,
        data: await UserRepository.retrieve(userId),
      };
      if (!result.data) {
        throw new DataNotExistsError("getUser", userId);
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
  // by id
  async getUserById(req, res) {
    try {
      const userId = req.params.id;
      const result = {
        status: 200,
        data: await UserRepository.retrieve(userId),
      };
      if (!result.data) {
        throw new DataNotExistsError("getUser", userId);
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
      const { email, password, username, role, location, profession, photo } =
        req.body;
      if (!email || !password || !username || !role || !location) {
        throw new FormError("Please provide all required fields at createUser");
      }
      if (role !== "service_provider" && role !== "service_request") {
        throw new InvalidRoleError(role);
      }
      if (role === "service_provider") {
        if (!profession) {
          throw new FormError("Please provide profession field at createUser");
        }

        const existingUser = await UserRepository.findByEmail(email);
        if (existingUser) {
          throw new DataAlreadyExistsError(
            "User with this email already exists."
          );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
          email,
          password: hashedPassword,
          username,
          role,
          location,
          profession,
          photo,
        };
        const result = {
          status: 201,
          data: await UserRepository.create(newUser),
        };
        if (result.data === null) {
          throw new FailedCRUD("Failed to create a user");
        }
        if (process.env.NODE_ENV !== "test") {
          const emailResult = await sendReportNotificationForCreateNewUser(
            result.data.email
          );
          if (emailResult === null) {
            console.error("Failed to send email");
          }
        }
        res.status(result.status).json(result.data);
      } else {
        const existingUser = await UserRepository.findByEmail(email);
        if (existingUser) {
          throw new DataAlreadyExistsError(
            "User with this email already exists."
          );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
          email,
          password: hashedPassword,
          username,
          role,
          location,
          photo,
        };
        const result = {
          status: 201,
          data: await UserRepository.create(newUser),
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
      }
    } catch (error) {
      switch (error.name) {
        case "DataAlreadyExistsError":
        case "FormError":
        case "InvalidRoleError":
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
      const userId = req.user.userId;
      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
        throw new FormError(
          "Please provide all required fields at updateUserPassword"
        );
      }
      const user = await UserRepository.retrieve(userId);
      if (!user) {
        throw new DataNotExistsError("updateUser", userId);
      }

      const isOldPasswordMatch = await bcrypt.compare(
        oldPassword,
        user.password
      );
      if (!isOldPasswordMatch) {
        throw new FormError("Old password does not match.");
      }

      const isNewPasswordSame = await bcrypt.compare(
        newPassword,
        user.password
      );
      if (isNewPasswordSame) {
        throw new FormError("New password must be different from the old one.");
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const result = {
        status: 200,
        data: await UserRepository.updatePassword(hashedPassword, userId),
      };

      if (result.data === null) {
        throw new FailedCRUD("Failed to update a user");
      }

      if (process.env.NODE_ENV !== "test") {
        const emailResult = await changePasswordAndNotify(
          user.email,
          user.username
        );
        if (emailResult === false) {
          console.error("Failed to send email");
        }
      }
      res.status(result.status).json("Password has been updated");
    } catch (error) {
      switch (error.name) {
        case "DataNotExistsError":
        case "FormError":
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
      const userId = req.user.userId;

      const user = await UserRepository.retrieve(userId);
      if (!user) {
        throw new DataNotExistsError("deleteUser", userId);
      }

      if (user.reports.length <= 0) {
        const result = {
          status: 200,
          data: await UserRepository.delete(userId),
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
          data: await UserRepository.delete(userId),
        };
        if (result.data === null) {
          throw new FailedCRUD("Failed to delete a user");
        }
        if (process.env.NODE_ENV !== "test") {
          const emailResult = await deleteUserAndNotify(
            user.email,
            user.username
          );
          if (emailResult === null) {
            console.error("Failed to send email");
          }
        }
        res.status(result.status).json("User has been deleted");
      }
    } catch (error) {
      switch (error.name) {
        case "DataNotExistsError":
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
