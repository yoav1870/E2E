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
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
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

module.exports = {
  createTransporter,
  sendReportNotificationForCreateNewUser,
  sendReportNotificationForCreateNewReport,
};
