const Product = require('../models/product');

// 1. Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products from DB
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// 2. Create a product
const createProduct = async (req, res) => {
  const { name, price, category, image } = req.body;
  try {
    const product = await Product.create({ name, price, category, image });
    res.status(201).json(product); // 201 = "Created" status code
  } catch (error) {
    res.status(400).json({ message: 'Invalid product data' });
  }
};

// 3. Update a product
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Invalid product data' });
  }
};

// 4. Delete a product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getProducts, createProduct, updateProduct, deleteProduct };