CREATE TABLE IF NOT EXISTS hero_tiles (
  slot       SMALLINT PRIMARY KEY CHECK (slot IN (1, 2)),
  image_url  TEXT NOT NULL DEFAULT '',
  title      TEXT NOT NULL DEFAULT '',
  subtitle   TEXT NOT NULL DEFAULT '',
  link       TEXT NOT NULL DEFAULT '/',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO hero_tiles (slot, image_url, title, subtitle, link) VALUES
  (1, '/images/card-pills.jpg', 'Vitamins & Supplements', 'Boost your wellness', '/categories/vitamins'),
  (2, '/images/card-baby.png',  'Baby Care',              'Everything for baby', '/categories/baby')
ON CONFLICT (slot) DO NOTHING;

ALTER TABLE hero_tiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read hero_tiles" ON hero_tiles FOR SELECT USING (true);
