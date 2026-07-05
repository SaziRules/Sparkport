-- Single-row config table for the full-width home page banner
CREATE TABLE IF NOT EXISTS image_banner (
  id         SMALLINT PRIMARY KEY CHECK (id = 1),
  image_url  TEXT NOT NULL DEFAULT '',
  link       TEXT NOT NULL DEFAULT '/shop',
  alt_text   TEXT NOT NULL DEFAULT 'Promotional Banner',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO image_banner (id, image_url, link, alt_text) VALUES
  (1, 'https://sparkport.co.za/wp-content/uploads/sparkport-web-banner.png', '/product-category/brain-boosters', 'Promotional Banner')
ON CONFLICT (id) DO NOTHING;

ALTER TABLE image_banner ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read image_banner"
  ON image_banner FOR SELECT USING (true);
