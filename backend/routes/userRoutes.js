const express = require('express');
const router = express.Router();
const multer = require('multer');
const User = require('../models/userModel');

const upload = multer({ dest: 'uploads/hodSigns/' });

// 🟩 Register Route — Restricts duplicate HODs and Hall Managers
router.post('/register', upload.single('eSignature'), async (req, res) => {
  try {
    const { name, email, password, role, department, hallResponsibility } = req.body;

    // 🧠 Rule 1: Only one HOD per department (case-insensitive)
    if (role === 'hod') {
      const existingHOD = await User.findOne({
        role: 'hod',
        department: { $regex: new RegExp(`^${department}$`, 'i') },
      });

      if (existingHOD) {
        return res.status(400).json({
          message: `⚠️ A HOD is already registered for the ${department} department.`,
        });
      }
    }

    // 🧠 Rule 2: Only one Hall Manager per hall (case-insensitive, across departments)
    if (role === 'hallmanager' && hallResponsibility) {
      const existingManager = await User.findOne({
        role: 'hallmanager',
        hallResponsibility: { $regex: new RegExp(`^${hallResponsibility}$`, 'i') },
      });

      if (existingManager) {
        return res.status(400).json({
          message: `⚠️ A Hall Manager is already assigned to ${hallResponsibility}.`,
        });
      }
    }

    // ✅ Create new user
    const user = new User({
      name,
      email,
      password,
      role,
      department,
      hallResponsibility,
      eSignature: req.file ? req.file.path : '',
    });

    await user.save();
    res.json({ message: '✅ User Registered Successfully', user });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(400).json({ message: 'Registration failed', error: err.message });
  }
});

// 🟨 Strict Login — must match email, password, and role
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.findOne({ email, password, role });

    if (!user) {
      return res.status(400).json({
        message: 'Invalid credentials or role mismatch',
      });
    }

    res.json({ message: 'Login successful', user });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
