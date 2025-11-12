const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  regNumber: { type: String, required: true, unique: true },
  driverName: { type: String },
  driverPhone: { type: String },
  capacity: { type: Number, default: 12 },
  assignedRoute: { type: mongoose.Schema.Types.ObjectId, ref: 'Route' },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', VehicleSchema);
