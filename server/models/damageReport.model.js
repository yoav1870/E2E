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
    },
    photo: {
      type: String,
      default: null,
    },
    urgency: {
      type: Number,
      default: 1,
      enum: [1, 2, 3, 4, 5],
      required: [true, "A report must have a urgency"],
    },
    reportByUser: {
      type: Schema.Types.ObjectId,
      ref: "user.model",
      required: [true, "A report must have a reporter"],
    },
    assignedUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    profession: {
      type: String,
      required: [true, "A report must have a profession"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    dateOfResolve: {
      type: Date,
      required: [true, "A report must have a date of resolve"],
    },
    resolved: {
      type: Boolean,
      default: false,
    },
  },
  { collection: "damage_reports", timestamps: true }
);

damageReportSchema.index({ location: "2dsphere" });

const DamageReport = mongoose.model("DamageReport", damageReportSchema);

module.exports = DamageReport;
