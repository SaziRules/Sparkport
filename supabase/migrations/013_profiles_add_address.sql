ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS address1  text,
  ADD COLUMN IF NOT EXISTS address2  text,
  ADD COLUMN IF NOT EXISTS city      text,
  ADD COLUMN IF NOT EXISTS province  text,
  ADD COLUMN IF NOT EXISTS postcode  text;
