const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "A user must have a username"],
    },
    email: {
      type: String,
      required: [true, "A user must have an email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "A user must have a password"],
    },
    role: {
      type: String,
      enum: ["service_request", "service_provider"],
      required: [true, "A user must have a role"],
    },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: {
        type: [Number],
        required: [true, "A user must have coordinates"],
      },
    },
    description: {
      type: String,
    },
    profession: {
      type: String,
    },
    availability: {
      default: true,
      type: Boolean,
    },
    ranking: {
      type: Number,
      default: 1,
      enum: [1, 2, 3, 4, 5],
    },
    photo: {
      type: String,
      default: null,
    },
    reports: [
      {
        type: Schema.Types.ObjectId,
        ref: "damageReport.model",
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "user_admin", timestamps: true }
);

userSchema.path("profession").required(function () {
  return this.role === "service_provider";
});

userSchema.pre("save", function (next) {
  if (this.profession) {
    this.profession = this.profession.toLowerCase();
  }
  next();
});

userSchema.index({ location: "2dsphere" });

const User = model("user", userSchema);

module.exports = User;
