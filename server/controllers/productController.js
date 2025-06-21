const { Op } = require('sequelize');
const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { search, category, sortBy, price_gt, price_lt } = req.query;

    let where = {}; // Conditions for filtering
    let order = []; // Conditions for sorting

    // 1. Handle search by product name
    if (search) {
      where.product_name = { [Op.like]: `%${search}%` };
    }

    // 2. Handle filtering by category
    if (category) {
      where.product_category = category;
    }
    
    // 3. Handle price range filtering
    if(price_gt) {
        where.product_price = { ...where.product_price, [Op.gt]: parseInt(price_gt) };
    }
    if(price_lt) {
        where.product_price = { ...where.product_price, [Op.lt]: parseInt(price_lt) };
    }

    // 4. Handle sorting
    if (sortBy) {
      if (sortBy === 'price_asc') {
        order.push(['product_price', 'ASC']);
      } else if (sortBy === 'price_desc') {
        order.push(['product_price', 'DESC']);
      }
    }

    const products = await Product.findAll({ where, order });
    res.json(products);

  } catch (error) {
    console.error('Error fetching products:', error);
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
        const product = await Product.create({ product_name, product_description, product_price, product_stock, product_category, image_url });
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: 'Invalid product data', error: error.message });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (product) {
            await product.update(req.body);
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Invalid product data', error: error.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (product) {
            await product.destroy();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get featured products (e.g., latest 8)
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            order: [['created_at', 'DESC']],
            limit: 8
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get related products (from same category)
// @route   GET /api/products/:id/related
// @access  Public
const getRelatedProducts = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product || !product.product_category) {
            return res.json([]); // Return empty if no product or category
        }

        const relatedProducts = await Product.findAll({
            where: {
                product_category: product.product_category,
                product_id: { [Op.ne]: req.params.id } // Exclude the product itself
            },
            limit: 4
        });
        res.json(relatedProducts);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getFeaturedProducts, getRelatedProducts };