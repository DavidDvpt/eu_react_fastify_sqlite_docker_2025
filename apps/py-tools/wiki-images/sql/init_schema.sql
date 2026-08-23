CREATE TABLE IF NOT EXISTS images (
  id BIGSERIAL PRIMARY KEY,
  id_image BIGINT NOT NULL,
  variant TEXT NOT NULL CHECK (variant IN ('micro', 'normal', 'original')),
  extension TEXT NOT NULL CHECK (extension IN ('jpg', 'png')),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (id_image, variant)
);

CREATE INDEX IF NOT EXISTS idx_images_id_image ON images (id_image);
CREATE INDEX IF NOT EXISTS idx_images_variant ON images (variant);

CREATE TABLE IF NOT EXISTS download_attempts (
  id BIGSERIAL PRIMARY KEY,
  id_image BIGINT NOT NULL,
  variant TEXT NOT NULL CHECK (variant IN ('micro', 'normal', 'original')),
  extension TEXT NOT NULL CHECK (extension IN ('jpg', 'png')),
  file_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('ok', 'ko')),
  error_code TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_download_attempts_id_image ON download_attempts (id_image);
CREATE INDEX IF NOT EXISTS idx_download_attempts_variant ON download_attempts (variant);
