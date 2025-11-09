const Student = require("../models/studentModel");

//  Lấy tất cả học sinh
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().populate("parentId");
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách học sinh", error });
  }
};

//  Lấy học sinh theo ID
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate("parentId");
    if (!student) return res.status(404).json({ message: "Không tìm thấy học sinh" });
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy học sinh", error });
  }
};

//  Thêm học sinh mới
const createStudent = async (req, res) => {
  try {
    const { parentId, name, old, classstudent } = req.body;
    const newStudent = new Student({ parentId, name, old, classstudent });
    const savedStudent = await newStudent.save();
    res.status(201).json(savedStudent);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi tạo học sinh", error });
  }
};

//  Cập nhật học sinh
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedStudent = await Student.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedStudent)
      return res.status(404).json({ message: "Không tìm thấy học sinh để cập nhật" });
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật học sinh", error });
  }
};

//  Xóa học sinh
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStudent = await Student.findByIdAndDelete(id);
    if (!deletedStudent)
      return res.status(404).json({ message: "Không tìm thấy học sinh để xóa" });
    res.status(200).json({ message: "Xóa học sinh thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa học sinh", error });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
