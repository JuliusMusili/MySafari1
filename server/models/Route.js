const mongoose = require('mongoose');

const RouteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  stops: [{ type: String }],
  estimatedTime: Number // minutes
}, { timestamps: true });

module.exports = mongoose.model('Route', RouteSchema);

