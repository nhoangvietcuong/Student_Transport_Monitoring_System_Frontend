/**
 * ================================
 * 📊 statisticsController.js
 * Thống kê số chuyến của từng tài xế
 * Dựa trên 3 collection:
 * - drivers
 * - buses
 * - routes (chứa busId và arrival kiểu Date)
 * ================================
 */

const Route = require("../models/routeModel");

// ======================================
// 🧮 1️⃣ LẤY THỐNG KÊ TOÀN BỘ THÁNG
// ======================================
const getDriverTripStats = async (req, res) => {
  try {
    const result = await Route.aggregate([
      {
        $addFields: {
          month: { $month: "$arrival" }, // arrival là Date → không cần ép kiểu
        },
      },
      {
        $group: {
          _id: { busId: "$busId", month: "$month" },
          trips: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "buses",
          localField: "_id.busId",
          foreignField: "_id",
          as: "bus",
        },
      },
      { $unwind: "$bus" },
      {
        $lookup: {
          from: "drivers",
          localField: "bus.driverId",
          foreignField: "_id",
          as: "driver",
        },
      },
      { $unwind: "$driver" },
      {
        $project: {
          _id: 0,
          driverName: "$driver.name",
          month: "$_id.month",
          trips: 1,
        },
      },
      { $sort: { month: 1, driverName: 1 } },
    ]);

    res.status(200).json(result);
  } catch (err) {
    console.error("❌ [getDriverTripStats] Lỗi:", err);
    res.status(500).json({ message: "Không thể lấy thống kê toàn bộ tháng" });
  }
};

// ======================================
// 📅 2️⃣ LẤY THỐNG KÊ THEO THÁNG CỤ THỂ
// URL: GET /statistics/month/:month
// ======================================
const getDriverTripByMonth = async (req, res) => {
  try {
    const month = parseInt(req.params.month);
    if (isNaN(month) || month < 1 || month > 12)
      return res.status(400).json({ message: "Tháng không hợp lệ" });

    const result = await Route.aggregate([
      {
        $addFields: {
          month: { $month: "$arrival" },
        },
      },
      { $match: { month } },
      {
        $group: {
          _id: "$busId",
          trips: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "buses",
          localField: "_id",
          foreignField: "_id",
          as: "bus",
        },
      },
      { $unwind: "$bus" },
      {
        $lookup: {
          from: "drivers",
          localField: "bus.driverId",
          foreignField: "_id",
          as: "driver",
        },
      },
      { $unwind: "$driver" },
      {
        $project: {
          _id: 0,
          driverName: "$driver.name",
          month,
          trips: 1,
        },
      },
      { $sort: { trips: -1 } },
    ]);

    res.status(200).json(result);
  } catch (err) {
    console.error("❌ [getDriverTripByMonth] Lỗi:", err);
    res.status(500).json({ message: "Không thể lấy thống kê theo tháng" });
  }
};

// ======================================
// 🥇 3️⃣ LẤY TOP TÀI XẾ CHẠY NHIỀU NHẤT
// URL: GET /statistics/top/:month
// ======================================
const getTopDriver = async (req, res) => {
  try {
    const month = parseInt(req.params.month);
    if (isNaN(month) || month < 1 || month > 12)
      return res.status(400).json({ message: "Tháng không hợp lệ" });

    const result = await Route.aggregate([
      {
        $addFields: {
          month: { $month: "$arrival" },
        },
      },
      { $match: { month } },
      {
        $group: {
          _id: "$busId",
          trips: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "buses",
          localField: "_id",
          foreignField: "_id",
          as: "bus",
        },
      },
      { $unwind: "$bus" },
      {
        $lookup: {
          from: "drivers",
          localField: "bus.driverId",
          foreignField: "_id",
          as: "driver",
        },
      },
      { $unwind: "$driver" },
      {
        $project: {
          _id: 0,
          driverName: "$driver.name",
          month,
          trips: 1,
        },
      },
      { $sort: { trips: -1 } },
      { $limit: 1 },
    ]);

    res
      .status(200)
      .json(result[0] || { message: "Không có dữ liệu cho tháng này" });
  } catch (err) {
    console.error("❌ [getTopDriver] Lỗi:", err);
    res.status(500).json({ message: "Không thể lấy top tài xế" });
  }
};

// ======================================
// 🚀 EXPORT CONTROLLER
// ======================================
module.exports = {
  getDriverTripStats,
  getDriverTripByMonth,
  getTopDriver,
};
