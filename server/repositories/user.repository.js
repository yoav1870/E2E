const MongoStorage = require("../db/mongoStorage");
const mongo = new MongoStorage("user");

exports.UserRepository = {
  find() {
    return mongo.find();
  },
  retrieve(id) {
    return mongo.retrieve(id);
  },
  create(user) {
    return mongo.create(user);
  },
  delete(id) {
    return mongo.delete(id);
  },
  findByRoleAndProfession(role, profession) {
    return mongo.findByRoleAndProfession(role, profession);
  },
  updateReports(id, data) {
    return mongo.updateReports(id, data);
  },
};
