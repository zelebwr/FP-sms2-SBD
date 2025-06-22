const express = require('express');
// This allows us to get params from the parent router (e.g., :productId)
const router = express.Router({ mergeParams: true }); 
const { createRating, getProductRatings } = require('../controllers/ratingController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createRating)
    .get(getProductRatings);

module.exports = router;