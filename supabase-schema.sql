-- ============================================================================
-- StockMaster Database Schema for Supabase
-- ============================================================================
-- Run this script in Supabase SQL Editor: Dashboard → SQL Editor → New Query
-- Copy and paste this entire file, then click "Run"
-- ============================================================================

-- ============================================================================
-- 1. PROFILES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Enable insert for authentication" ON profiles
  FOR INSERT WITH CHECK (true);  -- Allow auto-insert via trigger

-- ============================================================================
-- 2. CATEGORIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#3B82F6',
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories (user-specific access)
CREATE POLICY "Users can view their own categories" ON categories
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own categories" ON categories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories" ON categories
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories" ON categories
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- 3. SUPPLIERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for suppliers (user-specific access)
CREATE POLICY "Users can view their own suppliers" ON suppliers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own suppliers" ON suppliers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own suppliers" ON suppliers
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own suppliers" ON suppliers
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- 4. PRODUCTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  sku TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
  cost_price DECIMAL(10, 2),
  selling_price DECIMAL(10, 2),
  quantity INTEGER NOT NULL DEFAULT 0,
  reorder_level INTEGER,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- RLS Policies for products (user-specific access)
CREATE POLICY "Users can view their own products" ON products
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own products" ON products
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own products" ON products
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own products" ON products
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- 5. STOCK MOVEMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS stock_movements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('in', 'out')),
  quantity DECIMAL(10, 3) NOT NULL,
  notes TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for stock_movements (user-specific access)
CREATE POLICY "Users can view their own stock movements" ON stock_movements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own stock movements" ON stock_movements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- 6. ALERTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('low_stock', 'out_of_stock')),
  message TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for alerts
CREATE POLICY "Authenticated users can view alerts" ON alerts
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert alerts" ON alerts
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update alerts" ON alerts
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete alerts" ON alerts
  FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function: Auto-create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    RETURN NEW;  -- Don't fail signup if profile creation fails
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function: Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at 
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at 
  BEFORE UPDATE ON suppliers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at 
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function: Auto-create alerts for low stock
CREATE OR REPLACE FUNCTION check_stock_levels()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete existing alerts for this product to avoid duplicates
  DELETE FROM alerts WHERE product_id = NEW.id AND status = 'active';
  
  -- Check for out of stock
  IF NEW.quantity = 0 THEN
    INSERT INTO alerts (product_id, type, message)
    VALUES (
      NEW.id,
      'out_of_stock',
      'Product "' || NEW.name || '" is out of stock!'
    );
  -- Check for low stock (if reorder_level is set)
  ELSIF NEW.reorder_level IS NOT NULL AND NEW.quantity <= NEW.reorder_level AND NEW.quantity > 0 THEN
    INSERT INTO alerts (product_id, type, message)
    VALUES (
      NEW.id,
      'low_stock',
      'Product "' || NEW.name || '" is running low. Current: ' || NEW.quantity || ', Reorder at: ' || NEW.reorder_level
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for stock level checking
CREATE TRIGGER check_product_stock_levels
  AFTER INSERT OR UPDATE OF quantity ON products
  FOR EACH ROW EXECUTE FUNCTION check_stock_levels();

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_supplier_id ON products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_product_id ON stock_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_created_at ON stock_movements(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_product_id ON alerts(product_id);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);

-- ============================================================================
-- VERIFICATION QUERIES (optional - run these to verify)
-- ============================================================================
-- Uncomment below to verify tables were created:

-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- ORDER BY table_name;

-- SELECT tablename, policyname FROM pg_policies 
-- WHERE schemaname = 'public';

-- ============================================================================
-- SETUP COMPLETE!
-- ============================================================================
-- Next steps:
-- 1. Copy your Supabase URL and anon key to frontend .env
-- 2. Copy your Supabase URL and service_role key to backend/.env
-- 3. Start the backend: cd backend && npm run dev
-- 4. Start the frontend: npm run dev
-- 5. Create an account and start using StockMaster!
-- ============================================================================
