const mongoose = require("mongoose");
const { Schema } = mongoose;

const studentSchema = new Schema({
    name: { 
        type: String, 
        required: true 
    },
    old: { // 'old' là trường bắt buộc theo schema trước của bạn
        type: Number, 
        required: true, 
        min: 0 
    },
    classstudent: { // 'classstudent' là trường bắt buộc theo schema trước của bạn
        type: String, 
        required: true 
    },
    gender: { 
        type: String, 
        enum: ["Nam", "Nữ", "Khác"] 
    },
    parentId: { // Tham chiếu đến Phụ huynh
        type: Schema.Types.ObjectId, 
        ref: 'Parent', 
        required: true // Bắt buộc
    },
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Student', studentSchema);