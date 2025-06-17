const Order = require('../models/order');

// 1. Create a new order
const createOrder = async (req, res) => {
  const { products, customerName, address, contactNumber } = req.body;
  try {
    const order = await Order.create({ products, customerName, address, contactNumber });
    res.status(201).json(order); // 201 = "Created" status code
  } catch (error) {
    res.status(400).json({ message: 'Invalid order data' });
  }
};

// 2. Get all orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('products.product'); // Fetch all orders from DB and populate product details
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// 3. Get order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('products.product');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// 4. Update an order
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true, runValidators: true }
    );
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
    } catch (error) {
        res.status(400).json({ message: 'Invalid order data' });
    }
};

module.exports = { createOrder, getOrders, getOrderById, updateOrderStatus };