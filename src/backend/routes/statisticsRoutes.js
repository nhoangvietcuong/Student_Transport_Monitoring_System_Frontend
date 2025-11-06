const express = require("express");
const router = express.Router();
const statisticsController = require("../controllers/statisticsController");

// =============================
// 📊 ROUTES THỐNG KÊ TÀI XẾ
// =============================

// ✅ 1. Thống kê toàn bộ (GET /trip/statistics)
router.get("/", statisticsController.getDriverTripStats);

// ✅ 2. Thống kê theo tháng cụ thể (GET /trip/statistics/month/:month)
router.get("/month/:month", statisticsController.getDriverTripByMonth);

// ✅ 3. Lấy tài xế có nhiều chuyến nhất trong tháng (GET /trip/statistics/top/:month)
router.get("/top/:month", statisticsController.getTopDriver);

module.exports = router;
