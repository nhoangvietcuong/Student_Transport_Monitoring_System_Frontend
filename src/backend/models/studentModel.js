const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number },
  gender: { type: String, enum: ["male", "female", "other"] },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Parent" },
  busId: { type: mongoose.Schema.Types.ObjectId, ref: "Bus" },
  routeId: { type: mongoose.Schema.Types.ObjectId, ref: "Route" }
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);
