const { reportRepository } = require("../repositories/report.repository");
const { UserRepository } = require("../repositories/user.repository");
const { deleteReportAndNotify } = require("../middlewares/mailerConfig");
const {
  DataNotExistsError,
  ForbiddenError,
  FailedCRUD,
  FormError,
} = require("../errors/general.error");

const removeReportFromUser = async (user, reportId) => {
  const indexReport = user.reports.indexOf(reportId);
  if (indexReport > -1) {
    user.reports.splice(indexReport, 1);
    if (user.role === "service_provider" && user.ranking > 1) {
      user.ranking -= 1;
    }
    await UserRepository.updateReports(user._id, user.reports, user.ranking);
  }
};
const deleteReportById = async (reportId, actingUserId) => {
  if (!reportId) throw new FormError("Please provide the report id");
  const report = await reportRepository.retrieve(reportId);
  if (!report) throw new DataNotExistsError("deleteReport", reportId);

  const actingUser = await UserRepository.retrieve(actingUserId);
  if (!actingUser) throw new DataNotExistsError("deleteReport", actingUserId);

  if (actingUser.role === "service_request") {
    if (report.reportByUser.toString() !== actingUserId)
      throw new ForbiddenError();

    const userAssigned = await UserRepository.retrieve(report.assignedUser);

    if (!userAssigned)
      throw new DataNotExistsError("deleteReport", report.assignedUser);

    const result = {
      status: 200,
      data: await reportRepository.delete(reportId),
      message: "Report has been deleted",
    };
    if (!result.data) throw new FailedCRUD("failed to delete the report");
    await removeReportFromUser(actingUser, reportId);
    await removeReportFromUser(userAssigned, reportId);
    const emailResult = await deleteReportAndNotify(
      actingUser.email,
      actingUser.username,
      userAssigned.email,
      userAssigned.username,
      report.description,
      "request_delete"
    );
    if (emailResult === null) {
      console.error("Failed to send email");
    }

    return result;
  } else if (actingUser.role === "service_provider") {
    if (report.assignedUser.toString() !== actingUserId)
      throw new ForbiddenError();

    const userSubmit = await UserRepository.retrieve(report.reportByUser);

    if (!userSubmit)
      throw new DataNotExistsError("deleteReport", report.reportByUser);

    const serviceProviders = await UserRepository.findNearbyAndByProfession(
      report.location,
      report.profession,
      50
    );
    if (!serviceProviders) {
      const result = {
        status: 200,
        data: await reportRepository.delete(reportId),
        message:
          "Report has been deleted because no service provider available",
      };
      if (!result.data) throw new FailedCRUD("failed to delete the report");
      await removeReportFromUser(actingUser, reportId);
      await removeReportFromUser(userSubmit, reportId);

      const emailResult = await deleteReportAndNotify(
        userSubmit.email,
        userSubmit.username,
        actingUser.email,
        actingUser.username,
        report.description,
        "provider_delete_but_no_provider_available"
      );

      if (emailResult === null) {
        console.error("Failed to send email");
      }
      return result;
    }

    serviceProviders.sort((a, b) => b.ranking - a.ranking);

    let assignedServiceProvider = null;
    for (const provider of serviceProviders) {
      let isAvailable = true;
      for (const reportId of provider.reports) {
        if (!reportId) continue;
        const report = await reportRepository.retrieve(reportId);
        if (report) {
          const reportDate = report.dateOfResolve;
          if (reportDate.getTime() === report.dateOfResolve.getTime()) {
            isAvailable = false;
            break;
          }
        }
      }
      if (isAvailable) {
        if (provider._id !== userAssigned) {
          assignedServiceProvider = provider;
          break;
        }
      }
    }
    // only replacement is the same service provider

    if (assignedServiceProvider === null) {
      const result = {
        status: 200,
        data: await reportRepository.delete(reportId),
        message: "No other service provider available, report has been deleted",
      };
      if (!result.data) throw new FailedCRUD("failed to delete report");
      await removeReportFromUser(actingUser, reportId);
      await removeReportFromUser(userSubmit, reportId);

      const emailResult = await deleteReportAndNotify(
        userSubmit.email,
        userSubmit.username,
        actingUser.email,
        actingUser.username,
        report.description,
        "provider_delete_but_no_provider_available"
      );

      if (emailResult === null) {
        console.error("Failed to send email");
      }
      return result;
    } else {
      assignedServiceProvider.reports.push(reportId);
      if (assignedServiceProvider.ranking < 5) {
        assignedServiceProvider.ranking += 1;
      }
      const updateProvider = await UserRepository.updateReports(
        assignedServiceProvider._id,
        assignedServiceProvider.reports,
        assignedServiceProvider.ranking
      );

      if (!updateProvider)
        throw new FailedCRUD("Failed to update the service provider");

      await removeReportFromUser(actingUser, reportId);
      const result = {
        status: 200,
        data: await reportRepository.updateAssignedTo(
          reportId,
          assignedServiceProvider._id
        ),
        message: "Report has been transfered to another service provider",
      };
      if (!result.data) throw new FailedCRUD("failed to delete report");

      const emailResult = await deleteReportAndNotify(
        userSubmit.email,
        userSubmit.username,
        actingUser.email,
        actingUser.username,
        report.description,
        "report_transfered_to_another_service_provider"
      );

      if (emailResult === null) {
        console.error("Failed to send email");
      }
      return result;
    }
  }
};

module.exports = { deleteReportById };
