const mongoose = require("mongoose");
const { Schema } = mongoose;

const busSchema = new Schema({
    plateNumber: { 
        type: String, 
        required: true, 
        unique: true // Biển số xe phải là duy nhất
    },
    capacity: { 
        type: Number, 
        required: true, 
        min: 1 // Sức chứa tối thiểu là 1
    },
    status: { 
        type: String, 
        enum: ['active', 'maintenance', 'inactive'], // Thêm 'inactive' cho tính linh hoạt
        required: true, 
        default: 'active' 
    },
    // Trường tham chiếu đến Tài xế đang phụ trách (Nếu cần)
    driverId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Driver', 
        unique: true, // Đảm bảo mỗi xe chỉ có 1 tài xế được gán cùng lúc
        sparse: true // Cho phép nhiều xe không có tài xế
    }
}, { timestamps: true });

module.exports = mongoose.model('Bus', busSchema);