const Trip = require("../models/tripModel"); 

// Hàm chung để lấy các bước Lookup Driver
const getDriverLookupPipeline = () => [
    {
        // 1. Lookup thông tin Driver (driverId đã có trong Trip)
        $lookup: { // join bảng driver vào trong trips
            from: "drivers", // Tên collection Drivers
            localField: "driverId",
            foreignField: "_id",
            as: "driver",
        },
    },
    { $unwind: "$driver" }, // chuyển về dạng object
];

// Lấy thống kê số chuyến đi của tài xế theo từng tháng
const getDriverTripStats = async (req, res) => {
    try {
        const result = await Trip.aggregate([
            ...getDriverLookupPipeline(), // join driver vào trip

            // 2. Gom nhóm theo driver + month (trích xuất tháng trực tiếp từ $tripDate)
            {
                $group: {
                    _id: { 
                        driverId: "$driver._id", 
                        month: { $month: "$tripDate" } // Trích xuất tháng trực tiếp
                    },
                    trips: { $sum: 1 }, // đếm số chuyến
                    driverName: { $first: "$driver.name" },
                },
            },
            
            // 3. Định dạng lại output
            {
                $project: { // định dạng lại cho đẹp
                    _id: 0,
                    driverName: "$driverName",
                    month: "$_id.month",
                    trips: 1,
                },
            },
            
            // 4. Sắp xếp
            { $sort: { month: 1, driverName: 1 } },
        ]);

        res.status(200).json(result);
    } catch (err) {
        console.error(" [getDriverTripStats] Lỗi:", err);
        res.status(500).json({ message: "Không thể lấy thống kê toàn bộ tháng" });
    }
};

// Lấy thống kê số chuyến đi của tài xế CHỈ trong một tháng cụ thể
const getDriverTripByMonth = async (req, res) => {
    try {
        const month = parseInt(req.params.month);
        if (isNaN(month) || month < 1 || month > 12)
            return res.status(400).json({ message: "Tháng không hợp lệ" });

        const result = await Trip.aggregate([
            // 1. Lọc theo tháng
            // match giống WHERE
            // $eq: [ A, B ] So sánh A == B
            // $expr cho phép dùng biểu thức MongoDB trong $match
            { $match: { $expr: { $eq: [{ $month: "$tripDate" }, month] } } }, // Lọc trực tiếp

            ...getDriverLookupPipeline(),

            // 2. Gom nhóm theo driver
            {
                $group: {
                    _id: "$driver._id",
                    driverName: { $first: "$driver.name" },
                    month: { $first: month },
                    trips: { $sum: 1 },
                },
            },
            
            // 3. Định dạng lại output
            {
                $project: {
                    _id: 0,
                    driverName: "$driverName",
                    month: "$month",
                    trips: 1,
                },
            },
            
            // 4. Sắp xếp
            { $sort: { trips: -1 } },
        ]);

        res.status(200).json(result);
    } catch (err) {
        console.error(" [getDriverTripByMonth] Lỗi:", err);
        res.status(500).json({ message: "Không thể lấy thống kê theo tháng" });
    }
};


// Lấy tài xế có số chuyến đi nhiều nhất trong một tháng
const getTopDriver = async (req, res) => {
    try {
        const month = parseInt(req.params.month);
        if (isNaN(month) || month < 1 || month > 12)
            return res.status(400).json({ message: "Tháng không hợp lệ" });

        const result = await Trip.aggregate([
            // 1. Lọc theo tháng (Giống getDriverTripByMonth)
            { $match: { $expr: { $eq: [{ $month: "$tripDate" }, month] } } }, 

            ...getDriverLookupPipeline(),

            // 2. Gom nhóm theo driver
            {
                $group: {
                    _id: "$driver._id",
                    driverName: { $first: "$driver.name" },
                    trips: { $sum: 1 },
                },
            },
            
            // 3. Sắp xếp, giới hạn và định dạng
            { $sort: { trips: -1 } },
            { $limit: 1 },
            { $project: { _id: 0, driverName: 1, trips: 1 } },
        ]);

        if (!result || result.length === 0) 
            return res.status(200).json({ message: "Không có dữ liệu cho tháng này" });
            
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