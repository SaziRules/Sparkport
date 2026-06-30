-- Hero banner slides managed from the dashboard

CREATE TABLE hero_banners (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url   TEXT        NOT NULL,
  title       TEXT        NOT NULL,
  description TEXT        NOT NULL DEFAULT '',
  cta_text    TEXT        NOT NULL DEFAULT 'Shop Now',
  cta_link    TEXT        NOT NULL DEFAULT '/shop',
  sort_order  INTEGER     NOT NULL DEFAULT 0,
  is_active   BOOLEAN     NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER set_hero_banners_updated_at
  BEFORE UPDATE ON hero_banners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE hero_banners ENABLE ROW LEVEL SECURITY;

-- Public can read active banners (used by the home page hero)
CREATE POLICY "public_read_active_banners" ON hero_banners
  FOR SELECT USING (is_active = true);

-- Seed with the current hardcoded slides
INSERT INTO hero_banners (image_url, title, description, cta_text, cta_link, sort_order) VALUES
  ('/images/school-kids.jpg',   'Back to School Deals',       'Quality medications and healthcare products delivered to your door',                                                     'Shop Now',   '/shop',                    0),
  ('/images/wellness.jpg',      'Wellness Screening',         'Your wellness, our priority. Book your screening today and live your best life.',                                        'Book Here',  '/promotions',              1),
  ('/images/heart-health.jpg',  'Cardiac Health Screening',   'Designed to detect risk factors for heart disease and stroke early. Take charge of your heart health today.',           'Book Here',  '/promotions',              2),
  ('/images/hero-main-care.jpg','Expert Care, Always',        'Professional healthcare services and advice when you need it',                                                          'Learn More', '/health-care-services',    3);
