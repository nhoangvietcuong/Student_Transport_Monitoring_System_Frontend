const Parent = require("../models/parentModel");

exports.getAll = async (req, res) => {
  try {
    const data = await Parent.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const newParent = new Parent(req.body);
    await newParent.save();
    res.status(201).json(newParent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const data = await Parent.findById(req.params.id);
    if (!data) return res.status(404).json({ message: "Parent not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await Parent.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await Parent.findByIdAndDelete(req.params.id);
    res.json({ message: "Parent deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
