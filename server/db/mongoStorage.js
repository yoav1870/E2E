const mongoose = require("mongoose");
const Path = require("path");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

module.exports = class MongoStorage {
  constructor(user) {
    this.user = user;
    this.connect();
    this.loadModel();
  }

  connect() {
    const connectionUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}`;
    mongoose
      .connect(connectionUrl)
      .then(() => console.log("Database connected"))
      .catch((err) => console.error("Connection error:", err));
  }

  loadModel() {
    const modelPath = Path.resolve(
      __dirname,
      `../models/${this.user}.model.js`
    );
    const modelModule = require(modelPath);
    this.Model = modelModule;
  }

  find() {
    return this.Model.find();
  }
  retrieve(id) {
    if (!isValidObjectId(id)) {
      return null;
    }
    return this.Model.findById(id);
  }
  create(data) {
    const entity = new this.Model(data);
    entity.save();
    return entity;
  }
  delete(id) {
    if (!isValidObjectId(id)) {
      return null;
    }
    return this.Model.deleteOne({ _id: id });
  }
  findByRoleAndProfession(role, profession) {
    return this.Model.find({ role: role, profession: profession });
  }
  updateReports(id, reports) {
    if (!isValidObjectId(id)) {
      return null;
    }
    return this.Model.findByIdAndUpdate(
      id,
      { reports: reports },
      { new: true, runValidators: true }
    );
  }
};
