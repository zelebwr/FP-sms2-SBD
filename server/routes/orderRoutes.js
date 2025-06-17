const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getOrderById, updateOrderStatus, deleteOrder } = require('../controllers/orderController');

// GET all orders
router.get('/', getOrders);

// POST create a new order
router.post('/', createOrder);

// GET a single order by ID
router.get('/:id', getOrderById);

// PUT update an order
router.put('/:id', updateOrderStatus);

module.exports = router;