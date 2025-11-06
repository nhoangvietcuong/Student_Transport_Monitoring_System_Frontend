const Student = require("../models/studentModel");

// Lấy danh sách tất cả học sinh
exports.getAll = async (req, res) => {
  try {
    const students = await Student.find()
      .populate("parentId")
      .populate("busId")
      .populate("routeId");
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Thêm học sinh mới
exports.create = async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Lấy 1 học sinh theo ID
exports.getOne = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate("parentId")
      .populate("busId")
      .populate("routeId");
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cập nhật thông tin học sinh
exports.update = async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Xóa học sinh
exports.delete = async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Student deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
