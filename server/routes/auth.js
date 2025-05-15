const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const twilio = require('twilio');
const User = require('../models/User');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const verifySid = process.env.TWILIO_VERIFY_SID;

// Send OTP
router.post('/send-verification', async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    const verification = await client.verify.v2.services(verifySid)
      .verifications.create({ to: phoneNumber, channel: 'sms' });

    res.json({ success: true, verification });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Verify OTP
router.post('/verify-code', async (req, res) => {
  try {
    const { phoneNumber, code } = req.body;

    const verificationCheck = await client.verify.v2.services(verifySid)
      .verificationChecks.create({ to: phoneNumber, code });

    if (verificationCheck.status === 'approved') {
      let user = await User.findOne({ phoneNumber });

      if (!user) {
        user = await User.create({ phoneNumber, verified: true });
      } else {
        user.verified = true;
        await user.save();
      }

      const hasCompletedProfile = user.username && user.password;

      res.json({
        success: true,
        userId: user._id,
        phoneNumber: user.phoneNumber,
        username: user.username,
        hasPassword: !!user.password,
        hasCompletedProfile,
        user
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid or expired code' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Complete profile
router.post('/complete-profile', async (req, res) => {
  try {
    const { userId, username, password, firstName, lastName, crop, district } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser && existingUser._id.toString() !== userId) {
      return res.status(409).json({ success: false, message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.findByIdAndUpdate(
      userId,
      {
        username,
        password: hashedPassword,
        firstName,
        lastName,
        crop,
        district
      },
      { new: true }
    );

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Username/password login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.json({
      success: true,
      userId: user._id,
      username: user.username,
      crop: user.crop || 'No crop data found',//change
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user profile
router.get('/profile/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update profile
router.put('/profile/:userId', async (req, res) => {
  try {
    const { firstName, lastName, crop, district } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { firstName, lastName, crop, district },
      { new: true }
    ).select('-password');

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
