const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Route = require('../models/Route');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const auth = require('../middleware/auth');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const { sendEmail, sendSms } = require('../utils/notification');

// list all bookings (admin)
router.get('/bookings', auth('admin'), async (req, res) => {
  try {
    const bookings = await Booking.find().populate('user').populate('route').sort('-createdAt');
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// assign driver & confirm booking
router.put('/booking/:id/assign', auth('admin'), async (req, res) => {
  try {
    const { driverName, vehicleReg, contact, status } = req.body;
    const booking = await Booking.findById(req.params.id).populate('user').populate('route');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    booking.driver = { name: driverName, vehicleReg, contact };
    if (status) booking.status = status;
    await booking.save();

    // notify employee
    await sendEmail(booking.user.email, 'MySafari booking confirmed', `Your ride on ${booking.route.name} has been assigned: ${driverName} (${vehicleReg}).`);
    await sendSms(booking.user.phone, `Your MySafari ride is confirmed: ${driverName} — ${vehicleReg}`).catch(()=>{});
    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// create route (admin) - already in /routes; mirrored here
router.post('/route', auth('admin'), async (req, res) => {
  try {
    const { name, stops, estimatedTime } = req.body;
    const route = await Route.create({ name, stops, estimatedTime });
    res.json(route);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// analytics endpoint
router.get('/analytics', auth('admin'), async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const confirmed = await Booking.countDocuments({ status: 'confirmed' });
    const pending = await Booking.countDocuments({ status: 'pending' });
    const byRoute = await Booking.aggregate([
      { $group: { _id: "$route", count: { $sum: 1 } } },
      { $lookup: { from: "routes", localField: "_id", foreignField: "_id", as: "route" } },
      { $unwind: "$route" },
      { $project: { _id: 0, routeName: "$route.name", count: 1 } }
    ]);
    res.json({ totalBookings, confirmed, pending, byRoute });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// export bookings CSV
router.get('/export/bookings.csv', auth('admin'), async (req, res) => {
  try {
    const bookings = await Booking.find().populate('user').populate('route').sort('-createdAt');
    const csvWriter = createCsvWriter({
      path: '/tmp/bookings_export.csv',
      header: [
        {id: 'id', title: 'ID'},
        {id: 'user', title: 'User'},
        {id: 'email', title: 'Email'},
        {id: 'route', title: 'Route'},
        {id: 'shiftEnd', title: 'ShiftEnd'},
        {id: 'status', title: 'Status'},
        {id: 'driver', title: 'Driver'}
      ]
    });

    const records = bookings.map(b => ({
      id: b._id.toString(),
      user: b.user?.name || '',
      email: b.user?.email || '',
      route: b.route?.name || '',
      shiftEnd: b.shiftEnd?.toISOString() || '',
      status: b.status,
      driver: b.driver?.name ? `${b.driver.name} (${b.driver.vehicleReg})` : ''
    }));

    await csvWriter.writeRecords(records);
    res.download('/tmp/bookings_export.csv');
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
