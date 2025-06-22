const Wishlist = require('../models/Wishlist.js');
const Product = require('../models/Product.js');
const { Op } = require('sequelize');

// @desc    Toggle a product in the user's wishlist
// @route   POST /api/wishlist/toggle
// @access  Private
const toggleWishlistItem = async (req, res) => {
    const { productId } = req.body;
    const userId = req.user.user_id;

    if (!productId) {
        return res.status(400).json({ message: 'Product ID is required' });
    }

    try {
        // Find the user's wishlist, or create it if it doesn't exist
        let wishlist = await Wishlist.findOne({ userId });
        if (!wishlist) {
            wishlist = new Wishlist({ userId, items: [] });
        }

        // Check if the product is already in the wishlist
        const itemIndex = wishlist.items.findIndex(item => item.productId === productId);

        let isInWishlist = false;
        if (itemIndex > -1) {
            // If it exists, remove it (toggle off)
            wishlist.items.splice(itemIndex, 1);
            isInWishlist = false;
        } else {
            // If it doesn't exist, add it (toggle on)
            wishlist.items.push({ productId, addedAt: new Date() });
            isInWishlist = true;
        }

        await wishlist.save();
        res.status(200).json({
            message: isInWishlist ? 'Added to wishlist' : 'Removed from wishlist',
            wishlist: wishlist.items
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all items in the user's wishlist with search/filter
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res) => {
    const userId = req.user.user_id;
    const { search, category, sortBy, price_gt, price_lt } = req.query;

    try {
        // 1. Get the list of product IDs from the user's wishlist in MongoDB
        const wishlist = await Wishlist.findOne({ userId });

        if (!wishlist || wishlist.items.length === 0) {
            return res.json([]); // Return an empty array if wishlist is empty
        }

        const productIds = wishlist.items.map(item => item.productId);

        // 2. Build a dynamic query for MySQL based on the product IDs and filters
        let where = {
            product_id: { [Op.in]: productIds } // Base filter: only fetch products in the wishlist
        };
        let order = [];

        if (search) where.product_name = { [Op.like]: `%${search}%` };
        if (category) where.product_category = category;
        if (price_gt) where.product_price = { ...where.product_price, [Op.gt]: parseInt(price_gt) };
        if (price_lt) where.product_price = { ...where.product_price, [Op.lt]: parseInt(price_lt) };
        if (sortBy === 'price_asc') order.push(['product_price', 'ASC']);
        if (sortBy === 'price_desc') order.push(['product_price', 'DESC']);
        
        // 3. Fetch the full product details from MySQL
        const products = await Product.findAll({ where, order });

        res.json(products);

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


module.exports = {
    toggleWishlistItem,
    getWishlist
};