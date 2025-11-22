-- ============================================================================
-- DUMMY DATA FOR STOCKMASTER
-- ============================================================================
-- This script populates the database with sample data for testing
-- 
-- IMPORTANT: Before running this script:
-- 1. Run supabase-schema.sql to create the database schema
-- 2. Run supabase-schema-update.sql to add user_id columns (if upgrading from old schema)
-- 3. Get your user ID by running: SELECT id FROM auth.users WHERE email = 'your-email@example.com';
-- 4. Replace ALL instances of 'YOUR_USER_ID_HERE' below with your actual user UUID
-- ============================================================================

-- Clear existing data (optional - comment out if you want to keep existing data)
TRUNCATE TABLE stock_movements CASCADE;
TRUNCATE TABLE products CASCADE;
TRUNCATE TABLE suppliers CASCADE;
TRUNCATE TABLE categories CASCADE;

-- ============================================================================
-- CATEGORIES
-- ============================================================================
-- Replace YOUR_USER_ID_HERE with your actual user UUID from auth.users table
INSERT INTO categories (id, name, description, color, user_id, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Electronics', 'Electronic devices and accessories', '#3B82F6', 'YOUR_USER_ID_HERE', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'Furniture', 'Office and home furniture', '#10B981', 'YOUR_USER_ID_HERE', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'Clothing', 'Apparel and accessories', '#F59E0B', 'YOUR_USER_ID_HERE', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'Food & Beverage', 'Food products and beverages', '#EF4444', 'YOUR_USER_ID_HERE', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440005', 'Office Supplies', 'Stationery and office equipment', '#8B5CF6', 'YOUR_USER_ID_HERE', NOW(), NOW());

-- ============================================================================
-- SUPPLIERS
-- ============================================================================
INSERT INTO suppliers (id, name, contact_email, contact_phone, address, user_id, created_at, updated_at) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'TechWorld Inc', 'contact@techworld.com', '+1-555-0101', '123 Tech Street, Silicon Valley, CA 94025', 'YOUR_USER_ID_HERE', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440002', 'Furniture Plus', 'sales@furnitureplus.com', '+1-555-0102', '456 Furniture Ave, Austin, TX 73301', 'YOUR_USER_ID_HERE', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440003', 'Fashion Hub', 'info@fashionhub.com', '+1-555-0103', '789 Style Boulevard, New York, NY 10001', 'YOUR_USER_ID_HERE', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440004', 'Global Foods Ltd', 'orders@globalfoods.com', '+1-555-0104', '321 Food Court, Chicago, IL 60601', 'YOUR_USER_ID_HERE', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440005', 'Office Depot Pro', 'support@officedepotpro.com', '+1-555-0105', '654 Supply Lane, Seattle, WA 98101', 'YOUR_USER_ID_HERE', NOW(), NOW());

-- ============================================================================
-- PRODUCTS
-- ============================================================================
INSERT INTO products (id, name, sku, category_id, supplier_id, cost_price, selling_price, quantity, reorder_level, user_id, created_at, updated_at) VALUES
-- Electronics
('770e8400-e29b-41d4-a716-446655440001', 'Wireless Mouse', 'ELEC-MOUSE-001', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 15.00, 29.99, 150, 30, 'YOUR_USER_ID_HERE', NOW(), NOW()),
('770e8400-e29b-41d4-a716-446655440002', 'USB-C Cable', 'ELEC-CABLE-002', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 5.00, 12.99, 200, 50, 'YOUR_USER_ID_HERE', NOW(), NOW()),
('770e8400-e29b-41d4-a716-446655440003', 'Bluetooth Headphones', 'ELEC-HEAD-003', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 35.00, 79.99, 75, 20, 'YOUR_USER_ID_HERE', NOW(), NOW()),
('770e8400-e29b-41d4-a716-446655440004', 'Laptop Stand', 'ELEC-STAND-004', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 20.00, 45.99, 60, 15, 'YOUR_USER_ID_HERE', NOW(), NOW()),
('770e8400-e29b-41d4-a716-446655440005', 'Webcam HD', 'ELEC-CAM-005', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 40.00, 89.99, 45, 10, 'YOUR_USER_ID_HERE', NOW(), NOW()),

