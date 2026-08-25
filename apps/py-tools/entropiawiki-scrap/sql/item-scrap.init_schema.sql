CREATE TABLE IF NOT EXISTS wiki_items (
  id BIGSERIAL PRIMARY KEY,
  item_id BIGINT NOT NULL,
  item_name TEXT NOT NULL,
  image_id BIGINT,
  item_type TEXT,
  item_class TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  UNIQUE (item_id)
);

ALTER TABLE wiki_items
  ADD COLUMN IF NOT EXISTS item_type TEXT;

ALTER TABLE wiki_items
  ADD COLUMN IF NOT EXISTS item_class TEXT;

CREATE INDEX IF NOT EXISTS idx_wiki_items_item_id ON wiki_items (item_id);
CREATE INDEX IF NOT EXISTS idx_wiki_items_image_id ON wiki_items (image_id);

CREATE TABLE IF NOT EXISTS wiki_scraped_pages (
  id BIGSERIAL PRIMARY KEY,
  page_name TEXT NOT NULL UNIQUE,
  scraped_at TIMESTAMPTZ NOT NULL,
  item_count INTEGER NOT NULL CHECK (item_count >= 0)
);

CREATE INDEX IF NOT EXISTS idx_wiki_scraped_pages_page_name ON wiki_scraped_pages (page_name);
CREATE INDEX IF NOT EXISTS idx_wiki_scraped_pages_scraped_at ON wiki_scraped_pages (scraped_at);
