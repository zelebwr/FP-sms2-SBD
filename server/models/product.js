const mongoose = require('mongoose');

// define the product schema (structure)
const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
  },
  image: {
    type: String,
    required: [true, 'Product image URL is required'],
  },
}, {
  timestamps: true, // Adds "createdAt" and "updatedAt" fields
});

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;