const { UserRepository } = require("../repositories/user.repository");
const { deleteReportById } = require("../services/deleteReport");
const { FailedCRUD, DataNotExistsError } = require("../errors/general.error");
const { deleteUserAndNotify } = require("../middlewares/mailerConfig");

const deleteUserById = async (userId) => {
  if (!userId) throw new FormError("Please provide the user id");
  const user = await UserRepository.retrieve(userId);
  if (!user) throw new DataNotExistsError("deleteUser", userId);

  for (let i = 0; i < user.reports.length; i++) {
    await deleteReportById(user.reports[i], userId);
  }
  const result = {
    status: 200,
    data: await UserRepository.delete(userId),
    message: "User has been deleted",
  };
  if (!result.data) throw new FailedCRUD("failed to delete the user");
  if (process.env.NODE_ENV !== "test") {
    const emailResult = await deleteUserAndNotify(user.email, user.username);
    if (emailResult === null) {
      console.error("Failed to send email");
    }
  }
  return result;
};

module.exports = { deleteUserById };
