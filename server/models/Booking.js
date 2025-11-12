const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  route: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
  shiftEnd: { type: Date, required: true },
  status: { type: String, enum: ['pending','confirmed','cancelled','completed'], default: 'pending' },
  driver: { name: String, vehicleReg: String, contact: String },
  createdByAdmin: { type: Boolean, default: false },
  rating: { type: Number, min: 1, max: 5 }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
