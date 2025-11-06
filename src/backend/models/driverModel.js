const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  licenseNumber: { type: String, required: true, unique: true },
  busId: { type: mongoose.Schema.Types.ObjectId, ref: "Bus" }, // nếu có bảng Bus
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // liên kết với bảng User
}, { timestamps: true });

module.exports = mongoose.model("Driver", driverSchema);
