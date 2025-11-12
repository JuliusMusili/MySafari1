const express = require('express');
const router = express.Router();
const Route = require('../models/Route');
const Vehicle = require('../models/Vehicle');
const auth = require('../middleware/auth');

// Create route (admin)
router.post('/', auth('admin'), async (req, res) => {
  try {
    const { name, stops, estimatedTime } = req.body;
    const route = await Route.create({ name, stops, estimatedTime });
    res.json(route);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// List routes (public to authenticated users)
router.get('/', auth(), async (req, res) => {
  try {
    const routes = await Route.find();
    res.json(routes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Vehicles (admin)
router.post('/vehicle', auth('admin'), async (req, res) => {
  try {
    const { regNumber, driverName, driverPhone, capacity, assignedRoute } = req.body;
    const Vehicle = require('../models/Vehicle');
    const v = await Vehicle.create({ regNumber, driverName, driverPhone, capacity, assignedRoute });
    res.json(v);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// list vehicles
router.get('/vehicles', auth('admin'), async (req, res) => {
  try {
    const Vehicle = require('../models/Vehicle');
    const vehicles = await Vehicle.find().populate('assignedRoute');
    res.json(vehicles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
