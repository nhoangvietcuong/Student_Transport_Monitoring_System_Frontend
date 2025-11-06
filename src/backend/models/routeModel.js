const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema({
  name: String,
  department: String,
  arrival: Date,
  time: String,
  busId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bus",
    required: true,
  },
});

module.exports = mongoose.model("Route", routeSchema);
