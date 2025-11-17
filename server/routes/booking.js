const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Route = require('../models/Route');
const auth = require('../middleware/auth');
const { sendEmail, sendSms } = require('../utils/notification');

// Create booking (employee)
router.post('/', auth('employee'), async (req, res) => {
  try {
    const { routeId, shiftEnd } = req.body;
    if (!routeId || !shiftEnd) return res.status(400).json({ message: 'Missing fields' });
    const route = await Route.findById(routeId);
    if (!route) return res.status(400).json({ message: 'Route not found' });

    // Only allow booking for shift times (e.g., after midnight) — example rule:
    const shiftDate = new Date(shiftEnd);
    // if you want "after midnight only" enforce here:
    // if (shiftDate.getHours() < 0 || shiftDate.getHours() > 23) { }
    // We'll allow all bookings but admin can filter; also validate if shift ends after 22:00 or after midnight depending on policy.
    const booking = await Booking.create({ user: req.user._id, route: route._id, shiftEnd: shiftDate });
    // Notify admin? For demo, email employee
    await sendEmail(req.user.email, 'MySafari booking requested', `Your booking is pending for route ${route.name} at ${shiftDate.toLocaleString()}`);
    await sendSms(req.user.phone, `MySafari: booking requested for ${route.name} at ${shiftDate.toLocaleString()}`).catch(()=>{});
    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Employee: get own bookings
router.get('/me', auth('employee'), async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('route').sort('-createdAt');
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// cancel booking (employee)
router.put('/:id/cancel', auth('employee'), async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    booking.status = 'cancelled';
    await booking.save();
    await sendEmail(req.user.email, 'MySafari booking cancelled', `Your booking for ${booking._id} has been cancelled.`);
    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
