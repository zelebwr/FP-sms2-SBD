const express = require('express');
const router = express.Router();
const {
    getCart,
    addItemToCart,
    removeItemFromCart
} = require('../controllers/cartController.js');
const { protect } = require('../middleware/authMiddleware.js');

// All cart routes are protected
router.use(protect);

router.route('/')
    .get(getCart);

router.route('/items')
    .post(addItemToCart);

router.route('/items/:productId')
    .delete(removeItemFromCart);

module.exports = router;