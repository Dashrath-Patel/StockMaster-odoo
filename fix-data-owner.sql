-- ============================================================================
-- FIX: Reassign Dummy Data to Your User
-- ============================================================================
-- This script will reassign all dummy data to YOUR user account
-- 
-- STEPS:
-- 1. Get your user ID by running:
--    SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';
-- 2. Copy your user UUID
-- 3. Replace 'YOUR_USER_ID_HERE' below with your actual UUID
-- 4. Run this script
-- ============================================================================

DO $$
DECLARE
    v_your_user_id UUID := 'YOUR_USER_ID_HERE'; -- REPLACE THIS!
    v_old_user_id UUID;
    v_categories_updated INTEGER;
    v_suppliers_updated INTEGER;
    v_products_updated INTEGER;
    v_movements_updated INTEGER;
BEGIN
    -- Get the user_id currently owning the dummy data
    SELECT DISTINCT user_id INTO v_old_user_id 
    FROM categories 
    LIMIT 1;
    
    IF v_old_user_id IS NULL THEN
        RAISE EXCEPTION 'No existing data found. Run seed-dummy-data.sql first!';
    END IF;
    
    IF v_your_user_id = 'YOUR_USER_ID_HERE' THEN
        RAISE EXCEPTION 'Please replace YOUR_USER_ID_HERE with your actual user UUID!';
    END IF;
    
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Reassigning data from old user to new user...';
    RAISE NOTICE 'Old user ID: %', v_old_user_id;
    RAISE NOTICE 'New user ID: %', v_your_user_id;
    RAISE NOTICE '========================================';
    
    -- Update all tables
    UPDATE categories SET user_id = v_your_user_id WHERE user_id = v_old_user_id;
    GET DIAGNOSTICS v_categories_updated = ROW_COUNT;
    
    UPDATE suppliers SET user_id = v_your_user_id WHERE user_id = v_old_user_id;
    GET DIAGNOSTICS v_suppliers_updated = ROW_COUNT;
    
    UPDATE products SET user_id = v_your_user_id WHERE user_id = v_old_user_id;
    GET DIAGNOSTICS v_products_updated = ROW_COUNT;
    
    UPDATE stock_movements SET user_id = v_your_user_id WHERE user_id = v_old_user_id;
    GET DIAGNOSTICS v_movements_updated = ROW_COUNT;
    
    RAISE NOTICE '✅ Categories updated: %', v_categories_updated;
    RAISE NOTICE '✅ Suppliers updated: %', v_suppliers_updated;
    RAISE NOTICE '✅ Products updated: %', v_products_updated;
    RAISE NOTICE '✅ Stock Movements updated: %', v_movements_updated;
    RAISE NOTICE '';
    RAISE NOTICE '🎉 All dummy data has been reassigned to your user!';
    RAISE NOTICE 'Refresh your application to see the data.';
    
END $$;
