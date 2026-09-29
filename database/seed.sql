-- AgriConnect Demo Seed Data
-- Digital Farmer-to-Buyer Marketplace
USE agriconnect;

-- Clear previous data in correct foreign key order
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE activity_logs;
TRUNCATE TABLE reviews;
TRUNCATE TABLE delivery;
TRUNCATE TABLE payments;
TRUNCATE TABLE order_items;
TRUNCATE TABLE orders;
TRUNCATE TABLE cart_items;
TRUNCATE TABLE cart;
TRUNCATE TABLE price_history;
TRUNCATE TABLE products;
TRUNCATE TABLE categories;
TRUNCATE TABLE admins;
TRUNCATE TABLE buyers;
TRUNCATE TABLE farmers;
TRUNCATE TABLE users;
TRUNCATE TABLE locations;
TRUNCATE TABLE platform_settings;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Users (Hashed passwords for Admin@123, Farmer@123, Buyer@123)
INSERT INTO users (id, email, password_hash, role, status) VALUES
(1, 'admin@agriconnect.com', '$2a$10$qZMrTY1U8rXYGewDtqv1puMm9e1r98zLSn3xN9lVv0KBdEMThtSaS', 'ADMIN', 'ACTIVE'),
(2, 'ravi@agriconnect.com', '$2a$10$CEvtap2GvNZLTmDA7iu50eGr/iXaEu9uLOTO7TlECr9gaPa8Jfvpu', 'FARMER', 'ACTIVE'),
(3, 'suresh@agriconnect.com', '$2a$10$CEvtap2GvNZLTmDA7iu50eGr/iXaEu9uLOTO7TlECr9gaPa8Jfvpu', 'FARMER', 'ACTIVE'),
(4, 'priya@agriconnect.com', '$2a$10$CEvtap2GvNZLTmDA7iu50eGr/iXaEu9uLOTO7TlECr9gaPa8Jfvpu', 'FARMER', 'ACTIVE'),
(5, 'abc@supermarket.com', '$2a$10$orqd7AmEvfAWSvPvIjXlpurgktbFumnJ4dyK7dD.h09TpCPvTCB8u', 'BUYER', 'ACTIVE'),
(6, 'freshfoods@restaurant.com', '$2a$10$orqd7AmEvfAWSvPvIjXlpurgktbFumnJ4dyK7dD.h09TpCPvTCB8u', 'BUYER', 'ACTIVE'),
(7, 'green@retail.com', '$2a$10$orqd7AmEvfAWSvPvIjXlpurgktbFumnJ4dyK7dD.h09TpCPvTCB8u', 'BUYER', 'ACTIVE');

-- 2. Admins
INSERT INTO admins (id, user_id, full_name, department) VALUES
(1, 1, 'AgriConnect System Administrator', 'Operations & Marketplace Compliance');

-- 3. Farmers
INSERT INTO farmers (id, user_id, full_name, mobile, address, village_city, state, pincode, farm_size, primary_crops, verified, rating, total_reviews) VALUES
(1, 2, 'Ravi Kumar', '9876543210', 'Plot 14, Siruvani Main Road, Thondamuthur', 'Coimbatore', 'Tamil Nadu', '641109', '12 Acres', 'Tomato, Carrot, Banana, Green Chillies', TRUE, 4.85, 24),
(2, 3, 'Suresh Kumar', '9876543211', 'Survey No 88, Dindori Road', 'Nashik', 'Maharashtra', '422004', '20 Acres', 'Onion, Potato, Alphonso Mango, Grapes', TRUE, 4.90, 38),
(3, 4, 'Priya Farmers Group', '9876543212', 'Door 5-21, Tenali Agro Zone', 'Guntur', 'Andhra Pradesh', '522002', '35 Acres (Collective)', 'Organic Rice, Red Chillies, Turmeric', TRUE, 4.75, 19);

-- 4. Buyers
INSERT INTO buyers (id, user_id, full_name, mobile, business_type, address, city, state, pincode) VALUES
(1, 5, 'ABC Supermarket', '9123456780', 'Supermarket Chain', 'No. 45, Anna Salai, T. Nagar', 'Chennai', 'Tamil Nadu', '600017'),
(2, 6, 'Fresh Foods Restaurant', '9123456781', 'Restaurant & Hospitality', '88, 100 Feet Road, Indiranagar', 'Bangalore', 'Karnataka', '560038'),
(3, 7, 'Green Retail Store', '9123456782', 'Retailer', 'Plot 12, Jubilee Hills Road No 36', 'Hyderabad', 'Telangana', '500033');

