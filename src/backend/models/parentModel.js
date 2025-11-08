const mongoose = require("mongoose");
const { Schema } = mongoose;

const parentSchema = new Schema({
    firstName: { 
        type: String, 
        required: true 
    },
    lastName: { 
        type: String, 
        required: true 
    },
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true // Email là duy nhất
    },
    phone: { 
        type: String, 
        required: true 
    },
    address: { 
        type: String, 
        required: true 
    },
    dateOfBirth: { 
        type: String // Lưu ý: Nên dùng type: Date nếu cần xử lý ngày tháng
    },
    gender: { 
        type: String, 
        enum: ['Nam', 'Nữ', 'Khác'], 
        default: 'Nam' 
    },
    occupation: { 
        type: String 
    },
    passportNumber: { 
        type: String 
    },
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true, 
        unique: true // Đảm bảo mỗi Parent chỉ liên kết với một User duy nhất
    },
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Parent', parentSchema);