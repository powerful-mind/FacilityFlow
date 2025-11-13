const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  date: String,
  timeSlots: [String],
  department: String,
  eventName: String,
  guestNames: String,
  totalPersons: Number,
  facultyStaff: String,
  contactNumber: String,
  peonAttendant: String,
  hall: String,
  status: { type: String, default: 'Pending' },
  hodSignature: String,
  submittedBy: String,
  hallManager: String,
  rejectionReason: String,
  
  // ✅ NEW FIELD: users who hid this booking
  hiddenBy: {
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model('Booking', bookingSchema);
