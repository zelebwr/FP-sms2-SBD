const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, updatePassword } = require('../controllers/userController');

// Correctly import the 'protect' middleware.
// There is no 'authenticate' export, the correct function is 'protect'.
const { protect } = require('../middleware/authMiddleware');

// All routes below this require authentication. Use the 'protect' middleware.
router.use(protect);

// Group routes for the same path ('/profile') together
router.route('/profile')
  .get(getProfile)
  .put(updateProfile);

// Route for updating password
router.put('/password', updatePassword);

module.exports = router;