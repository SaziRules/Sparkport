-- Hero slider promotions — managed from the dashboard
-- Replaces 015_hero_banners.sql (that file should not be applied)

CREATE TABLE promotions (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url    TEXT        NOT NULL,
  title        TEXT        NOT NULL,
  description  TEXT        NOT NULL DEFAULT '',
  cta_text     TEXT        NOT NULL DEFAULT 'Shop Now',
  cta_link     TEXT        NOT NULL DEFAULT '/shop',
  category     TEXT        NOT NULL DEFAULT 'general'
                           CHECK (category IN ('promotion','competition','article','announcement','seasonal','general')),
  sort_order   INTEGER     NOT NULL DEFAULT 0,
  is_active    BOOLEAN     NOT NULL DEFAULT true,
  impressions  INTEGER     NOT NULL DEFAULT 0,
  clicks       INTEGER     NOT NULL DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER set_promotions_updated_at
  BEFORE UPDATE ON promotions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-set published_at when is_active flips to true
CREATE OR REPLACE FUNCTION set_published_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_active = true AND (OLD.is_active = false OR OLD.published_at IS NULL) THEN
    NEW.published_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_promotions_published_at
  BEFORE UPDATE ON promotions
  FOR EACH ROW EXECUTE FUNCTION set_published_at();

-- Atomic stat increment (used by the tracking endpoint)
CREATE OR REPLACE FUNCTION increment_promotion_stat(p_id UUID, p_field TEXT)
RETURNS VOID AS $$
BEGIN
  IF p_field = 'impression' THEN
    UPDATE promotions SET impressions = impressions + 1 WHERE id = p_id;
  ELSIF p_field = 'click' THEN
    UPDATE promotions SET clicks = clicks + 1 WHERE id = p_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

-- Public can read active promotions (home page hero)
CREATE POLICY "public_read_active_promotions" ON promotions
  FOR SELECT USING (is_active = true);

-- Supabase Storage bucket for promotion images
INSERT INTO storage.buckets (id, name, public)
  VALUES ('promotions', 'promotions', true)
  ON CONFLICT (id) DO NOTHING;

CREATE POLICY "public_read_promotion_images" ON storage.objects
  FOR SELECT USING (bucket_id = 'promotions');

CREATE POLICY "service_role_manage_promotion_images" ON storage.objects
  FOR ALL USING (bucket_id = 'promotions');

-- Seed with current hardcoded hero slides
INSERT INTO promotions (image_url, title, description, cta_text, cta_link, category, sort_order, published_at) VALUES
  ('/images/school-kids.jpg',   'Back to School Deals',     'Quality medications and healthcare products delivered to your door',                                          'Shop Now',   '/shop',                 'promotion',    0, now()),
  ('/images/wellness.jpg',      'Wellness Screening',       'Your wellness, our priority. Book your screening today and live your best life.',                            'Book Here',  '/promotions',           'announcement', 1, now()),
  ('/images/heart-health.jpg',  'Cardiac Health Screening', 'Designed to detect risk factors for heart disease and stroke early. Take charge of your heart health today.','Book Here',  '/promotions',           'announcement', 2, now()),
  ('/images/hero-main-care.jpg','Expert Care, Always',      'Professional healthcare services and advice when you need it',                                               'Learn More', '/health-care-services', 'general',      3, now());
