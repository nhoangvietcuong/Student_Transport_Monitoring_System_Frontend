const mongoose = require("mongoose");
const { Schema } = mongoose;

// Định nghĩa Sub-schema cho chi tiết từng điểm dừng
const stopDetailSchema = new Schema({
    stopId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Stop', 
        required: true 
    },
    order: { type: Number, required: true },
    estimatedArrivalTime: { type: String, required: true },
    actualArrivalTime: { type: Date },
    actualDepartureTime: { type: Date },
    studentsPickedUp: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
    studentsDroppedOff: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
}, { _id: false });

// Định nghĩa Trip Schema chính
const tripSchema = new Schema({
    routeId: { type: Schema.Types.ObjectId, ref: 'Route', required: true },
    busId: { type: Schema.Types.ObjectId, ref: 'Bus', required: true },
    driverId: { type: Schema.Types.ObjectId, ref: 'Driver', required: true },
    studentIds: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
    tripDate: { type: Date, required: true },
    direction: {
        type: String,
        enum: ['departure', 'arrival'],
        required: true,
    },
    status: {
        type: String,
        enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
        default: 'scheduled',
        required: true,
    },
    actualStartTime: { type: Date },
    actualEndTime: { type: Date },
    stopDetails: [stopDetailSchema],
}, { timestamps: true });

// Export Model
module.exports = mongoose.model('Trip', tripSchema);