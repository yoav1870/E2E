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
};
