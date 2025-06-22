const express = require('express');
const router = express.Router();
const { placeOrder, getOrderHistory } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// All routes here are protected
router.use(protect);

router.route('/').post(placeOrder);
router.route('/history').get(getOrderHistory);

module.exports = router;