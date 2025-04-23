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

module.exports = router;