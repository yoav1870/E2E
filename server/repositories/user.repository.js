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
  findNearbyAndByProfession(location, profession) {
    return mongo.findNearbyAndByProfession(location, profession);
  },
  updateReports(id, reports, ranking) {
    return mongo.updateReports(id, reports, ranking);
  },
  updatePassword(newPassword, id) {
    return mongo.updatePassword(newPassword, id);
  },
  signIn(username, password, email) {
    return mongo.signIn(username, password, email);
  },
};