-- Furniture
('770e8400-e29b-41d4-a716-446655440006', 'Office Desk', 'FURN-DESK-001', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 150.00, 299.99, 25, 5, 'YOUR_USER_ID_HERE', NOW(), NOW()),
('770e8400-e29b-41d4-a716-446655440007', 'Ergonomic Chair', 'FURN-CHAIR-002', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 120.00, 249.99, 30, 8, 'YOUR_USER_ID_HERE', NOW(), NOW()),
('770e8400-e29b-41d4-a716-446655440008', 'Bookshelf', 'FURN-SHELF-003', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 60.00, 129.99, 20, 5, 'YOUR_USER_ID_HERE', NOW(), NOW()),
('770e8400-e29b-41d4-a716-446655440009', 'Filing Cabinet', 'FURN-FILE-004', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 80.00, 169.99, 15, 3, 'YOUR_USER_ID_HERE', NOW(), NOW()),

-- Clothing
('770e8400-e29b-41d4-a716-446655440010', 'T-Shirt Basic', 'CLTH-TSHIRT-001', '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', 8.00, 19.99, 300, 50, 'YOUR_USER_ID_HERE', NOW(), NOW()),
('770e8400-e29b-41d4-a716-446655440011', 'Jeans Classic', 'CLTH-JEANS-002', '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', 25.00, 59.99, 120, 30, 'YOUR_USER_ID_HERE', NOW(), NOW()),
('770e8400-e29b-41d4-a716-446655440012', 'Hoodie Premium', 'CLTH-HOOD-003', '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', 30.00, 69.99, 80, 20, 'YOUR_USER_ID_HERE', NOW(), NOW()),
('770e8400-e29b-41d4-a716-446655440013', 'Sneakers Sport', 'CLTH-SHOE-004', '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', 40.00, 89.99, 90, 25, 'YOUR_USER_ID_HERE', NOW(), NOW()),

-- Food & Beverage
('770e8400-e29b-41d4-a716-446655440014', 'Organic Coffee Beans', 'FOOD-COFFEE-001', '550e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440004', 12.00, 24.99, 100, 20, 'YOUR_USER_ID_HERE', NOW(), NOW()),
('770e8400-e29b-41d4-a716-446655440015', 'Green Tea Premium', 'FOOD-TEA-002', '550e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440004', 8.00, 16.99, 150, 30, 'YOUR_USER_ID_HERE', NOW(), NOW()),
('770e8400-e29b-41d4-a716-446655440016', 'Energy Bars Box', 'FOOD-BAR-003', '550e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440004', 15.00, 29.99, 200, 40, 'YOUR_USER_ID_HERE', NOW(), NOW()),

-- Office Supplies
('770e8400-e29b-41d4-a716-446655440017', 'Notebook A4', 'OFFC-NOTE-001', '550e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440005', 2.00, 5.99, 500, 100, 'YOUR_USER_ID_HERE', NOW(), NOW()),
('770e8400-e29b-41d4-a716-446655440018', 'Pen Pack (10)', 'OFFC-PEN-002', '550e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440005', 3.00, 7.99, 400, 80, 'YOUR_USER_ID_HERE', NOW(), NOW()),
('770e8400-e29b-41d4-a716-446655440019', 'Sticky Notes Set', 'OFFC-STICKY-003', '550e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440005', 4.00, 9.99, 300, 60, 'YOUR_USER_ID_HERE', NOW(), NOW()),
('770e8400-e29b-41d4-a716-446655440020', 'Stapler Heavy Duty', 'OFFC-STAPLE-004', '550e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440005', 10.00, 22.99, 100, 20, 'YOUR_USER_ID_HERE', NOW(), NOW());

