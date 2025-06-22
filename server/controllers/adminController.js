const User = require('../models/User.js');
const Product = require('../models/Product.js');
const Order = require('../models/Order.js');
const Cart = require('../models/Cart.js');
const sequelize = require('../config/db-mysql');


// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        const userCount = await User.count();
        const productCount = await Product.count();
        const orderCount = await Order.count();
        const cartCount = await Cart.countDocuments();
        res.json({ userCount, productCount, orderCount, cartCount });
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
            user.role = req.body.role || user.role;
            await user.save();
            res.json({ message: "User role updated" });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// @desc    Get all orders (for admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [{ model: User, as: 'customer', attributes: ['full_name', 'email'] }],
            order: [['order_date', 'DESC']]
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update an order's status
// @route   PUT /api/admin/orders/:orderId/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.orderId);
        if (order) {
            order.order_status = req.body.status || order.order_status;
            await order.save();
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { getDashboardStats, updateUserRole, getOrders, updateOrderStatus };