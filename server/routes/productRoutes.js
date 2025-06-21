const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getRelatedProducts
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// Route for featured products
router.get('/featured', getFeaturedProducts);

// General product routes
router.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

// Specific product routes by ID
router.route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

// Route for related products
router.get('/:id/related', getRelatedProducts);

module.exports = router;