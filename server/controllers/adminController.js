const User = require('../models/User.js');
const Product = require('../models/Product.js');
const Cart = require('../models/Cart.js'); // For stats
const { Op } = require('sequelize');


// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        // MySQL Stats
        const userCount = await User.count();
        const productCount = await Product.count();
        
        const productsByCategory = await Product.findAll({
            attributes: [
                'product_category',
                [sequelize.fn('COUNT', sequelize.col('product_id')), 'count']
            ],
            group: ['product_category']
        });

        // MongoDB Stats
        const cartCount = await Cart.countDocuments();
        // Add more mongo stats here if needed (e.g., ratings, wishlists)

        res.json({
            users: {
                total: userCount,
            },
            products: {
                total: productCount,
                byCategory: productsByCategory
            },
            carts: {
                active: cartCount
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// @desc    Update a user's role
// @route   PUT /api/admin/users/:userId/role
// @access  Private/Admin
const updateUserRole = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.userId);

        if (user) {
            user.role = req.body.role || user.role; // Update role from request body
            await user.save();
            res.json({ message: "User role updated", user: {
                user_id: user.user_id,
                full_name: user.full_name,
                email: user.email,
                role: user.role
            }});
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

module.exports = { getDashboardStats, updateUserRole };