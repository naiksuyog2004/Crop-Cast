const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming you have a User model
const router = express.Router();

// Middleware to verify JWT
const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
        req.userId = decoded.id; // Attach userId to the request object
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Get user details
router.get('/user', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.userId); // Fetch user by ID
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ username: user.username }); // Return the username
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});
router.put('/profile/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const updatedData = req.body;

        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true }); // Update user in MongoDB
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, user: updatedUser }); // Return the updated user data
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});
//change
// Fetch crop data for the logged-in user
router.get('/get-crop', async (req, res) => {
    const { user_id } = req.query; // Assuming user_id is passed as a query parameter

    try {
        // Find user in the database
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Return crop data
        res.json({ crop: user.crop || 'No crop data found' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});
module.exports = router;