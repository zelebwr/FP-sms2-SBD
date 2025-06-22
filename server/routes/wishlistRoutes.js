const express = require('express');
const router = express.Router();
const {
    toggleWishlistItem,
    getWishlist
} = require('../controllers/wishlistController.js');
const { protect } = require('../middleware/authMiddleware');

// All wishlist routes are protected
router.use(protect);

router.route('/')
    .get(getWishlist);

router.route('/toggle')
    .post(toggleWishlistItem);

module.exports = router;