const mongoose = require("mongoose");
const { Schema } = mongoose;

const busLocationSchema = new Schema({
  busId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Bus', 
    required: true // Tham chiếu đến Model Bus
  },
  timestamp: { 
    type: Date, 
    default: Date.now // Mặc định là thời điểm lưu trữ
  },
  location: { // Trường GeoJSON Point để lưu trữ tọa độ
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number], // [Kinh độ (Longitude), Vĩ độ (Latitude)]
      required: true
    }
  },
  speed: { 
    type: Number, 
    required: true, 
    default: 0 // Vận tốc xe tại thời điểm đó
  }
}, { 
  timestamps: false // Trường này không cần timestamps vì đã có trường 'timestamp' riêng
});

module.exports = mongoose.model('BusLocation', busLocationSchema);