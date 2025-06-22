const sequelize = require('../config/db-mysql.js');
const User = require('../models/User.js');
const Product = require('../models/Product.js');
const Order = require('../models/Order.js');
const OrderItem = require('../models/OrderItem.js');
const Cart = require('../models/Cart.js');

// @desc    Create a new order from cart
// @route   POST /api/orders
// @access  Private
const placeOrder = async (req, res) => {
    const {
        shipping_first_name, shipping_last_name, shipping_phone,
        shipping_street, shipping_city, shipping_province, shipping_zip_code,
        payment_method, courier_name
    } = req.body;
    
    const t = await sequelize.transaction(); // Start a new transaction

    try {
        // 1. Get the user's cart from MongoDB
        const cart = await Cart.findOne({ userId: req.user.user_id });
        if (!cart || cart.items.length === 0) {
            await t.rollback();
            return res.status(400).json({ message: 'Your cart is empty' });
        }

        // 2. Fetch product details and calculate total
        const productIds = cart.items.map(item => item.productId);
        const products = await Product.findAll({ where: { product_id: productIds } });
        
        let orderTotal = 0;
        for (const item of cart.items) {
            const product = products.find(p => p.product_id === item.productId);
            if (!product) throw new Error(`Product with ID ${item.productId} not found`);
            if (product.product_stock < item.quantity) throw new Error(`Not enough stock for ${product.product_name}`);
            orderTotal += product.product_price * item.quantity;
        }
        
        // 3. Randomly assign an admin
        const admins = await User.findAll({ where: { role: 'admin' } });
        if (admins.length === 0) throw new Error('No admins available to assign order');
        const assignedAdmin = admins[Math.floor(Math.random() * admins.length)];

        // 4. Create the Order in MySQL
        const order = await Order.create({
            user_id: req.user.user_id,
            assigned_admin_id: assignedAdmin.user_id,
            order_total: orderTotal,
            shipping_first_name, shipping_last_name, shipping_phone, shipping_street,
            shipping_city, shipping_province, shipping_zip_code,
            payment_method, courier_name
        }, { transaction: t });

        // 5. Create OrderItems and update stock
        for (const item of cart.items) {
            const product = products.find(p => p.product_id === item.productId);
            await OrderItem.create({
                order_id: order.order_id,
                product_id: item.productId,
                quantity: item.quantity,
                price_at_purchase: product.product_price
            }, { transaction: t });

            // Decrement stock
            product.product_stock -= item.quantity;
            await product.save({ transaction: t });
        }

        // 6. If everything is successful, commit the transaction
        await t.commit();
        
        // 7. Finally, clear the user's cart in MongoDB
        await cart.deleteOne();

        res.status(201).json(order);

    } catch (error) {
        await t.rollback(); // Rollback the transaction on any error
        res.status(500).json({ message: 'Failed to place order', error: error.message });
    }
};

// @desc    Get order history for logged-in user
// @route   GET /api/orders/history
// @access  Private
const getOrderHistory = async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { user_id: req.user.user_id },
            include: [{ model: OrderItem, include: [Product] }],
            order: [['order_date', 'DESC']]
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { placeOrder, getOrderHistory };