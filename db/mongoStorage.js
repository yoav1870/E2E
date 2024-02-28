const mongoose = require("mongoose");
const Path = require("path");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

module.exports = class MongoStorage {
  constructor(report) {
    this.Model = require(Path.resolve(
      __dirname,
      `../model/${report}.model.js`
    ));
    this.connect();
  }
  connect() {
    const connectionUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}`;
    mongoose
      .connect(connectionUrl)
      .then(() => {
        console.log("Database connected");
      })
      .catch((err) => console.log(`connection error: ${err}`));
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
    const report = new this.Model(data);
    report.save();
    return report;
  }
  delete(id) {
    if (!isValidObjectId(id)) {
      return null;
    }
    return this.Model.deleteOne({ _id: id });
  }
  update(id, data) {
    const { _id, ...updateData } = data;
    return this.Model.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }
};
