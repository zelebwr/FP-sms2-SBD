const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

console.log("Setting up model associations...");

// User-Order Association
User.hasMany(Order, { foreignKey: 'user_id' });
Order.belongsTo(User, { as: 'customer', foreignKey: 'user_id' });

// Admin-Order Association
Order.belongsTo(User, { as: 'admin', foreignKey: 'assigned_admin_id' });

// Order-OrderItem Association
Order.hasMany(OrderItem, { foreignKey: 'order_id' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

// Product-OrderItem Association
Product.hasMany(OrderItem, { foreignKey: 'product_id' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id' });

console.log("✅ Model associations set up successfully.");
