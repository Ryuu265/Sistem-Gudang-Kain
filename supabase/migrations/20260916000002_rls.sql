-- =======================================================
-- SISTEM GUDANG KAIN - ROW LEVEL SECURITY (MIGRATION 02)
-- =======================================================

-- Enable RLS on all tables
ALTER TABLE business_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_note_status_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check role
CREATE OR REPLACE FUNCTION current_user_role()
RETURNS user_role AS $$
DECLARE
  u_role user_role;
BEGIN
  SELECT role INTO u_role FROM profiles WHERE id = auth.uid();
  IF u_role IS NULL THEN
    RETURN 'viewer'::user_role;
  END IF;
  RETURN u_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- POLICIES:

-- 1. Read policy for all authenticated users (admin, staff, viewer)
CREATE POLICY "Allow read for all authenticated users" ON business_info FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read for all authenticated users" ON categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read for all authenticated users" ON units FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read for all authenticated users" ON suppliers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read for all authenticated users" ON customers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read for all authenticated users" ON products FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read for all authenticated users" ON transactions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read for all authenticated users" ON transaction_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read for all authenticated users" ON delivery_notes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read for all authenticated users" ON delivery_note_status_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read for all authenticated users" ON stock_movements FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read for all authenticated users" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read for all authenticated users" ON audit_logs FOR SELECT TO authenticated USING (true);

-- 2. Staff and Admin write access for Master Data & Transactions
CREATE POLICY "Allow insert update for staff and admin" ON categories FOR ALL TO authenticated USING (current_user_role() IN ('staff', 'admin'));
CREATE POLICY "Allow insert update for staff and admin" ON units FOR ALL TO authenticated USING (current_user_role() IN ('staff', 'admin'));
CREATE POLICY "Allow insert update for staff and admin" ON suppliers FOR ALL TO authenticated USING (current_user_role() IN ('staff', 'admin'));
CREATE POLICY "Allow insert update for staff and admin" ON customers FOR ALL TO authenticated USING (current_user_role() IN ('staff', 'admin'));
CREATE POLICY "Allow insert update for staff and admin" ON products FOR ALL TO authenticated USING (current_user_role() IN ('staff', 'admin'));
CREATE POLICY "Allow insert update for staff and admin" ON transactions FOR ALL TO authenticated USING (current_user_role() IN ('staff', 'admin'));
CREATE POLICY "Allow insert update for staff and admin" ON transaction_items FOR ALL TO authenticated USING (current_user_role() IN ('staff', 'admin'));
CREATE POLICY "Allow insert update for staff and admin" ON delivery_notes FOR ALL TO authenticated USING (current_user_role() IN ('staff', 'admin'));
CREATE POLICY "Allow insert update for staff and admin" ON delivery_note_status_logs FOR ALL TO authenticated USING (current_user_role() IN ('staff', 'admin'));

-- 3. Admin ONLY policies for Business Info, User Profiles, Audit Logs
CREATE POLICY "Admin write access business_info" ON business_info FOR ALL TO authenticated USING (current_user_role() = 'admin');
CREATE POLICY "Admin write access profiles" ON profiles FOR ALL TO authenticated USING (current_user_role() = 'admin');
CREATE POLICY "Admin write access audit_logs" ON audit_logs FOR ALL TO authenticated USING (current_user_role() = 'admin');
