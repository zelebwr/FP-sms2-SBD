const mongoose = require('mongoose');

console.log('📦 Loading MongoDB schemas...');

// Categories Schema
const categorySchema = new mongoose.Schema({
  category_id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  desc: {
    type: String,
    trim: true
  },
  is_active: {
    type: Boolean,
    default: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Ratings Schema
const ratingSchema = new mongoose.Schema({
  rating_id: {
    type: Number,
    required: true,
    unique: true
  },
  user_id: {
    type: Number,
    required: true
  },
  item_id: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review: String,
  review_title: String,
  verified_purchase: {
    type: Boolean,
    default: false
  },
  created: {
    type: Date,
    default: Date.now
  }
});

// Transactions Schema
const transactionSchema = new mongoose.Schema({
  trans_id: {
    type: String,
    required: true,
    unique: true
  },
  user_id: {
    type: Number,
    required: true
  },
  order_id: {
    type: Number,
    required: true
  },
  total_price: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Payments Schema
const paymentSchema = new mongoose.Schema({
  pay_id: {
    type: String,
    required: true,
    unique: true
  },
  trans_id: {
    type: String,
    required: true
  },
  pay_method: {
    type: String,
    required: true
  },
  pay_amount: {
    type: Number,
    required: true
  },
  pay_status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  pay_date: {
    type: Date,
    default: Date.now
  }
});

// Create and export models
const Category = mongoose.model('Category', categorySchema);
const Rating = mongoose.model('Rating', ratingSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);
const Payment = mongoose.model('Payment', paymentSchema);

console.log('✅ MongoDB schemas loaded successfully');

module.exports = {
  Category,
  Rating,
  Transaction,
  Payment
};