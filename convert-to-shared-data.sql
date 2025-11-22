    -- ============================================================================
    -- CONVERT TO SHARED DATA MODEL
    -- ============================================================================
    -- This script converts the database from user-specific (isolated) data
    -- to shared data where all users can see and manage the same inventory
    -- ============================================================================

    -- ============================================================================
    -- 1. DROP EXISTING USER-SPECIFIC RLS POLICIES
    -- ============================================================================

    -- Categories
    DROP POLICY IF EXISTS "Users can view their own categories" ON categories;
    DROP POLICY IF EXISTS "Users can create their own categories" ON categories;
    DROP POLICY IF EXISTS "Users can update their own categories" ON categories;
    DROP POLICY IF EXISTS "Users can delete their own categories" ON categories;

    -- Suppliers
    DROP POLICY IF EXISTS "Users can view their own suppliers" ON suppliers;
    DROP POLICY IF EXISTS "Users can create their own suppliers" ON suppliers;
    DROP POLICY IF EXISTS "Users can update their own suppliers" ON suppliers;
    DROP POLICY IF EXISTS "Users can delete their own suppliers" ON suppliers;

    -- Products
    DROP POLICY IF EXISTS "Users can view their own products" ON products;
    DROP POLICY IF EXISTS "Users can create their own products" ON products;
    DROP POLICY IF EXISTS "Users can update their own products" ON products;
    DROP POLICY IF EXISTS "Users can delete their own products" ON products;

    -- Stock Movements
    DROP POLICY IF EXISTS "Users can view their own stock movements" ON stock_movements;
    DROP POLICY IF EXISTS "Users can create their own stock movements" ON stock_movements;

    -- Alerts (if exists)
    DROP POLICY IF EXISTS "Authenticated users can view alerts" ON alerts;
    DROP POLICY IF EXISTS "Authenticated users can insert alerts" ON alerts;
    DROP POLICY IF EXISTS "Authenticated users can update alerts" ON alerts;
    DROP POLICY IF EXISTS "Authenticated users can delete alerts" ON alerts;

    -- ============================================================================
    -- 2. CREATE SHARED RLS POLICIES (All authenticated users can access ALL data)
    -- ============================================================================

    -- Categories: Shared access for all authenticated users
    CREATE POLICY "All authenticated users can view all categories" ON categories
    FOR SELECT USING (auth.role() = 'authenticated');

    CREATE POLICY "All authenticated users can create categories" ON categories
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

    CREATE POLICY "All authenticated users can update categories" ON categories
    FOR UPDATE USING (auth.role() = 'authenticated');

    CREATE POLICY "All authenticated users can delete categories" ON categories
    FOR DELETE USING (auth.role() = 'authenticated');

    -- Suppliers: Shared access for all authenticated users
    CREATE POLICY "All authenticated users can view all suppliers" ON suppliers
    FOR SELECT USING (auth.role() = 'authenticated');

    CREATE POLICY "All authenticated users can create suppliers" ON suppliers
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

    CREATE POLICY "All authenticated users can update suppliers" ON suppliers
    FOR UPDATE USING (auth.role() = 'authenticated');

    CREATE POLICY "All authenticated users can delete suppliers" ON suppliers
    FOR DELETE USING (auth.role() = 'authenticated');

    -- Products: Shared access for all authenticated users
    CREATE POLICY "All authenticated users can view all products" ON products
    FOR SELECT USING (auth.role() = 'authenticated');

    CREATE POLICY "All authenticated users can create products" ON products
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

    CREATE POLICY "All authenticated users can update products" ON products
    FOR UPDATE USING (auth.role() = 'authenticated');

    CREATE POLICY "All authenticated users can delete products" ON products
    FOR DELETE USING (auth.role() = 'authenticated');

    -- Stock Movements: Shared access for all authenticated users
    CREATE POLICY "All authenticated users can view all stock movements" ON stock_movements
    FOR SELECT USING (auth.role() = 'authenticated');

    CREATE POLICY "All authenticated users can create stock movements" ON stock_movements
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

    -- Alerts: Shared access for all authenticated users
    CREATE POLICY "All authenticated users can view alerts" ON alerts
    FOR SELECT USING (auth.role() = 'authenticated');

    CREATE POLICY "All authenticated users can insert alerts" ON alerts
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

    CREATE POLICY "All authenticated users can update alerts" ON alerts
    FOR UPDATE USING (auth.role() = 'authenticated');

    CREATE POLICY "All authenticated users can delete alerts" ON alerts
    FOR DELETE USING (auth.role() = 'authenticated');

    -- ============================================================================
    -- 3. MAKE user_id NULLABLE (Optional - keeps track of who created what)
    -- ============================================================================

    -- Make user_id nullable so it's not required for inserts
    -- But we keep it to track who created each record
    ALTER TABLE categories ALTER COLUMN user_id DROP NOT NULL;
    ALTER TABLE suppliers ALTER COLUMN user_id DROP NOT NULL;
    ALTER TABLE products ALTER COLUMN user_id DROP NOT NULL;
    ALTER TABLE stock_movements ALTER COLUMN user_id DROP NOT NULL;

    -- ============================================================================
    -- 4. SET DEFAULT user_id TO CURRENT USER (Auto-track creator)
    -- ============================================================================

-- Set default to automatically populate user_id with current user
ALTER TABLE categories ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE suppliers ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE products ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE stock_movements ALTER COLUMN user_id SET DEFAULT auth.uid();

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================
DO $$
BEGIN
    RAISE NOTICE '✅ Database converted to SHARED data model!';
    RAISE NOTICE '';
    RAISE NOTICE '📝 Changes made:';
    RAISE NOTICE '  - All authenticated users can now see ALL data';
    RAISE NOTICE '  - All authenticated users can create/update/delete data';
    RAISE NOTICE '  - user_id is now optional (but auto-populated for tracking)';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  IMPORTANT: Frontend code already updated! Just refresh browser.';
    RAISE NOTICE '';
END $$;