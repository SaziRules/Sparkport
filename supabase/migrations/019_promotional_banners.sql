CREATE TABLE IF NOT EXISTS promotional_banners (
  slot        TEXT PRIMARY KEY CHECK (slot IN ('surgical', 'flu_season', 'healthcare')),
  image_url   TEXT NOT NULL DEFAULT '',
  link        TEXT NOT NULL DEFAULT '/',
  badge_text  TEXT NOT NULL DEFAULT '',
  title       TEXT NOT NULL DEFAULT '',
  title_line2 TEXT NOT NULL DEFAULT '',
  cta_text    TEXT NOT NULL DEFAULT '',
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO promotional_banners (slot, image_url, link, badge_text, title, title_line2, cta_text) VALUES
  ('surgical',   'https://sparkport.co.za/wp-content/uploads/SURGICAL-BANNER.png',                        '/surgical-catalogue',      '',                          '',                    '',              ''),
  ('flu_season', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80',              '/flu-protection-guide',    'Quick, Safe & Effective',   'Protect Yourself',    'This Flu Season',  'Read the Guide'),
  ('healthcare', 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&q=80',              '/health-care-services',    'Your Health, Our Priority', 'Comprehensive Care',  'Close to Home',    'Learn More About Our Services')
ON CONFLICT (slot) DO NOTHING;

ALTER TABLE promotional_banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read promotional_banners"
  ON promotional_banners FOR SELECT USING (true);
