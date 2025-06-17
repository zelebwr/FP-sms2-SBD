const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');

// GET all products
router.get('/', getProducts);

// GET a single product by ID
router.get('/:id', getProductById);

// POST create a new product
router.post('/', createProduct);

// PUT update a product
router.put('/:id', updateProduct);

// DELETE a product
router.delete('/:id', deleteProduct);

module.exports = router;