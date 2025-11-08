const mongoose = require("mongoose");
const { Schema } = mongoose; 


const stopSchema = new Schema({
  name: { type: String, required: true }, // Tên điểm dừng
  address: { type: String, required: true }, // Địa chỉ chi tiết
  location: { // Trường GeoJSON Point để lưu trữ tọa độ
    type: {
      type: String,
      enum: ['Point'], // Bắt buộc phải là 'Point'
      required: true
    },
    coordinates: {
      type: [Number], // [Kinh độ (Longitude), Vĩ độ (Latitude)]
      required: true
    }
  }
}, { timestamps: true }); // Tự động thêm createdAt và updatedAt

// Thêm index 2dsphere cho các truy vấn không gian (ví dụ: tìm điểm gần nhất)
stopSchema.index({ location: '2dsphere' });

// Export Model
module.exports = mongoose.model("Stop", stopSchema); 
// Hoặc, nếu bạn dùng syntax export ES6 như mẫu const routeSchema của bạn:
// export default mongoose.models.Stop || mongoose.model('Stop', stopSchema);