-- ============================================================================
-- STOCK MOVEMENTS
-- ============================================================================
-- Recent stock movements for tracking
INSERT INTO stock_movements (id, product_id, type, quantity, notes, user_id, created_at) VALUES
-- Electronics movements
('880e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 'in', 100, 'Initial stock', 'YOUR_USER_ID_HERE', NOW() - INTERVAL '30 days'),
('880e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440001', 'out', 20, 'Customer order #1001', 'YOUR_USER_ID_HERE', NOW() - INTERVAL '25 days'),
('880e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440001', 'in', 50, 'Restock', 'YOUR_USER_ID_HERE', NOW() - INTERVAL '20 days'),
('880e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440001', 'out', 15, 'Customer order #1025', 'YOUR_USER_ID_HERE', NOW() - INTERVAL '10 days'),

-- Furniture movements
('880e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440006', 'in', 30, 'Initial stock', 'YOUR_USER_ID_HERE', NOW() - INTERVAL '45 days'),
('880e8400-e29b-41d4-a716-446655440006', '770e8400-e29b-41d4-a716-446655440006', 'out', 5, 'Office setup order', 'YOUR_USER_ID_HERE', NOW() - INTERVAL '15 days'),
('880e8400-e29b-41d4-a716-446655440007', '770e8400-e29b-41d4-a716-446655440007', 'in', 40, 'Initial stock', 'YOUR_USER_ID_HERE', NOW() - INTERVAL '40 days'),
('880e8400-e29b-41d4-a716-446655440008', '770e8400-e29b-41d4-a716-446655440007', 'out', 10, 'Bulk order', 'YOUR_USER_ID_HERE', NOW() - INTERVAL '12 days'),

-- Clothing movements
('880e8400-e29b-41d4-a716-446655440009', '770e8400-e29b-41d4-a716-446655440010', 'in', 400, 'Initial stock', 'YOUR_USER_ID_HERE', NOW() - INTERVAL '60 days'),
('880e8400-e29b-41d4-a716-446655440010', '770e8400-e29b-41d4-a716-446655440010', 'out', 100, 'Retail order', 'YOUR_USER_ID_HERE', NOW() - INTERVAL '35 days'),
('880e8400-e29b-41d4-a716-446655440011', '770e8400-e29b-41d4-a716-446655440011', 'in', 150, 'Initial stock', 'YOUR_USER_ID_HERE', NOW() - INTERVAL '50 days'),
('880e8400-e29b-41d4-a716-446655440012', '770e8400-e29b-41d4-a716-446655440011', 'out', 30, 'Customer orders', 'YOUR_USER_ID_HERE', NOW() - INTERVAL '20 days'),

-- Food movements
('880e8400-e29b-41d4-a716-446655440013', '770e8400-e29b-41d4-a716-446655440014', 'in', 120, 'Initial stock', 'YOUR_USER_ID_HERE', NOW() - INTERVAL '25 days'),
('880e8400-e29b-41d4-a716-446655440014', '770e8400-e29b-41d4-a716-446655440014', 'out', 20, 'Cafe order', 'YOUR_USER_ID_HERE', NOW() - INTERVAL '18 days'),
('880e8400-e29b-41d4-a716-446655440015', '770e8400-e29b-41d4-a716-446655440015', 'in', 180, 'Initial stock', 'YOUR_USER_ID_HERE', NOW() - INTERVAL '22 days'),
('880e8400-e29b-41d4-a716-446655440016', '770e8400-e29b-41d4-a716-446655440015', 'out', 30, 'Wholesale order', 'YOUR_USER_ID_HERE', NOW() - INTERVAL '15 days'),

-- Office supplies movements
('880e8400-e29b-41d4-a716-446655440017', '770e8400-e29b-41d4-a716-446655440017', 'in', 600, 'Initial stock', 'YOUR_USER_ID_HERE', NOW() - INTERVAL '40 days'),
('880e8400-e29b-41d4-a716-446655440018', '770e8400-e29b-41d4-a716-446655440017', 'out', 100, 'School order', 'YOUR_USER_ID_HERE', NOW() - INTERVAL '30 days'),
('880e8400-e29b-41d4-a716-446655440019', '770e8400-e29b-41d4-a716-446655440018', 'in', 500, 'Initial stock', 'YOUR_USER_ID_HERE', NOW() - INTERVAL '35 days'),
('880e8400-e29b-41d4-a716-446655440020', '770e8400-e29b-41d4-a716-446655440018', 'out', 100, 'Office supply order', 'YOUR_USER_ID_HERE', NOW() - INTERVAL '25 days');

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Run these queries after loading the data to verify everything is loaded correctly:

-- SELECT COUNT(*) as category_count FROM categories;
-- SELECT COUNT(*) as supplier_count FROM suppliers;
-- SELECT COUNT(*) as product_count FROM products;
-- SELECT COUNT(*) as stock_movement_count FROM stock_movements;

-- View sample data:
-- SELECT c.name as category, COUNT(p.id) as product_count 
-- FROM categories c 
-- LEFT JOIN products p ON p.category_id = c.id 
-- GROUP BY c.name;
