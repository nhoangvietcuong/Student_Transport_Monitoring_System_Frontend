const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true // Thêm unique để tên tuyến đường không trùng
  },
  department: { 
    type: String, 
    required: true 
  },
  arrival: { 
    type: String, 
    required: true 
  },
  time: { 
    type: String, 
    required: true 
  },
  busId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Bus' // Tham chiếu đến Model Bus
  },
  stops: [
    {
      stopId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Stop', // Tham chiếu đến Model Stop
        required: true 
      },
      order: { 
        type: Number, 
        required: true 
      },
      estimatedArrivalTime: { 
        type: String, 
        required: false
      },
      _id: false // Ngăn Mongoose tạo ID cho sub-document này
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model('Route', routeSchema);