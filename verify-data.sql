-- ============================================================================
-- VERIFY DUMMY DATA - Diagnostic Queries
-- ============================================================================
-- Run these queries in Supabase SQL Editor to check if data was loaded
-- and diagnose why you're not seeing it in the frontend
-- ============================================================================

-- 1. Check if any users exist
SELECT 'Total Users' as info, COUNT(*) as count FROM auth.users;

-- 2. Check your current user ID (replace with your email)
-- SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- 3. Count records in each table (total, regardless of user)
SELECT 
    'Categories' as table_name, COUNT(*) as total_count FROM categories
UNION ALL
SELECT 
    'Suppliers', COUNT(*) FROM suppliers
UNION ALL
SELECT 
    'Products', COUNT(*) FROM products
UNION ALL
SELECT 
    'Stock Movements', COUNT(*) FROM stock_movements;

-- 4. Check which user_id owns the data
SELECT 
    'Categories' as table_name, 
    user_id, 
    COUNT(*) as count 
FROM categories 
GROUP BY user_id
UNION ALL
SELECT 
    'Suppliers', 
    user_id, 
    COUNT(*) 
FROM suppliers 
GROUP BY user_id
UNION ALL
SELECT 
    'Products', 
    user_id, 
    COUNT(*) 
FROM products 
GROUP BY user_id
UNION ALL
SELECT 
    'Stock Movements', 
    user_id, 
    COUNT(*) 
FROM stock_movements 
GROUP BY user_id;

-- 5. View sample data with user emails
SELECT 
    c.name as category_name,
    c.color,
    u.email as owner_email,
    c.created_at
FROM categories c
LEFT JOIN auth.users u ON u.id = c.user_id
LIMIT 10;

-- 6. Check if there's a mismatch between logged-in user and data owner
-- First get all user_ids from your data
SELECT DISTINCT user_id, 
    (SELECT email FROM auth.users WHERE id = categories.user_id) as email
FROM categories;

-- ============================================================================
-- SOLUTION OPTIONS
-- ============================================================================

-- OPTION 1: If you want to reassign all data to a specific user
-- Uncomment and replace YOUR_NEW_USER_ID with your actual user UUID
/*
DO $$
DECLARE
    v_new_user_id UUID := 'YOUR_NEW_USER_ID'; -- Replace with your user ID
BEGIN
    UPDATE categories SET user_id = v_new_user_id;
    UPDATE suppliers SET user_id = v_new_user_id;
    UPDATE products SET user_id = v_new_user_id;
    UPDATE stock_movements SET user_id = v_new_user_id;
    
    RAISE NOTICE 'All data reassigned to user: %', v_new_user_id;
END $$;
*/

-- OPTION 2: Clear all dummy data and re-run the seed file
/*
TRUNCATE TABLE stock_movements CASCADE;
TRUNCATE TABLE products CASCADE;
TRUNCATE TABLE suppliers CASCADE;
TRUNCATE TABLE categories CASCADE;

-- Then run seed-dummy-data.sql again
*/
