const mongoose = require("mongoose");

const parentSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
});

module.exports = mongoose.model("Parent", parentSchema);
