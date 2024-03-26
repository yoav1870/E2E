const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const damageReportSchema = new mongoose.Schema(
  {
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: {
        type: [Number],
        required: [true, "A report must have a coordinates"],
      },
    },
    description: {
      type: String,
      required: [true, "A report must have a description"],
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed"],
      default: "pending",
      required: [true, "A report must have a status"],
    },
    photo: {
      type: String,
      default: null,
    },
    urgency: {
      type: Number,
      required: [true, "A fault must have a urgency"],
    },
    reportByUser: {
      type: Schema.Types.ObjectId,
      ref: "user.model",
      required: [true, "A fault must have a reporter"],
    },
    assignedToUser: {
      type: [Schema.Types.ObjectId],
      ref: "user.model",
    },
    profession: {
      type: String,
      required: [true, "A fault must have a profession"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    resolved: {
      type: Boolean,
      default: false,
    },
    assignedUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { collection: "damage_reports", timestamps: true }
);

damageReportSchema.index({ location: "2dsphere" });

const DamageReport = mongoose.model("DamageReport", damageReportSchema);

module.exports = DamageReport;
