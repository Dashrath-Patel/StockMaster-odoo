-- ============================================================================
-- FIX: Add missing INSERT policy for alerts table
-- ============================================================================
-- Issue: Triggers that auto-create alerts were failing due to missing INSERT policy
-- Solution: Add INSERT policy for authenticated users
-- ============================================================================

-- Drop existing policies (if any) to avoid conflicts
DROP POLICY IF EXISTS "Authenticated users can insert alerts" ON alerts;

-- Create INSERT policy for alerts table
CREATE POLICY "Authenticated users can insert alerts" ON alerts
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Verify the policy was created
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'alerts'
ORDER BY policyname;
