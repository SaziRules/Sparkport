-- Auto-assign member numbers to all profiles

CREATE SEQUENCE IF NOT EXISTS profiles_member_seq START WITH 10001 INCREMENT BY 1;

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS member_number TEXT UNIQUE DEFAULT NULL;

CREATE OR REPLACE FUNCTION set_member_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.member_number IS NULL THEN
    NEW.member_number := 'SPK-' || LPAD(nextval('profiles_member_seq')::TEXT, 6, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_set_member_number ON profiles;
CREATE TRIGGER trg_set_member_number
  BEFORE INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_member_number();

-- Backfill existing profiles that have no member_number
UPDATE profiles
SET member_number = 'SPK-' || LPAD(nextval('profiles_member_seq')::TEXT, 6, '0')
WHERE member_number IS NULL;
