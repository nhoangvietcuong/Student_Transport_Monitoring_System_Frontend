const Driver = require("../models/driverModel");

// Lấy danh sách tất cả tài xế
exports.getAll = async (req, res) => {
  try {
    const drivers = await Driver.find().populate("userId").populate("busId");
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Thêm tài xế mới
exports.create = async (req, res) => {
  try {
    const driver = new Driver(req.body);
    await driver.save();
    res.status(201).json(driver);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Lấy 1 tài xế theo ID
exports.getOne = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id).populate("userId").populate("busId");
    if (!driver) return res.status(404).json({ message: "Driver not found" });
    res.json(driver);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cập nhật thông tin tài xế
exports.update = async (req, res) => {
  try {
    const updated = await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Xóa tài xế
exports.delete = async (req, res) => {
  try {
    await Driver.findByIdAndDelete(req.params.id);
    res.json({ message: "Driver deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
