const MongoStorage = require("../db/mongoStorage");
const mongo = new MongoStorage("damageReport");

exports.reportRepository = {
  find() {
    return mongo.find();
  },
  retrieve(id) {
    return mongo.retrieve(id);
  },
  create(report) {
    return mongo.create(report);
  },
  updateDateOfResolve(id, data) {
    return mongo.updateDateOfResolve(id, data);
  },
  delete(id) {
    return mongo.delete(id);
  },
  updateAssignedTo(id, data) {
    return mongo.updateAssignedTo(id, data);
  },
};