-- 5. Categories
INSERT INTO categories (id, name, slug, description, icon) VALUES
(1, 'Vegetables', 'vegetables', 'Farm-fresh organic and standard grade vegetables harvest', 'carrot'),
(2, 'Fruits', 'fruits', 'Naturally ripened seasonal fruits direct from orchards', 'apple'),
(3, 'Grains', 'grains', 'Staple grains, farm-milled rice, and wheat varieties', 'wheat'),
(4, 'Pulses', 'pulses', 'High-protein lentils, grams, and whole pulses', 'bean'),
(5, 'Spices', 'spices', 'Pure, unadulterated spices, chillies, and turmeric', 'flame'),
(6, 'Dairy', 'dairy', 'Pure cow milk, ghee, paneer, and organic farm dairy', 'milk'),
(7, 'Other', 'other', 'Specialty agricultural and herbal produce', 'package');

-- 6. Products
INSERT INTO products (id, farmer_id, category_id, name, description, quantity, unit, price_per_unit, harvest_date, image_url, location, quality_grade, status, is_available) VALUES
(1, 1, 1, 'Fresh Red Tomatoes', 'Vine-ripened, naturally grown firm tomatoes suitable for retail, restaurants, and daily kitchen consumption. Handpicked this morning.', 150.00, 'kg', 30.00, '2026-09-28', 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80', 'Coimbatore, Tamil Nadu', 'Grade A', 'APPROVED', TRUE),
(2, 2, 1, 'Nashik Red Onions', 'World-famous Nashik pink-red onions with long storage life and pungent aroma. Graded and bagged at farm gate.', 350.00, 'kg', 25.00, '2026-09-25', 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80', 'Nashik, Maharashtra', 'Grade A', 'APPROVED', TRUE),
(3, 2, 1, 'Jyoti Farm Potatoes', 'Smooth skin, dry matter rich potatoes, ideal for chips, curries, and bulk commercial culinary usage.', 400.00, 'kg', 20.00, '2026-09-24', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80', 'Nashik, Maharashtra', 'Grade A', 'APPROVED', TRUE),
(4, 1, 1, 'Ooty Crunchy Carrots', 'Crisp, sweet, pesticide-free carrots cultivated in the Nilgiri foothills. Washed and ready for wholesale distribution.', 120.00, 'kg', 45.00, '2026-09-27', 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&auto=format&fit=crop&q=80', 'Coimbatore, Tamil Nadu', 'Premium', 'APPROVED', TRUE),
(5, 3, 3, 'Organic Sona Masoori Rice', 'Single-origin aged 1 year Sona Masoori raw rice. Polished without talc, high aroma, and fluffy cooking texture.', 600.00, 'kg', 60.00, '2026-08-15', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80', 'Guntur, Andhra Pradesh', 'Organic', 'APPROVED', TRUE),
(6, 1, 2, 'Robusta Sweet Bananas', 'Naturally ripened ethylene-free bananas with rich potassium content and vibrant peel.', 180.00, 'dozen', 40.00, '2026-09-26', 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80', 'Coimbatore, Tamil Nadu', 'Grade A', 'APPROVED', TRUE),
(7, 2, 2, 'Ratnagiri Alphonso Mangoes', 'Export quality GI-tagged Alphonso mangoes, rich pulp, distinct saffron aroma. 12 pieces per box.', 65.00, 'box', 450.00, '2026-09-20', 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&auto=format&fit=crop&q=80', 'Nashik, Maharashtra', 'Premium', 'APPROVED', TRUE),
(8, 3, 5, 'Guntur Hot Red Chillies', 'Fiery sun-dried Guntur Sannam S4 chillies. Deep red color, high capsaicin content for food processors.', 200.00, 'kg', 160.00, '2026-09-18', 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=600&auto=format&fit=crop&q=80', 'Guntur, Andhra Pradesh', 'Grade A', 'PENDING', TRUE),
(9, 1, 2, 'Shimla Crisp Royal Apples', 'Orchard fresh mountain apples, sweet-tart crispness, uniform grading.', 150.00, 'kg', 110.00, '2026-09-22', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80', 'Coimbatore, Tamil Nadu', 'Grade A', 'PENDING', TRUE);

-- 7. Price History
INSERT INTO price_history (id, product_id, farmer_id, old_price, new_price, changed_by, reason, created_at) VALUES
(1, 1, 1, 28.00, 30.00, 2, 'High demand from local supermarkets and market season adjustment', '2026-09-28 10:15:00'),
(2, 2, 2, 22.00, 25.00, 3, 'Post-harvest logistics and wholesale mandi price trend', '2026-09-27 11:30:00');

-- 8. Orders
INSERT INTO orders (id, order_number, buyer_id, subtotal, delivery_fee, commission_rate, commission_amount, total_amount, order_status, payment_status, payment_method, shipping_name, shipping_mobile, shipping_address, shipping_city, shipping_state, shipping_pincode, created_at) VALUES
(1, 'AGRI-2026-00101', 1, 3000.00, 150.00, 3.50, 105.00, 3150.00, 'Delivered', 'PAID', 'UPI (Razorpay Test)', 'ABC Supermarket (Procurement Team)', '9123456780', 'No. 45, Anna Salai, T. Nagar', 'Chennai', 'Tamil Nadu', '600017', '2026-09-26 09:30:00'),
(2, 'AGRI-2026-00102', 2, 2500.00, 120.00, 3.50, 87.50, 2620.00, 'Out for Delivery', 'PAID', 'Net Banking (Razorpay Test)', 'Fresh Foods Restaurant', '9123456781', '88, 100 Feet Road, Indiranagar', 'Bangalore', 'Karnataka', '560038', '2026-09-27 14:15:00'),
(3, 'AGRI-2026-00103', 3, 1800.00, 100.00, 3.50, 63.00, 1900.00, 'Payment Confirmed', 'PAID', 'Credit Card (Razorpay Test)', 'Green Retail Store', '9123456782', 'Plot 12, Jubilee Hills Road No 36', 'Hyderabad', 'Telangana', '500033', '2026-09-28 11:00:00');

-- 9. Order Items
INSERT INTO order_items (id, order_id, product_id, farmer_id, product_name, unit, quantity, unit_price, subtotal) VALUES
(1, 1, 1, 1, 'Fresh Red Tomatoes', 'kg', 100.00, 30.00, 3000.00),
(2, 2, 2, 2, 'Nashik Red Onions', 'kg', 100.00, 25.00, 2500.00),
(3, 3, 4, 1, 'Ooty Crunchy Carrots', 'kg', 40.00, 45.00, 1800.00);

-- 10. Payments
INSERT INTO payments (id, order_id, buyer_id, payment_method, razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, currency, payment_status, transaction_ref, created_at) VALUES
(1, 1, 1, 'UPI', 'order_rzp_demo_00101', 'pay_demo_test_00101', 'sig_valid_test_hash_001', 3150.00, 'INR', 'SUCCESS', 'TXN-AGRI-20260926-01', '2026-09-26 09:32:00'),
(2, 2, 2, 'Net Banking', 'order_rzp_demo_00102', 'pay_demo_test_00102', 'sig_valid_test_hash_002', 2620.00, 'INR', 'SUCCESS', 'TXN-AGRI-20260927-02', '2026-09-27 14:18:00'),
(3, 3, 3, 'Credit Card', 'order_rzp_demo_00103', 'pay_demo_test_00103', 'sig_valid_test_hash_003', 1900.00, 'INR', 'SUCCESS', 'TXN-AGRI-20260928-03', '2026-09-28 11:05:00');

-- 11. Delivery
INSERT INTO delivery (id, order_id, tracking_number, pickup_address, delivery_address, pickup_lat, pickup_lng, delivery_lat, delivery_lng, distance_km, status, estimated_delivery, carrier_name) VALUES
(1, 1, 'TRK-2026-00101', 'Plot 14, Siruvani Main Road, Coimbatore, Tamil Nadu', 'No. 45, Anna Salai, T. Nagar, Chennai, Tamil Nadu', 11.0168445, 76.9558321, 13.0826802, 80.2707184, 505.00, 'Delivered', '2026-09-27', 'AgriConnect ColdChain Express'),
(2, 2, 'TRK-2026-00102', 'Survey No 88, Dindori Road, Nashik, Maharashtra', '88, 100 Feet Road, Indiranagar, Bangalore, Karnataka', 19.9974533, 73.7898023, 12.9715987, 77.5945627, 980.00, 'In Transit', '2026-09-29', 'AgriConnect Interstate Freight'),
(3, 3, 'TRK-2026-00103', 'Plot 14, Siruvani Main Road, Coimbatore, Tamil Nadu', 'Plot 12, Jubilee Hills Road No 36, Hyderabad, Telangana', 11.0168445, 76.9558321, 17.3850440, 78.4866710, 910.00, 'Pickup Ready', '2026-09-30', 'AgriConnect Rapid Logistics');

-- 12. Reviews
INSERT INTO reviews (id, product_id, buyer_id, order_id, rating, comment, created_at) VALUES
(1, 1, 1, 1, 5, 'Super fresh farm harvest! Tomatoes were firm, cleanly sorted, and arrived in sturdy crates. Our supermarket customers loved the quality.', '2026-09-27 16:00:00'),
(2, 2, 2, 2, 5, 'Consistently great quality onions from Suresh Kumar. Direct sourcing saves us almost 18% over local market broker markups.', '2026-09-27 18:30:00');

-- 13. Geographic Locations
INSERT INTO locations (id, city, state, pincode, latitude, longitude) VALUES
(1, 'Coimbatore', 'Tamil Nadu', '641001', 11.0168445, 76.9558321),
(2, 'Nashik', 'Maharashtra', '422001', 19.9974533, 73.7898023),
(3, 'Guntur', 'Andhra Pradesh', '522001', 16.3066525, 80.4365402),
(4, 'Chennai', 'Tamil Nadu', '600001', 13.0826802, 80.2707184),
(5, 'Bangalore', 'Karnataka', '560001', 12.9715987, 77.5945627),
(6, 'Hyderabad', 'Telangana', '500001', 17.3850440, 78.4866710);

-- 14. Activity Logs (Real automatic audit examples required by prompt)
INSERT INTO activity_logs (id, user_id, role, activity_type, description, product_id, order_id, old_value, new_value, created_at) VALUES
(1, 2, 'FARMER', 'PRODUCT_CREATED', 'Farmer Ravi Kumar added Fresh Red Tomatoes (150 kg @ ₹28.00/kg)', 1, NULL, NULL, 'Fresh Red Tomatoes', '2026-09-28 10:00:00'),
(2, 1, 'ADMIN', 'PRODUCT_APPROVED', 'Admin approved listing for Fresh Red Tomatoes', 1, NULL, 'PENDING', 'APPROVED', '2026-09-28 10:10:00'),
(3, 2, 'FARMER', 'PRICE_CHANGED', 'Farmer Ravi changed Tomato price from ₹28/kg to ₹30/kg', 1, NULL, '28.00', '30.00', '2026-09-28 10:15:00'),
(4, 5, 'BUYER', 'ORDER_PLACED', 'Buyer ABC Supermarket placed Order #AGRI-2026-00101 for 100 kg Tomatoes', 1, 1, NULL, 'AGRI-2026-00101', '2026-09-26 09:30:00'),
(5, 5, 'BUYER', 'PAYMENT_SUCCESS', 'Payment of ₹3,150.00 received via UPI for Order #AGRI-2026-00101', NULL, 1, 'INITIATED', 'SUCCESS', '2026-09-26 09:32:00'),
(6, 2, 'FARMER', 'ORDER_CONFIRMED', 'Farmer Ravi Kumar confirmed Order #AGRI-2026-00101 for dispatch', NULL, 1, 'Payment Confirmed', 'Farmer Confirmed', '2026-09-26 10:00:00'),
(7, 1, 'SYSTEM', 'DELIVERY_COMPLETED', 'Order #AGRI-2026-00101 marked as Delivered at Chennai', NULL, 1, 'In Transit', 'Delivered', '2026-09-27 14:00:00'),
(8, 5, 'BUYER', 'REVIEW_SUBMITTED', 'Buyer ABC Supermarket left 5-star review for Fresh Red Tomatoes', 1, 1, NULL, '5 Stars', '2026-09-27 16:00:00');

-- 15. Platform Settings
INSERT INTO platform_settings (id, setting_key, setting_value, description) VALUES
(1, 'platform_commission_pct', '3.5', 'Platform revenue commission percentage charged per successful transaction'),
(2, 'base_delivery_charge', '50.00', 'Flat base delivery logistics charge in INR'),
(3, 'auto_approve_products', 'false', 'Whether new farmer product submissions require manual admin review'),
(4, 'marketplace_status', 'active', 'Global operational status of the AgriConnect marketplace');
