const Rating = require('../models/Rating.js');
const OrderItem = require('../models/OrderItem.js');

// @desc    Create a new rating for a product
// @route   POST /api/products/:productId/ratings
// @access  Private
const createRating = async (req, res) => {
    const { productId } = req.params;
    const { ratingValue, reviewText, imageUrl, videoUrl } = req.body;
    
    try {
        // 1. Verify the user has purchased this product
        const hasPurchased = await OrderItem.findOne({
            where: { product_id: productId },
            include: [{
                model: require('../models/Order'),
                where: { user_id: req.user.user_id, order_status: 'delivered' },
                required: true
            }]
        });

        if (!hasPurchased) {
            return res.status(403).json({ message: 'You can only review products you have purchased and received.' });
        }
        
        // 2. Check if user already reviewed this product
        const existingRating = await Rating.findOne({ productId, userId: req.user.user_id });
        if(existingRating) {
            return res.status(400).json({ message: 'You have already reviewed this product.' });
        }

        // 3. Create the new rating in MongoDB
        const rating = await Rating.create({
            productId: parseInt(productId),
            userId: req.user.user_id,
            ratingValue,
            reviewText,
            imageUrl,
            videoUrl
        });

        res.status(201).json(rating);

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// @desc    Get all ratings for a product
// @route   GET /api/products/:productId/ratings
// @access  Public
const getProductRatings = async (req, res) => {
    try {
        const ratings = await Rating.find({ productId: req.params.productId });
        res.json(ratings);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}


module.exports = { createRating, getProductRatings };