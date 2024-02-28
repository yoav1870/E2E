const { Schema, model } = require("mongoose");

const damageReportSchema = new Schema(
  {
    location: { type: String, required: true },
    description: { type: String, required: true },
    severity: { type: String, required: true },
    status: { type: Number, required: true },
    timestamp: { type: Date, required: true },
    submittedBy: { type: String, required: true },
    assignedTo: { type: String, required: true },
    comments: [
      {
        author: { type: String },
        text: { type: String },
      },
    ],
    attachments: [
      {
        name: { type: String },
        url: { type: String },
      },
    ],
  },
  { collection: "reportdb" }
);

module.exports = model("DamageReport", damageReportSchema);
