-- =========================================================
-- ShopSphere E-Commerce Database Seed Data
-- Rich Realistic Catalog with 14 Flipkart-style Categories
-- =========================================================

USE shopsphere_db;

-- 1. Insert Categories
INSERT INTO categories (id, name, slug, icon, image_url, description, is_featured, display_order) VALUES
(1, 'For You', 'for-you', 'Sparkles', 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=300&q=80', 'Personalized picks curated just for your tastes and recent searches', TRUE, 1),
(2, 'Fashion', 'fashion', 'Shirt', 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=300&q=80', 'Trendy apparel, ethnic wear, footwear, and accessories for all', TRUE, 2),
(3, 'Mobiles', 'mobiles', 'Smartphone', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80', 'Flagship 5G phones, budget champions, tablets & phone accessories', TRUE, 3),
(4, 'Electronics', 'electronics', 'Laptop', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=300&q=80', 'Laptops, smartwatches, headphones, gaming gear, and monitors', TRUE, 4),
(5, 'Beauty', 'beauty', 'Sparkle', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=300&q=80', 'Skincare, haircare, makeup, fragrances and grooming essentials', TRUE, 5),
(6, 'Home', 'home', 'Home', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=300&q=80', 'Home decor, bedsheets, curtains, lighting and kitchen organizers', TRUE, 6),
(7, 'Appliances', 'appliances', 'Tv', 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=300&q=80', 'Air conditioners, refrigerators, washing machines, microwaves', TRUE, 7),
(8, 'Toys & Baby Products', 'toys-baby', 'Baby', 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=300&q=80', 'Educational toys, action figures, baby care, diapers and strollers', TRUE, 8),
(9, 'Food & Health', 'food-health', 'Apple', 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=300&q=80', 'Organic snacks, dry fruits, protein powders, vitamins and health drinks', TRUE, 9),
(10, 'Auto Accessories', 'auto-accessories', 'Car', 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=300&q=80', 'Car perfumes, dash cams, helmets, bike covers, seat cushions', TRUE, 10),
(11, 'Sports', 'sports', 'Trophy', 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=300&q=80', 'Cricket gear, fitness equipment, yoga mats, badminton rackets', TRUE, 11),
(12, 'Furniture', 'furniture', 'Armchair', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=300&q=80', 'Sofas, study tables, beds, ergonomic chairs, shoe racks', TRUE, 12),
(13, 'Books', 'books', 'BookOpen', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=300&q=80', 'Bestsellers, academic books, fiction, business, comics and stationery', TRUE, 13),
(14, 'Two Wheelers', 'two-wheelers', 'Bike', 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=300&q=80', 'Electric scooters, petrol motorcycles, riding jackets & safety gear', TRUE, 14)
ON DUPLICATE KEY UPDATE name=VALUES(name), icon=VALUES(icon), image_url=VALUES(image_url);

-- 2. Insert Users (Password is bcrypt of 'admin123' and 'password123')
INSERT INTO users (id, name, email, password_hash, phone, role, avatar_url) VALUES
(1, 'Admin Manager', 'admin@shopsphere.com', '$2a$10$v0qNdD14iRc0g7pNAnZ0Ju09TYCNvZiVgg5wesuIp.lC9xPP16hAe', '+91 98765 43210', 'admin', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'),
(2, 'Rahul Sharma', 'customer@example.com', '$2a$10$2xj2S3PD3zWYoZSL8.F6neVpQAa5LHB.mUDYa.fvAX4Z1QA4WJ.cq', '+91 91234 56789', 'customer', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 3. Insert Addresses
INSERT INTO addresses (id, user_id, full_name, phone, pincode, locality, address_line, city, state, landmark, alternate_phone, address_type, is_default) VALUES
(1, 2, 'Rahul Sharma', '+91 91234 56789', '560034', 'Koramangala 4th Block', 'Flat 402, Sunshine Residency, 80 Feet Road', 'Bengaluru', 'Karnataka', 'Near Sony World Signal', '+91 98765 01234', 'Home', TRUE),
(2, 2, 'Rahul Sharma', '+91 91234 56789', '560103', 'Bellandur Tech Park', 'Tower 3, Level 5, CloudTech Solutions', 'Bengaluru', 'Karnataka', 'Opposite EcoSpace', NULL, 'Work', FALSE)
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);

-- 4. Insert Products
INSERT INTO products (id, category_id, name, slug, brand, model_number, description, original_price, discounted_price, stock, rating, rating_count, reviews_count, is_assured, is_featured, is_deal_of_the_day, is_trending, is_spotlight, is_popular_pick, popular_pick_title, badge, colors, sizes, specifications) VALUES
-- Popular Picks (Promotional Banner)
(1, 6, 'Milton Thermosteel Flip Lid Insulated Water Bottle (1000 ml)', 'milton-thermosteel-bottle-1000ml', 'Milton', 'MIL-TS-1000', 'High grade 304 stainless steel vacuum insulated water bottle. Keeps beverages hot or cold for up to 24 hours. Leak-proof flip lid with carry strap.', 899.00, 129.00, 120, 4.6, 14200, 3120, TRUE, TRUE, FALSE, TRUE, FALSE, TRUE, 'Milton Bottles – From ₹129', 'Special Price', '["Silver", "Matte Black", "Ocean Blue"]', '["500ml", "750ml", "1000ml"]', '{"Material": "18/8 Stainless Steel", "Capacity": "1000 ml", "Insulation": "Double wall vacuum", "Warranty": "1 Year Manufacturer"}'),
(2, 2, 'Puma Men Lightweight Breathable Walking & Running Shoes', 'puma-lightweight-running-shoes', 'Puma', 'PUM-STRIDE-01', 'Engineered mesh upper for superior ventilation, EVA responsive cushioned midsole, durable anti-slip rubber grip. Designed for all-day comfort and workout sessions.', 2499.00, 199.00, 85, 4.4, 9850, 1840, TRUE, TRUE, FALSE, TRUE, FALSE, TRUE, 'Comfortable Shoes – From ₹199', 'Deal of Day', '["Charcoal Grey", "Navy Blue", "Triple Black"]', '["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"]', '{"Outer Material": "Mesh", "Sole": "EVA + Rubber", "Closure": "Lace-Ups", "Weight": "280g"}'),
(3, 4, 'Fastrack Analog Minimalist Quartz Black Dial Watch', 'fastrack-analog-minimalist-watch', 'Fastrack', 'FT-3245-BK', 'Sleek contemporary design with mineral glass protection, genuine leather strap, water-resistant up to 50 meters, and high-precision Japanese quartz movement.', 1995.00, 99.00, 150, 4.3, 18400, 4200, TRUE, TRUE, FALSE, TRUE, FALSE, TRUE, 'Watches – From ₹99', 'Lowest Price', '["Pitch Black", "Brown Leather", "Metallic Silver"]', '["Standard"]', '{"Display": "Analog", "Water Resistance": "50 M", "Strap Material": "Genuine Leather", "Battery Life": "2 Years"}'),
(4, 7, 'Philips Daily Collection 750W 3-Jar Mixer Grinder', 'philips-750w-mixer-grinder', 'Philips', 'HL7756/00', 'Tough air-ventilation motor technology, leak-proof stainless steel jars with secure locking lids, robust triangular body design for stability during heavy grinding.', 4295.00, 469.00, 40, 4.5, 24500, 5600, TRUE, TRUE, FALSE, TRUE, FALSE, TRUE, 'Best Deals – Under ₹469', 'Hot Pick', '["Gloss Black", "Arctic White"]', '["3 Jars", "4 Jars"]', '{"Power": "750 Watts", "Speed Control": "3 Speeds + Pulse", "Jar Capacities": "1.5L, 1.0L, 0.3L", "Motor Overload Protection": "Yes"}'),

-- In The Spotlight & Flagship Electronics
(5, 3, 'Samsung Galaxy S24 Ultra 5G (Titanium Gray, 256 GB)', 'samsung-galaxy-s24-ultra-5g', 'Samsung', 'SM-S928B', 'Galaxy AI built-in with Live Translate & Circle to Search, 200MP Quad Telephoto Camera, Snapdragon 8 Gen 3 for Galaxy, titanium frame with Corning Gorilla Armor.', 134999.00, 98999.00, 35, 4.8, 12400, 3890, TRUE, TRUE, TRUE, TRUE, TRUE, FALSE, 'Flagship Choice', '["Titanium Gray", "Titanium Black", "Titanium Violet"]', '["256 GB", "512 GB", "1 TB"]', '{"Display": "6.8 inch Dynamic AMOLED 2X 120Hz", "Processor": "Snapdragon 8 Gen 3", "RAM": "12 GB", "Battery": "5000 mAh", "Fast Charging": "45W"}'),
(6, 4, 'Apple MacBook Air M3 (13.6-inch Liquid Retina, 16GB, 512GB SSD)', 'apple-macbook-air-m3-16gb', 'Apple', 'MCK-M3-13', 'Incredibly thin and fast MacBook Air powered by the M3 chip. Liquid Retina display with 500 nits brightness, MagSafe 3 charging, 18 hours battery life, silent fanless design.', 134900.00, 114900.00, 20, 4.9, 8700, 2150, TRUE, TRUE, TRUE, TRUE, TRUE, FALSE, 'Top Rated', '["Space Gray", "Midnight", "Starlight", "Silver"]', '["16GB / 512GB", "24GB / 512GB", "16GB / 1TB"]', '{"Chip": "Apple M3 8-core CPU / 10-core GPU", "Display": "13.6 inch Liquid Retina", "Weight": "1.24 kg", "OS": "macOS Sonoma"}'),
(7, 4, 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones', 'sony-wh-1000xm5-noise-cancelling', 'Sony', 'WH-1000XM5', 'Industry-leading noise cancellation with 8 microphones and Auto NC Optimizer. High-resolution audio with LDAC, 30 hours of battery life, crystal clear hands-free calls.', 34990.00, 24990.00, 50, 4.7, 15600, 4100, TRUE, TRUE, TRUE, TRUE, TRUE, FALSE, 'Best Seller', '["Black", "Silver", "Midnight Blue"]', '["Standard"]', '{"Driver": "30mm Carbon Fiber", "Battery": "30 Hours ANC On", "Bluetooth": "v5.2", "Quick Charge": "3 min for 3 hours"}'),
(8, 7, 'LG 55-inch 4K Ultra HD Smart OLED TV (WebOS, Dolby Atmos)', 'lg-55-inch-oled-4k-smart-tv', 'LG', 'OLED55C3PSA', 'Self-lit OLED pixels delivering infinite contrast and 100% color fidelity. α9 AI 4K Gen6 processor, Dolby Vision & Dolby Atmos, 120Hz refresh rate with 0.1ms response for gaming.', 159990.00, 99990.00, 15, 4.8, 6400, 1890, TRUE, TRUE, TRUE, FALSE, TRUE, FALSE, 'Big Screen', '["Titanium Dark"]', '["55 inch", "65 inch"]', '{"Resolution": "4K Ultra HD (3840x2160)", "Refresh Rate": "120Hz Native", "HDMI Ports": "4 x HDMI 2.1", "Sound": "40W 2.2 Channel Dolby Atmos"}'),

-- Best Deals of the Day
(9, 3, 'OnePlus Nord CE4 5G (Dark Chrome, 128 GB)', 'oneplus-nord-ce4-5g', 'OnePlus', 'CPH2613', 'Snapdragon 7 Gen 3 octa-core chipset, 100W SUPERVOOC flash charge, 5500 mAh battery, 50MP Sony LYT-600 OIS camera, 120Hz Fluid AMOLED display with Aqua Touch.', 24999.00, 19999.00, 60, 4.4, 21300, 4900, TRUE, FALSE, TRUE, TRUE, FALSE, FALSE, 'Extra ₹2000 Off', '["Dark Chrome", "Celadon Marble"]', '["8GB + 128GB", "8GB + 256GB"]', '{"Display": "6.7 inch FHD+ AMOLED 120Hz", "Charging": "100W SuperVOOC", "Camera": "50MP OIS + 8MP Ultrawide", "Battery": "5500 mAh"}'),
(10, 4, 'boAt Airdopes 141 Bluetooth Truly Wireless in Ear Earbuds', 'boat-airdopes-141-tws', 'boAt', 'Airdopes-141', 'Up to 42 hours total playback time, Beast Mode 80ms low latency for gaming, ASAP Charge: 5 mins gives 75 mins playtime, ENx noise isolation technology, IPX4 sweat resistant.', 4490.00, 999.00, 200, 4.2, 89400, 15300, TRUE, FALSE, TRUE, TRUE, FALSE, FALSE, '77% Off', '["Bold Black", "Pure White", "Cider Cyan"]', '["Standard"]', '{"Playback": "42 Hours", "Latency": "80ms Beast Mode", "Driver": "8mm Dynamic", "Water Resistance": "IPX4"}'),
(11, 6, 'Solimo Microfibre Reversible Comforter / Quilt (Double Bed)', 'solimo-reversible-double-bed-comforter', 'Solimo', 'SLM-CMF-01', 'Luxuriously soft brushed microfiber fabric filled with 200 GSM hypoallergenic hollow siliconized polyester fiber. Diamond stitched to prevent filling shifting.', 2800.00, 1149.00, 95, 4.5, 16800, 3900, TRUE, FALSE, TRUE, FALSE, FALSE, FALSE, '59% Off', '["Navy Blue / Aqua", "Maroon / Grey", "Beige / Brown"]', '["Single (150x230 cm)", "Double (220x240 cm)"]', '{"Fabric": "100% Microfibre", "Filling": "200 GSM Siliconized Hollow Polyester", "Care": "Machine Washable"}'),

-- Top Fashion Deals
(12, 2, 'Levi\'s Men 511 Slim Fit Mid Rise Stretch Denim Jeans', 'levis-511-slim-fit-stretch-jeans', 'Levi\'s', '04511-2098', 'Iconic Levi\'s 511 slim fit sitting below waist with a slim leg from hip to ankle. Premium cotton blend denim woven with elastane for active comfort and shape retention.', 3999.00, 1799.00, 70, 4.4, 18900, 4100, TRUE, FALSE, FALSE, TRUE, FALSE, FALSE, '55% Off', '["Dark Indigo", "Light Blue Stone Wash", "Midnight Black"]', '["30W 32L", "32W 32L", "34W 32L", "36W 32L"]', '{"Material": "98% Cotton, 2% Elastane", "Fit": "Slim Fit", "Rise": "Mid Rise", "Closure": "Zip Fly with Button"}'),
(13, 2, 'BIBA Women Printed Cotton Anarkali Kurta with Palazzo & Dupatta', 'biba-women-printed-anarkali-suit', 'BIBA', 'SKD-8941', 'Elegant floral printed pure cotton Anarkali silhouette with intricate gota patti border work on yoke and hem. Includes matching breathable palazzo pants and chiffon dupatta.', 4999.00, 1899.00, 50, 4.6, 9200, 1950, TRUE, FALSE, FALSE, TRUE, FALSE, FALSE, '62% Off', '["Blush Pink", "Sage Green", "Royal Indigo"]', '["XS", "S", "M", "L", "XL", "XXL"]', '{"Fabric": "100% Breathable Cotton", "Sleeve": "3/4 Sleeves", "Pattern": "Floral Block Print", "Occasion": "Festive & Casual"}'),

-- Home & Kitchen Essentials
(14, 6, 'Pigeon by Stovekraft Cruise 1800W Induction Cooktop', 'pigeon-cruise-1800w-induction-cooktop', 'Pigeon', '12744', 'Smart 1800-watt induction cooktop with 7 pre-set Indian cooking menus, dual heat sensor for temperature monitoring, LED display, soft-touch push buttons, and auto shut-off.', 3195.00, 1399.00, 80, 4.3, 31200, 7200, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, '56% Off', '["Black Crystal Glass"]', '["Standard"]', '{"Power": "1800 Watts", "Display": "7 Segment LED", "Safety": "Auto Shut Off & Overheat Cutoff", "Cord Length": "1.2 m"}'),
(15, 6, 'Cello Checkers Pet Plastic Airtight Container Set (18 Pieces)', 'cello-checkers-pet-container-set-18', 'Cello', 'CEL-CHK-18', 'BPA-free 100% food grade PET plastic container set with airtight ribbed twist-lock lids. Crystal clear body for instant visibility, stackable space-saving design.', 1499.00, 599.00, 110, 4.3, 28000, 5900, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, '60% Off', '["Clear with Silver Lid", "Clear with Gold Lid"]', '["18 Pieces (300ml, 650ml, 1200ml)"]', '{"Material": "BPA Free PET Plastic", "Airtight": "Yes", "Dishwasher Safe": "Top Rack Only"}'),

-- Recommended For You / Other Categories
(16, 8, 'Lego Classic Large Creative Brick Box Construction Set (790 Pcs)', 'lego-classic-large-brick-box-790', 'LEGO', '10698', 'Contains 790 colorful bricks in 33 different colors with 8 different types of windows and doors, 2 green baseplates and 6 tires. Inspires open-ended creative building play.', 4999.00, 3699.00, 45, 4.8, 14200, 3100, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, '26% Off', '["Multi-Color"]', '["790 Pieces"]', '{"Age": "4 to 99 Years", "Pieces": "790", "Material": "ABS Plastic Non-Toxic"}'),
(17, 9, 'MuscleBlaze Biozyme Performance Whey Protein (Rich Chocolate, 2 kg)', 'muscleblaze-biozyme-whey-protein-2kg', 'MuscleBlaze', 'MB-WHEY-BIO2', 'Informed-Choice UK certified whey protein with clinically tested Enhanced Absorption Formula (EAF) delivering 50% higher protein absorption and 25g pure protein per serving.', 5499.00, 3799.00, 65, 4.5, 34000, 8900, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, '31% Off', '["Rich Chocolate", "Cafe Mocha", "Cookies & Cream"]', '["1 kg", "2 kg", "4 kg"]', '{"Protein Per Scoop": "25g", "BCAA": "5.5g", "Servings": "60 Servings", "Certification": "Labdoor USA Tested"}'),
(18, 11, 'Cosco Light Weight Carbon Graphite Badminton Racket with Full Cover', 'cosco-carbon-graphite-badminton-racket', 'Cosco', 'CB-88', 'One-piece high-modulus graphite shaft and isometric frame head. Pre-strung with high-tension nylon gut (24-26 lbs), anti-slip sweat absorbent grip for fast swings.', 2199.00, 849.00, 90, 4.4, 11500, 2400, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, '61% Off', '["Cyan / Matte Black", "Red / White"]', '["G4 (3.25 Inch)"]', '{"Weight": "84g (4U)", "Tension": "24-26 lbs", "Frame": "Isometric Carbon Graphite", "Cover": "Full Padded Foam Cover"}'),
(19, 13, 'Atomic Habits: Tiny Changes, Remarkable Results by James Clear', 'atomic-habits-james-clear-paperback', 'Penguin Random House', 'ISBN-978-1847941831', '#1 New York Times Bestseller. A revolutionary system to get 1 percent better every day. Over 15 million copies sold worldwide with actionable psychological frameworks.', 799.00, 429.00, 250, 4.8, 92000, 21400, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, '46% Off', '["Standard Edition"]', '["Paperback", "Hardcover"]', '{"Author": "James Clear", "Pages": "320", "Language": "English", "Publisher": "Random House UK"}'),
(20, 14, 'Vega Crux Open Face Motorbike Helmet with Clear Visor (ISI Certified)', 'vega-crux-open-face-helmet', 'Vega', 'CRUX-OF-01', 'ISI marked high impact ABS composite shell with scratch-resistant optical polycarbonate visor, quick-release chin buckle strap, and washable odor-resistant interior padding.', 1549.00, 999.00, 75, 4.3, 19800, 4300, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, '35% Off', '["Matte Black", "Glossy White", "Battle Green"]', '["M (57-58 cm)", "L (59-60 cm)", "XL (61-62 cm)"]', '{"Safety Certification": "ISI IS:4151 Certified", "Weight": "950g", "Visor": "Scratch Resistant Clear"}')
ON DUPLICATE KEY UPDATE name=VALUES(name), discounted_price=VALUES(discounted_price);

-- 5. Insert Product Images (Multiple photos for each product)
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES
-- Milton Bottle
(1, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=700&q=80', TRUE, 1),
(1, 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=700&q=80', FALSE, 2),
(1, 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=700&q=80', FALSE, 3),

-- Puma Shoes
(2, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80', TRUE, 1),
(2, 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=700&q=80', FALSE, 2),
(2, 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=700&q=80', FALSE, 3),

-- Fastrack Watch
(3, 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=700&q=80', TRUE, 1),
(3, 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=700&q=80', FALSE, 2),
(3, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80', FALSE, 3),

-- Mixer Grinder
(4, 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=700&q=80', TRUE, 1),
(4, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=700&q=80', FALSE, 2),

-- Samsung Galaxy S24 Ultra
(5, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=700&q=80', TRUE, 1),
(5, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=700&q=80', FALSE, 2),
(5, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=700&q=80', FALSE, 3),

-- MacBook Air M3
(6, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=700&q=80', TRUE, 1),
(6, 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=700&q=80', FALSE, 2),

-- Sony Headphones
(7, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80', TRUE, 1),
(7, 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=700&q=80', FALSE, 2),

-- LG OLED TV
(8, 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=700&q=80', TRUE, 1),
(8, 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=700&q=80', FALSE, 2),

-- OnePlus Nord CE4
(9, 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=700&q=80', TRUE, 1),

-- boAt Airdopes
(10, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=700&q=80', TRUE, 1),

-- Solimo Comforter
(11, 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=700&q=80', TRUE, 1),

-- Levis Jeans
(12, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=700&q=80', TRUE, 1),

-- Biba Anarkali
(13, 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=80', TRUE, 1),

-- Pigeon Induction
(14, 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?auto=format&fit=crop&w=700&q=80', TRUE, 1),

-- Cello Containers
(15, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=700&q=80', TRUE, 1),

-- Lego Bricks
(16, 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&w=700&q=80', TRUE, 1),

-- MuscleBlaze Protein
(17, 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=700&q=80', TRUE, 1),

-- Cosco Badminton
(18, 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=700&q=80', TRUE, 1),

-- Atomic Habits Book
(19, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=700&q=80', TRUE, 1),

-- Vega Helmet
(20, 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=700&q=80', TRUE, 1);

-- 6. Insert Reviews
INSERT INTO reviews (product_id, user_id, user_name, rating, title, comment, verified_purchase) VALUES
(1, 2, 'Priya Nair', 5, 'Superb insulation quality!', 'Kept chilled lemon water cold for over 22 hours during my train journey. Zero leakage, very sturdy build.', TRUE),
(1, 1, 'Arun Kumar', 4, 'Great value for money', 'The flip mechanism works smoothly. Color finish is premium. Highly recommended at this price point.', TRUE),
(5, 2, 'Vikram Mehta', 5, 'Absolute beast of a phone!', 'Galaxy AI Circle to Search and Live Call Translation are game changers. Display is crystal clear under bright sunlight.', TRUE),
(7, 2, 'Sneha Roy', 5, 'Best Noise Cancelling hands down', 'Used it on a 6-hour flight, completely cut out engine roar and chatter. Extremely lightweight and comfortable.', TRUE);
