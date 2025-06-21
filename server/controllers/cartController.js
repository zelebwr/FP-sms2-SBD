const Cart = require('../models/Cart.js');
const Product = require('../models/Product.js'); // MySQL Product model

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.user_id });
        if (!cart) {
            // If no cart exists, return an empty one.
            return res.json({
                userId: req.user.user_id,
                items: [],
            });
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Add an item to the cart
// @route   POST /api/cart/items
// @access  Private
const addItemToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.user_id;

    try {
        // 1. Find the product in MySQL to get its current price
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // 2. Find the user's cart in MongoDB
        let cart = await Cart.findOne({ userId });

        if (cart) {
            // Cart exists, check if product is already in cart
            const itemIndex = cart.items.findIndex(item => item.productId === productId);

            if (itemIndex > -1) {
                // Product exists in cart, update quantity
                cart.items[itemIndex].quantity += quantity;
            } else {
                // Product not in cart, add new item
                cart.items.push({ 
                    productId, 
                    quantity, 
                    priceAtAddition: product.product_price 
                });
            }
        } else {
            // No cart for user, create a new one
            cart = await Cart.create({
                userId,
                items: [{ 
                    productId, 
                    quantity, 
                    priceAtAddition: product.product_price 
                }]
            });
        }
        
        const updatedCart = await cart.save();
        res.status(200).json(updatedCart);

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const updateCartItemQuantity = async (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = req.user.user_id;

    if (quantity <= 0) {
        return removeItemFromCart(req, res); // If quantity is 0 or less, remove item
    }

    try {
        let cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const itemIndex = cart.items.findIndex(p => p.productId == productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = quantity;
            const updatedCart = await cart.save();
            res.json(updatedCart);
        } else {
            res.status(404).json({ message: "Item not found in cart" });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Remove an item from the cart
// @route   DELETE /api/cart/items/:productId
// @access  Private
const removeItemFromCart = async (req, res) => {
    const { productId } = req.params;
    const userId = req.user.user_id;

    try {
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Filter out the item to be removed
        cart.items = cart.items.filter(item => item.productId !== parseInt(productId));

        const updatedCart = await cart.save();
        res.json(updatedCart);

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getCart,
    addItemToCart,
    removeItemFromCart,
    updateCartItemQuantity
};