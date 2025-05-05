-- Add admin role to profiles
ALTER TABLE profiles
  DROP CONSTRAINT IF EXISTS profiles_role_check,
  ADD CONSTRAINT profiles_role_check
    CHECK (role = ANY (ARRAY['consumer'::text, 'vendor'::text, 'admin'::text]));

-- Create admin_settings table
CREATE TABLE IF NOT EXISTS admin_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id),
  updated_by uuid REFERENCES profiles(id)
);

-- Create admin_audit_log table
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES profiles(id) NOT NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text,
  changes jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_settings
CREATE POLICY "Only admins can view settings"
  ON admin_settings
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  ));

CREATE POLICY "Only admins can modify settings"
  ON admin_settings
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  ));

-- Create policies for admin_audit_log
CREATE POLICY "Only admins can view audit logs"
  ON admin_audit_log
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  ));

CREATE POLICY "Only admins can create audit logs"
  ON admin_audit_log
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  ));

-- Create indexes
CREATE INDEX admin_settings_key_idx ON admin_settings(key);
CREATE INDEX admin_audit_log_admin_id_idx ON admin_audit_log(admin_id);
CREATE INDEX admin_audit_log_created_at_idx ON admin_audit_log(created_at DESC);
CREATE INDEX admin_audit_log_entity_type_id_idx ON admin_audit_log(entity_type, entity_id);

-- Create updated_at trigger for admin_settings
CREATE TRIGGER update_admin_settings_updated_at
  BEFORE UPDATE ON admin_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert initial settings
INSERT INTO admin_settings (key, value, description) VALUES
  ('stripe_settings', '{"commission_rate": 0.15, "platform_fee": 2.50}', 'Stripe payment and commission configuration'),
  ('security_settings', '{"session_timeout": 3600, "max_login_attempts": 5, "password_expiry_days": 90}', 'Security and authentication settings'),
  ('notification_settings', '{"email_enabled": true, "sms_enabled": false}', 'System notification settings')
ON CONFLICT (key) DO NOTHING;