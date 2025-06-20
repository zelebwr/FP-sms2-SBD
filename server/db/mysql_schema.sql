CREATE DATABASE IF NOT EXISTS `javva_ecommerce_db`;
USE `javva_ecommerce_db`;

DROP TABLE IF EXISTS `Order_Items`;
DROP TABLE IF EXISTS `Orders`;
DROP TABLE IF EXISTS `Users`;
DROP TABLE IF EXISTS `Products`;

CREATE TABLE IF NOT EXISTS Users (
user_id INT AUTO_INCREMENT PRIMARY KEY,
username VARCHAR(50),
email VARCHAR(100) UNIQUE NOT NULL,
password VARCHAR(255) NOT NULL,
full_name VARCHAR(100) UNIQUE NOT NULL,
address TEXT,
phone_number VARCHAR(20),
date_of_birth DATE,
role ENUM('admin', 'customer') NOT NULL DEFAULT 'customer',
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Products (
product_id INT AUTO_INCREMENT PRIMARY KEY,
product_name VARCHAR(100) NOT NULL,
product_description TEXT,
product_price DECIMAL(10, 2) NOT NULL,
product_stock INT NOT NULL DEFAULT 0,
product_category VARCHAR(50),
image_url VARCHAR(255),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Orders (
order_id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT NOT NULL,
order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
order_status ENUM('pending', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
payment_method VARCHAR(50),
payment_status ENUM('pending', 'completed', 'failed') NOT NULL DEFAULT 'pending',
shipping_address TEXT NOT NULL,
order_total DECIMAL(10, 2) NOT NULL,
FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE IF NOT EXISTS Order_Items (
order_item_id INT AUTO_INCREMENT PRIMARY KEY,
order_id INT NOT NULL,
product_id INT NOT NULL,
quantity INT NOT NULL,
price_at_purchase DECIMAL(10, 2) NOT NULL,
FOREIGN KEY (order_id) REFERENCES Orders(order_id),
FOREIGN KEY (product_id) REFERENCES Products(product_id)
);