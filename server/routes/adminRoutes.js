const express = require('express');
const router = express.Router();
const { getDashboardStats, updateUserRole } = require('../controllers/adminController.js');
const { protect, admin } = require('../middleware/authMiddleware');

// All routes in this file are protected and require admin role
router.use(protect, admin);

router.get('/stats', getDashboardStats);
router.put('/users/:userId/role', updateUserRole);


module.exports = router;