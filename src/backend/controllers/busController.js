const Bus = require("../models/busModel");

// Lấy tất cả bus
exports.getAll = async (req, res) => {
  try {
    const buses = await Bus.find().populate("driverId");
    res.json(buses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Thêm bus mới
exports.create = async (req, res) => {
  try {
    const bus = new Bus(req.body);
    await bus.save();
    res.status(201).json(bus);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Lấy 1 bus theo ID
exports.getOne = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id).populate("driverId");
    if (!bus) 
    return res.status(404).json({ message: "Bus not found" });
    res.json(bus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cập nhật thông tin bus
exports.update = async (req, res) => {
  try {
    const updated = await Bus.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Xóa bus
exports.delete = async (req, res) => {
  try {
    await Bus.findByIdAndDelete(req.params.id);
    res.json({ message: "Bus deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
