SET FOREIGN_KEY_CHECKS=0;

-- Empty existing tables before seeding
TRUNCATE TABLE Users;
TRUNCATE TABLE Products;

SET FOREIGN_KEY_CHECKS=1;


-- Insert Users (1 admin, 2 customers)
INSERT INTO Users (user_id, full_name, email, password, role) VALUES
(1, 'Admin User', 'admin@javva.com', '$2a$10$f/9S5jZ4c.bAnY.1d.t/J.sCM9a3fG5zJzC0p/iQ/QO.p4ySgM8/a', 'admin'),
(2, 'Jonathan Joestar', 'jojo@example.com', '$2a$10$f/9S5jZ4c.bAnY.1d.t/J.sCM9a3fG5zJzC0p/iQ/QO.p4ySgM8/a', 'customer'),
(3, 'Dio Brando', 'dio@example.com', '$2a$10$f/9S5jZ4c.bAnY.1d.t/J.sCM9a3fG5zJzC0p/iQ/QO.p4ySgM8/a', 'customer');


-- Insert Products (30 items across 4 categories)
INSERT INTO Products (product_name, product_description, product_price, product_stock, product_category, image_url) VALUES
-- Category: T-Shirts
('Javva Classic Logo Tee', 'A classic 100% cotton tee with the Javva brand logo.', 150000, 100, 'T-Shirts', '/images/tshirt-logo.jpg'),
('V-Neck Basic Tee', 'A soft, comfortable v-neck for everyday wear.', 175000, 80, 'T-Shirts', '/images/tshirt-vneck.jpg'),
('Graphic Print T-Shirt', 'A stylish tee with a modern artistic print.', 220000, 60, 'T-Shirts', '/images/tshirt-graphic.jpg'),
('Long Sleeve Henley', 'A comfortable long-sleeve Henley, perfect for cooler days.', 250000, 50, 'T-Shirts', '/images/tshirt-henley.jpg'),
('Striped Pocket Tee', 'A classic striped t-shirt with a functional chest pocket.', 180000, 70, 'T-Shirts', '/images/tshirt-striped.jpg'),
('Oversized Boxy Tee', 'A trendy, oversized tee for a relaxed fit.', 230000, 40, 'T-Shirts', '/images/tshirt-oversized.jpg'),
('Performance Athletic Tee', 'Moisture-wicking fabric to keep you cool during workouts.', 280000, 90, 'T-Shirts', '/images/tshirt-athletic.jpg'),

-- Category: Pants
('Slim Fit Chinos', 'Versatile and stylish slim fit chinos for any occasion.', 450000, 60, 'Pants', '/images/pants-chinos.jpg'),
('Classic Denim Jeans', 'Durable and timeless classic-fit denim jeans.', 550000, 40, 'Pants', '/images/pants-jeans.jpg'),
('Cargo Work Pants', 'Rugged cargo pants with multiple pockets for utility.', 480000, 50, 'Pants', '/images/pants-cargo.jpg'),
('Comfort-Fit Joggers', 'Soft, fleece-lined joggers for ultimate comfort.', 350000, 80, 'Pants', '/images/pants-joggers.jpg'),
('Linen Trousers', 'Lightweight and breathable linen trousers for warm weather.', 420000, 30, 'Pants', '/images/pants-linen.jpg'),
('Formal Dress Pants', 'Tailored dress pants for a sharp, professional look.', 600000, 25, 'Pants', '/images/pants-dress.jpg'),
('Tech Fabric Trousers', 'Stretchy, water-resistant tech fabric pants.', 580000, 35, 'Pants', '/images/pants-tech.jpg'),
('Relaxed Fit Corduroys', 'Soft corduroy pants with a relaxed, comfortable fit.', 470000, 45, 'Pants', '/images/pants-cords.jpg'),

-- Category: Dresses
('Summer Sundress', 'A light and airy sundress with a floral pattern.', 650000, 30, 'Dresses', '/images/dress-summer.jpg'),
('Elegant Evening Gown', 'A stunning full-length gown for formal events.', 1200000, 15, 'Dresses', '/images/dress-evening.jpg'),
('Casual T-Shirt Dress', 'A comfortable and casual t-shirt dress for daily wear.', 380000, 50, 'Dresses', '/images/dress-tshirt.jpg'),
('Wrap-Around Dress', 'A flattering wrap-around dress suitable for work or leisure.', 750000, 25, 'Dresses', '/images/dress-wrap.jpg'),
('Midi Knit Dress', 'A cozy and stylish ribbed knit midi dress.', 800000, 20, 'Dresses', '/images/dress-knit.jpg'),
('Bohemian Maxi Dress', 'A free-flowing maxi dress with bohemian-style embroidery.', 850000, 18, 'Dresses', '/images/dress-maxi.jpg'),

-- Category: Headwear
('Classic Baseball Cap', 'A simple and stylish baseball cap with an adjustable strap.', 120000, 150, 'Headwear', '/images/headwear-cap.jpg'),
('Wool Beanie', 'A warm and soft wool beanie for cold days.', 180000, 200, 'Headwear', '/images/headwear-beanie.jpg'),
('Wide-Brim Sun Hat', 'A fashionable hat providing excellent sun protection.', 250000, 80, 'Headwear', '/images/headwear-sunhat.jpg'),
('Fedora Hat', 'A classic felt fedora for a touch of timeless style.', 400000, 40, 'Headwear', '/images/headwear-fedora.jpg'),
('Bucket Hat', 'A trendy and casual bucket hat for a modern look.', 160000, 120, 'Headwear', '/images/headwear-bucket.jpg'),
('Silk Head Scarf', 'A versatile and elegant pure silk head scarf.', 300000, 60, 'Headwear', '/images/headwear-scarf.jpg'),
('Sports Visor', 'A lightweight visor for tennis, golf, or running.', 140000, 90, 'Headwear', '/images/headwear-visor.jpg'),
('Knit Headband', 'A cozy knit headband to keep your ears warm.', 110000, 110, 'Headwear', '/images/headwear-headband.jpg');