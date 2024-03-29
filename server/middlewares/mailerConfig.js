require("dotenv").config();
const nodemailer = require("nodemailer");

const createTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

const sendReportNotificationForCreateNewUser = async (email) => {
  const transporter = createTransporter();
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Welcome to Our Service!",
    text: "Welcome! Your new account has been successfully created.",
    html: `<b>Welcome!</b> <br> Your new account has been successfully created. <br> We're excited to have you with us.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to requestor: ${email}`);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return null;
  }
};

const sendReportNotificationForCreateNewReport = async (
  emailRequest,
  requestName,
  emailProvider,
  providerName
) => {
  const transporter = createTransporter();

  const mailOptionsRequestor = {
    from: process.env.GMAIL_USER,
    to: emailRequest,
    subject: "Your Help Request Has Been Received",
    text: `Hello ${requestName},\n\nWe have received your help request and have assigned ${providerName} to assist you. You will be contacted shortly at ${emailProvider}.`,
    html: `
      <b>Hello ${requestName},</b>
      <br>
      We have received your help request and have assigned <b>${providerName}</b> to assist you.
      <br>
      You will be contacted shortly at <b>${emailProvider}</b>.`,
  };

  const mailOptionsProvider = {
    from: process.env.GMAIL_USER,
    to: emailProvider,
    subject: "New Help Request Assigned to You",
    text: `Hello ${providerName},\n\nYou have been assigned to a help request from ${requestName}. Please reach out to them at ${emailRequest} to offer your assistance.`,
    html: `
      <b>Hello ${providerName},</b>
      <br>
      You have been assigned to a help request from <b>${requestName}</b>.
      <br>
      Please reach out to them at <a href="mailto:${emailRequest}">${emailRequest}</a> to offer your assistance.`,
  };

  try {
    await transporter.sendMail(mailOptionsRequestor);
    console.log(`Email sent to requestor: ${emailRequest}`);
    await transporter.sendMail(mailOptionsProvider);
    console.log(`Email sent to provider: ${emailProvider}`);

    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return null;
  }
};

const sendUpdateDateOfResolveNotification = async (
  userAssignedEmail,
  userAssignedUsername,
  newDateOfResolve,
  reportDescription,
  oldDateOfResolve
) => {
  const transporter = createTransporter();
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: userAssignedEmail,
    subject: "Update on Date of Resolve for Your Assigned Help Request",
    text: `Hello ${userAssignedUsername},\n\nThe date of resolve for your assigned help request has been updated from ${oldDateOfResolve} to ${newDateOfResolve}. `,
    html: `
      <b>Hello ${userAssignedUsername},</b>
      <br>
      The date of resolve for your assigned help request has been updated from <b>${oldDateOfResolve}</b> to <b>${newDateOfResolve}</b>.
      <br>
      Please take note of this change.
      <br>
      <br>
      Description of the report: ${reportDescription}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return null;
  }
};

const deleteReportAndNotify = async (
  emailRequest,
  requestName,
  emailProvider,
  providerName,
  reportDescription,
  key
) => {
  const transporter = createTransporter();

  switch (key) {
    case "request_delete":
      const mailOptionsRequestor = {
        from: process.env.GMAIL_USER,
        to: emailRequest,
        subject: "Your Damage Report Has Been Deleted",
        text: `Hello ${requestName},\n\nYour damage report about "${reportDescription}" has been successfully deleted from our system. If this was a mistake or if you need further assistance, please do not hesitate to contact us.`,
        html: `<b>Hello ${requestName},</b><br>Your damage report about "<b>${reportDescription}</b>" has been successfully deleted from our system.<br>If this was a mistake or if you need further assistance, please do not hesitate to contact us.`,
      };

      const mailOptionsProvider = {
        from: process.env.GMAIL_USER,
        to: emailProvider,
        subject: "Assigned Damage Report Has Been Deleted",
        text: `Hello ${providerName},\n\nThe damage report about "${reportDescription}" you were assigned to has been deleted by the requester. No further action is required on your part.`,
        html: `<b>Hello ${providerName},</b><br>The damage report about "<b>${reportDescription}</b>" you were assigned to has been deleted by the requester.<br>No further action is required on your part.`,
      };

      try {
        await transporter.sendMail(mailOptionsRequestor);
        console.log(`Email sent to requester: ${emailRequest}`);
        await transporter.sendMail(mailOptionsProvider);
        console.log(`Email sent to provider: ${emailProvider}`);
        return true;
      } catch (error) {
        console.error("Error sending email:", error);
        return false;
      }
    case "provider_delete_but_no_provider_available":
      // No other provider was found to take over the report
      const mailOptionsNoProvider = {
        from: process.env.GMAIL_USER,
        to: emailRequest,
        subject: "Report Deletion Notice",
        text: `Hello ${requestName},\n\nWe regret to inform you that your damage report about "${reportDescription}" has been deleted because no service provider is currently available to address it. We apologize for the inconvenience.`,
        html: `<b>Hello ${requestName},</b><br>We regret to inform you that your damage report about "<b>${reportDescription}</b>" has been deleted because no service provider is currently available to address it.<br>We apologize for the inconvenience.`,
      };
      try {
        await transporter.sendMail(mailOptionsNoProvider);
        console.log(`Email sent to requester: ${emailRequest}`);
        return true;
      } catch (error) {
        console.error("Error sending email:", error);
        return false;
      }

    case "report_transfered_to_another_service_provider":
      // Report has been transferred to a different provider
      const mailOptionsTransferred = {
        from: process.env.GMAIL_USER,
        to: emailProvider,
        subject: "New Report Assignment",
        text: `Hello,\n\nA new damage report about "${reportDescription}" has been assigned to you. Please reach out to ${requestName} (${emailRequest}) as soon as possible to address their needs.`,
        html: `<b>Hello,</b><br>A new damage report about "<b>${reportDescription}</b>" has been assigned to you.<br>Please reach out to ${requestName} (<a href="mailto:${emailRequest}">${emailRequest}</a>) as soon as possible to address their needs.`,
      };
      const mailOptionsTransferredRequestor = {
        from: process.env.GMAIL_USER,
        to: emailRequest,
        subject: "Report Transfer Notice",
        text: `Hello ${requestName},\n\nYour damage report about "${reportDescription}" has been transferred to a new service provider. They will reach out to you soon to address your needs.`,
        html: `<b>Hello ${requestName},</b><br>Your damage report about "<b>${reportDescription}</b>" has been transferred to a new service provider.<br>They will reach out to you soon to address your needs.`,
      };
      try {
        await transporter.sendMail(mailOptionsTransferred);
        console.log(`Email sent to new provider: ${emailProvider}`);
        return true;
      } catch (error) {
        console.error("Error sending email:", error);
        return false;
      }

    default:
      console.log("Unrecognized key");
      return false;
  }
};

const deleteUserAndNotify = async (email, username) => {
  const transporter = createTransporter();
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Account Deletion Notice",
    text: `Hello ${username},\n\nYour account has been successfully deleted. We hope to see you again soon!`,
    html: `<b>Hello ${username},</b><br>Your account has been successfully deleted.<br>We hope to see you again soon!`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

module.exports = {
  createTransporter,
  sendReportNotificationForCreateNewUser,
  sendReportNotificationForCreateNewReport,
  sendUpdateDateOfResolveNotification,
  deleteReportAndNotify,
  deleteUserAndNotify,
};
