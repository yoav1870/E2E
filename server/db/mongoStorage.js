const mongoose = require("mongoose");
const Path = require("path");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

module.exports = class MongoStorage {
  constructor(entity) {
    this.entity = entity;
    if (process.env.NODE_ENV !== "test") {
      this.connect();
      this.loadModel();
    }
  }

  connect() {
    const connectionUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}`;
    mongoose
      .connect(connectionUrl, { autoIndex: true })
      .then(() => console.log("Database connected"))
      .catch((err) => console.error("Connection error:", err));
  }

  loadModel() {
    const modelPath = Path.resolve(
      __dirname,
      `../models/${this.entity}.model.js`
    );
    const modelModule = require(modelPath);
    this.Model = modelModule;
  }

  find() {
    return this.Model.find();
  }
  async retrieve(id) {
    if (!isValidObjectId(id)) {
      return null;
    }
    const entity = await this.Model.findById(id);
    if (
      this.entity === "user" &&
      entity &&
      entity.role === "service_provider"
    ) {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date(todayStart);
      todayEnd.setDate(todayEnd.getDate() + 1);

      const hasReportDueToday = await mongoose.model("DamageReport").findOne({
        assignedUser: id,
        dateOfResolve: {
          $gte: todayStart,
          $lt: todayEnd,
        },
        resolved: false,
      });
      entity.availability = !hasReportDueToday;
    }
    return entity;
  }
  async create(data) {
    const entity = new this.Model(data);
    try {
      await entity.save();
      return entity;
    } catch (error) {
      console.error("Error creating entity:", error);
      return null;
    }
  }

  delete(id) {
    if (!isValidObjectId(id)) {
      return null;
    }
    return this.Model.deleteOne({ _id: id });
  }

  findNearbyAndByProfession(location, profession) {
    return this.Model.find({
      location: {
        $nearSphere: {
          $geometry: location,
          $maxDistance: 20000,
        },
      },
      profession,
      role: "service_provider",
    });
  }
  updateReports(id, reports, ranking) {
    if (!isValidObjectId(id)) {
      return null;
    }
    return this.Model.findByIdAndUpdate(
      id,
      { reports: reports, ranking: ranking },
      { new: true, runValidators: true }
    );
  }

  updatePassword(newPassword, id) {
    if (!isValidObjectId(id)) {
      return null;
    }
    return this.Model.findByIdAndUpdate(
      id,
      { password: newPassword },
      { new: true, runValidators: true }
    );
  }

  updateDateOfResolve(id, date) {
    if (!isValidObjectId(id)) {
      return null;
    }
    return this.Model.findByIdAndUpdate(
      id,
      { dateOfResolve: date },
      { new: true, runValidators: true }
    );
  }

  updateAssignedTo(id, assignedTo) {
    if (!isValidObjectId(id)) {
      return null;
    }
    return this.Model.findByIdAndUpdate(
      id,
      { assignedUser: assignedTo },
      { new: true, runValidators: true }
    );
  }

  findReportsOfUser(userId) {
    if (!isValidObjectId(userId)) {
      return null;
    }
    return this.Model.find({ assignedUser: userId });
  }

  signIn(username, password, email) {
    return this.Model.findOne({ username, password, email });
  }
};
