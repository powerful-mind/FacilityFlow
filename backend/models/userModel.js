const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  role: String, // 'clubhead', 'faculty', 'hod', 'hallmanager'
  name: String,
  email: String,
  department: String,
  password: String,
  eSignature: String, // path to uploaded file
  hallResponsibility: String, // e.g. "Seminar Hall", "LRDC Hall", "Auditorium"
});

module.exports = mongoose.model('User', userSchema);
