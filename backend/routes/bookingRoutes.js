const express = require('express');
const router = express.Router();
const Booking = require('../models/bookingModel');
const User = require('../models/userModel');

// 🟢 Create booking
router.post('/create', async (req, res) => {
  try {
    const { hall, date, timeSlots } = req.body;

    // Find hall manager for this hall
    const manager = await User.findOne({
      role: 'hallmanager',
      hallResponsibility: hall,
    });

    if (!manager) {
      return res.status(400).json({ message: `No hall manager found for ${hall}` });
    }

    // Check if selected slots are already booked
    const existing = await Booking.find({
      hall,
      date,
      timeSlots: { $in: timeSlots },
      status: { $in: ['HOD Approved', 'Hall Approved'] },
    });

    if (existing.length > 0) {
      return res.status(400).json({ message: 'Some selected time slots are already booked!' });
    }

    const booking = new Booking({
      ...req.body,
      hallManager: manager.name,
    });

    await booking.save();
    res.json({ message: 'Booking Submitted', booking });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🟡 Get all bookings
router.get('/', async (req, res) => {
  const bookings = await Booking.find();
  res.json(bookings);
});

// 🟨 HOD approval (signature added, no reject)
router.put('/approve/hod/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.status = 'HOD Approved';
    booking.hodSignature = req.body.hodSignature;
    await booking.save();

    res.json({ message: 'Approved by HOD' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟩 Hall manager approval
router.put('/approve/hall/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.status = 'Hall Approved';
    booking.rejectionReason = ''; // clear old rejection reason if any
    await booking.save();

    res.json({ message: 'Approved by Hall Manager' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟥 Hall manager rejection (with reason)
router.put('/reject/hall/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.status = 'Rejected by Hall Manager';
    booking.rejectionReason = req.body.reason || 'No reason provided';
    await booking.save();

    res.json({ message: 'Booking Rejected by Hall Manager' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🗑️ Delete a booking (used for clear button)
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Booking.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json({ message: 'Booking deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
