const express = require('express');
const router = express.Router();
const {
    getCart,
    addItemToCart,
    removeItemFromCart,
    updateCartItemQuantity
} = require('../controllers/cartController.js');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // Protect all cart routes

router.route('/').get(getCart);
router.route('/items').post(addItemToCart);

// Routes for specific items in the cart
router.route('/items/:productId')
    .put(updateCartItemQuantity)
    .delete(removeItemFromCart);

module.exports = router;