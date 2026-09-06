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
  scraped_at TIMESTAMPTZ,
  item_count INTEGER NOT NULL CHECK (item_count >= 0)
);

ALTER TABLE wiki_scraped_pages
  ADD COLUMN IF NOT EXISTS last_failed_at TIMESTAMPTZ DEFAULT NULL;

ALTER TABLE wiki_scraped_pages
  ALTER COLUMN scraped_at DROP NOT NULL;

CREATE INDEX IF NOT EXISTS idx_wiki_scraped_pages_page_name ON wiki_scraped_pages (page_name);
CREATE INDEX IF NOT EXISTS idx_wiki_scraped_pages_scraped_at ON wiki_scraped_pages (scraped_at);

CREATE TABLE IF NOT EXISTS wiki_scrape_runs (
  id BIGSERIAL PRIMARY KEY,
  page_id BIGINT NOT NULL REFERENCES wiki_scraped_pages (id),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at TIMESTAMPTZ DEFAULT NULL,
  status TEXT NOT NULL DEFAULT 'running'
    CHECK (status IN ('running', 'success', 'failed')),
  add_count INTEGER NOT NULL DEFAULT 0 CHECK (add_count >= 0),
  update_count INTEGER NOT NULL DEFAULT 0 CHECK (update_count >= 0),
  error_message TEXT DEFAULT NULL
);

CREATE INDEX IF NOT EXISTS idx_wiki_scrape_runs_page_started_at
  ON wiki_scrape_runs (page_id, started_at);
