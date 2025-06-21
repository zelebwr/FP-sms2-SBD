const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token expires in 30 days
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  // Now expects full_name, username is optional
  const { full_name, email, password, username } = req.body;

  if (!full_name || !email || !password) {
      return res.status(400).json({ message: 'Please provide full_name, email, and password' });
  }

  try {
    // Check if user already exists with the same email OR full_name
    const userExists = await User.findOne({
      where: {
        [Op.or]: [{ email: email }, { full_name: full_name }]
      }
    });

    if (userExists) {
      if (userExists.email === email) {
        return res.status(400).json({ message: 'A user with this email already exists' });
      }
      if (userExists.full_name === full_name) {
        return res.status(400).json({ message: 'A user with this full name already exists' });
      }
    }

    // Create a new user (password is hashed automatically by the model hook)
    const user = await User.create({
      full_name,
      email,
      password,
      username, // will be null if not provided
    });

    if (user) {
      res.status(201).json({
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        token: generateToken(user.user_id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ where: { email } });

    // Check if user exists and password matches
    if (user && (await user.comparePassword(password))) {
      res.json({
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        token: generateToken(user.user_id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  // The 'protect' middleware already attached the user object to req.user
  res.json(req.user);
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};