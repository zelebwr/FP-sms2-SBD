const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');

// POST register a new user
router.post('/register', register);

// POST login a user
router.post('/login', login);

// GET user profile
router.get('/profile', protect, getProfile);

module.exports = router;