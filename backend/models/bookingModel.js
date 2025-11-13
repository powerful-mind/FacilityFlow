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
  hodSignature: String, // ✅ HOD’s signature path
  submittedBy: String,
  hallManager: String, // ✅ assigned hall manager
  rejectionReason: String, // ✅ reason entered by hall manager
});

module.exports = mongoose.model('Booking', bookingSchema);
