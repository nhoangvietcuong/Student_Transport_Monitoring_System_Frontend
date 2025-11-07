const Route = require("../models/routeModel");

const getDriverTripStats = async (req, res) => {
  try {
    // Lookup bus and driver first, then group by driver + month to correctly aggregate across multiple buses
    const result = await Route.aggregate([
      { $addFields: { month: { $month: "$arrival" } } },
      {
        $lookup: {
          from: "buses",
          localField: "busId",
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
        $group: {
          _id: { driverId: "$driver._id", month: "$month" },
          trips: { $sum: 1 },
          driverName: { $first: "$driver.name" },
        },
      },
      {
        $project: {
          _id: 0,
          driverName: "$driverName",
          month: "$_id.month",
          trips: 1,
        },
      },
      { $sort: { month: 1, driverName: 1 } },
    ]);

    res.status(200).json(result);
  } catch (err) {
    console.error(" [getDriverTripStats] Lỗi:", err);
    res.status(500).json({ message: "Không thể lấy thống kê toàn bộ tháng" });
  }
};

const getDriverTripByMonth = async (req, res) => {
  try {
    const month = parseInt(req.params.month);
    if (isNaN(month) || month < 1 || month > 12)
      return res.status(400).json({ message: "Tháng không hợp lệ" });

    const result = await Route.aggregate([
      { $addFields: { month: { $month: "$arrival" } } },
      { $match: { month } },
      {
        $lookup: {
          from: "buses",
          localField: "busId",
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
        $group: {
          _id: "$driver._id",
          driverName: { $first: "$driver.name" },
          month: { $first: month },
          trips: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          driverName: "$driverName",
          month: "$month",
          trips: 1,
        },
      },
      { $sort: { trips: -1 } },
    ]);

    res.status(200).json(result);
  } catch (err) {
    console.error(" [getDriverTripByMonth] Lỗi:", err);
    res.status(500).json({ message: "Không thể lấy thống kê theo tháng" });
  }
};


const getTopDriver = async (req, res) => {
  try {
    const month = parseInt(req.params.month);
    if (isNaN(month) || month < 1 || month > 12)
      return res.status(400).json({ message: "Tháng không hợp lệ" });

    const result = await Route.aggregate([
      { $addFields: { month: { $month: "$arrival" } } },
      { $match: { month } },
      {
        $lookup: {
          from: "buses",
          localField: "busId",
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
        $group: {
          _id: "$driver._id",
          driverName: { $first: "$driver.name" },
          trips: { $sum: 1 },
        },
      },
      { $sort: { trips: -1 } },
      { $limit: 1 },
      { $project: { _id: 0, driverName: 1, trips: 1 } },
    ]);

    if (!result || result.length === 0) return res.status(200).json({ message: "Không có dữ liệu cho tháng này" });
    res.status(200).json(result[0]);
  } catch (err) {
    console.error(" [getTopDriver] Lỗi:", err);
    res.status(500).json({ message: "Không thể lấy top tài xế" });
  }
};
module.exports = {
  getDriverTripStats,
  getDriverTripByMonth,
  getTopDriver,
};
