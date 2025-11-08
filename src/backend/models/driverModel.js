const mongoose = require("mongoose");
const { Schema } = mongoose;

const driverSchema = new Schema({
    name: { 
        type: String, 
        required: true 
    },
    phone: { 
        type: String, 
        required: true 
    },
    licenseNumber: { 
        type: String, 
        required: true, 
        unique: true // Số GPLX phải là duy nhất
    },
    yearsOfExperience: { 
        type: Number, 
        required: true, 
        min: 0 // Số năm kinh nghiệm không được âm
    },
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true, 
        unique: true // Mỗi Driver phải liên kết với một User duy nhất
    },
    busId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Bus' // Xe bus đang được gán (tùy chọn)
    },
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Driver', driverSchema);