const Route = require('../models/routeModel'); // đường dẫn tới model Route
const Bus = require('../models/busModel');     // nếu cần kiểm tra bus tồn tại
const Stop = require('../models/StopModel');   // nếu cần kiểm tra stop tồn tại

// Tạo tuyến đường mới
const createRoute = async (req, res) => {
  try {
    const { name, department, arrival, time, busId, stops } = req.body;

    // Tạo route
    const newRoute = new Route({
      name,
      department,
      arrival,
      time,
      busId,
      stops
    });

    await newRoute.save();
    res.status(201).json(newRoute);
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Tên tuyến đường đã tồn tại!" });
    }
    res.status(500).json({ message: "Lỗi server khi tạo tuyến đường." });
  }
};

// Lấy danh sách tất cả tuyến đường
const getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.find()
      .populate('busId')           // Lấy thông tin bus
      .populate('stops.stopId');   // Lấy thông tin từng stop
    res.json(routes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server khi lấy tuyến đường." });
  }
};

// Lấy một tuyến đường theo id
const getRouteById = async (req, res) => {
  try {
    const { id } = req.params;
    const route = await Route.findById(id)
      .populate('busId')
      .populate('stops.stopId');

    if (!route) return res.status(404).json({ message: "Tuyến đường không tồn tại." });
    res.json(route);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server khi lấy tuyến đường." });
  }
};

// Cập nhật tuyến đường
const updateRoute = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, department, arrival, time, busId, stops } = req.body;

    const updatedRoute = await Route.findByIdAndUpdate(
      id,
      { name, department, arrival, time, busId, stops },
      { new: true, runValidators: true }
    );

    if (!updatedRoute) return res.status(404).json({ message: "Tuyến đường không tồn tại." });
    res.json(updatedRoute);
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Tên tuyến đường đã tồn tại!" });
    }
    res.status(500).json({ message: "Lỗi server khi cập nhật tuyến đường." });
  }
};

// Xóa tuyến đường
const deleteRoute = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRoute = await Route.findByIdAndDelete(id);

    if (!deletedRoute) return res.status(404).json({ message: "Tuyến đường không tồn tại." });
    res.json({ message: "Xóa tuyến đường thành công." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server khi xóa tuyến đường." });
  }
};

module.exports = {
  createRoute,
  getAllRoutes,
  getRouteById,
  updateRoute,
  deleteRoute
};
