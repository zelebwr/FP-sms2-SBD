const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    const { product_name, product_description, product_price, product_stock, product_category, image_url } = req.body;
    try {
        const product = await Product.create({
            product_name,
            product_description,
            product_price,
            product_stock,
            product_category,
            image_url
        });
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: 'Invalid product data', error: error.message });
    }
};


module.exports = {
  getProducts,
  getProductById,
  createProduct
};