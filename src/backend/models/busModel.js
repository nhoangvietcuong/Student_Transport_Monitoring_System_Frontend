const mongoose = require("mongoose");

const busSchema = new mongoose.Schema({
  plateNumber: { type: String, required: true, unique: true }, // Biển số xe
  capacity: { type: Number, required: true }, // Sức chứa
  speed: { type: Number, default: 0 }, // Vận tốc hiện tại
  status: { type: String, enum: ["active", "inactive", "maintenance"], default: "active" }, // Trạng thái
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" } // Liên kết tài xế
}, { timestamps: true });

module.exports = mongoose.model("Bus", busSchema);
