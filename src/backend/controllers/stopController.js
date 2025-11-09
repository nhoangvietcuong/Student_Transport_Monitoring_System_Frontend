const Stop = require("../models/StopModel"); 

// Lấy tất cả các điểm dừng
exports.getAll = async (req, res) => {
    try {
        const data = await Stop.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Lấy một điểm dừng theo ID
exports.getOne = async (req, res) => {
    try {
        const data = await Stop.findById(req.params.id);
        if (!data) return res.status(404).json({ message: "Stop not found" });
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Thêm điểm dừng mới
exports.create = async (req, res) => {
    try {
        // Body phải chứa: name, address, location (với type và coordinates)
        const newStop = new Stop(req.body);
        await newStop.save();
        res.status(201).json(newStop); // Trả về status 201 (Created)
    } catch (err) {
        // Lỗi 400 thường là do Validation (thiếu trường required, GeoJSON format sai)
        res.status(400).json({ message: err.message }); 
    }
};

// Cập nhật điểm dừng
exports.update = async (req, res) => {
    try {
        const updated = await Stop.findByIdAndUpdate(req.params.id, req.body, { 
            new: true,
            runValidators: true // Đảm bảo validation (ví dụ: GeoJSON format) chạy khi update
        });
        if (!updated) return res.status(404).json({ message: "Stop not found to update" });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Xóa điểm dừng
exports.delete = async (req, res) => {
    try {
        const deleted = await Stop.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Stop not found to delete" });
        res.json({ message: "Stop deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Tìm điểm dừng gần một tọa độ (latitude, longitude)
exports.getNearbyStops = async (req, res) => {
    try {
        // Đọc tọa độ từ query params: /api/stops/nearby?lng=106.67&lat=10.80&maxDistance=1000
        const { lng, lat, maxDistance = 5000 } = req.query; // maxDistance mặc định là 5000 mét

        if (!lng || !lat) {
            return res.status(400).json({ message: "Missing longitude (lng) or latitude (lat)" });
        }

        const data = await Stop.aggregate([
            {
                $geoNear: {
                    near: {
                        type: "Point",
                        coordinates: [parseFloat(lng), parseFloat(lat)], // [Kinh độ, Vĩ độ]
                    },
                    distanceField: "dist.calculated",
                    maxDistance: parseInt(maxDistance),
                    spherical: true,
                },
            },
            { $sort: { "dist.calculated": 1 } } // Sắp xếp theo khoảng cách gần nhất
        ]);

        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};