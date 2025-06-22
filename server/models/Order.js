const { DataTypes } = require('sequelize');
const sequelize = require('../config/db-mysql.js');

const Order = sequelize.define('Order', {
  order_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  assigned_admin_id: { type: DataTypes.INTEGER, allowNull: true },
  order_status: { type: DataTypes.ENUM('pending', 'delivering', 'delivered', 'cancelled'), defaultValue: 'pending' },
  shipping_first_name: { type: DataTypes.STRING, allowNull: false },
  shipping_last_name: { type: DataTypes.STRING, allowNull: false },
  shipping_phone: { type: DataTypes.STRING, allowNull: false },
  shipping_street: { type: DataTypes.TEXT, allowNull: false },
  shipping_city: { type: DataTypes.STRING, allowNull: false },
  shipping_province: { type: DataTypes.STRING, allowNull: false },
  shipping_zip_code: { type: DataTypes.STRING, allowNull: false },
  payment_method: { type: DataTypes.STRING, allowNull: false },
  courier_name: { type: DataTypes.STRING, allowNull: false },
  order_total: { type: DataTypes.INTEGER, allowNull: false },
  order_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'Orders',
  timestamps: false
});

// Associations are now handled exclusively in server/models/associations.js

module.exports = Order;