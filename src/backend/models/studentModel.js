const mongoose = require("mongoose");
const { Schema } = mongoose;

const studentSchema = new Schema(
  {
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parent",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    old: {
      type: Number,
      required: true,
      min: 0,
    },
    classstudent: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // tự động tạo createdAt và updatedAt
  }
);

module.exports = mongoose.model("Student", studentSchema);
