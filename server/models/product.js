const { DataTypes } = require('sequelize');
const sequelize = require('../config/db-mysql');

const Product = sequelize.define('Product', {
  product_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  product_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  product_description: {
    type: DataTypes.TEXT,
  },
  product_price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  product_stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  product_category: {
    type: DataTypes.STRING(50),
  },
  image_url: {
    type: DataTypes.STRING(255),
  },
}, {
  tableName: 'Products',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Product;