CREATE TABLE IF NOT EXISTS item_categories (
    id TEXT PRIMARY KEY,
    date_created TEXT NOT NULL,
    date_updated TEXT,
    is_active INTEGER NOT NULL,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "user" (
    id TEXT PRIMARY KEY,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    pseudo TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    role INTEGER NOT NULL,
    date_created TEXT NOT NULL,
    date_updated TEXT,
    is_active INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS item_types (
    id TEXT PRIMARY KEY,
    category_id TEXT NOT NULL,
    date_created TEXT NOT NULL,
    date_updated TEXT,
    is_active INTEGER NOT NULL,
    name TEXT NOT NULL,
    CONSTRAINT fk_item_types_category
        FOREIGN KEY (category_id) REFERENCES item_categories(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS items (
    id TEXT PRIMARY KEY,
    image_url_id TEXT NOT NULL,
    value NUMERIC(10,5) NOT NULL,
    is_limited INTEGER NOT NULL,
    item_type_id TEXT NOT NULL,
    date_created TEXT NOT NULL,
    date_updated TEXT,
    is_active INTEGER NOT NULL,
    name TEXT NOT NULL,
    CONSTRAINT fk_items_type
        FOREIGN KEY (item_type_id) REFERENCES item_types(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS inventory_lots (
    id TEXT PRIMARY KEY,
    quantity_remaining INTEGER NOT NULL,
    quantity_exported INTEGER NOT NULL,
    price_remaining TEXT NOT NULL,
    item_id TEXT NOT NULL,
    lot_type INTEGER NOT NULL,
    date_created TEXT NOT NULL,
    date_updated TEXT,
    is_active INTEGER NOT NULL,
    CONSTRAINT fk_inventory_lots_item
        FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    transaction_type INTEGER NOT NULL,
    sell_status INTEGER,
    quantity INTEGER NOT NULL,
    tt_value NUMERIC(10,5) NOT NULL,
    ttc_value NUMERIC(10,5) NOT NULL,
    fee NUMERIC(10,5),
    date_created TEXT NOT NULL,
    date_updated TEXT,
    is_active INTEGER NOT NULL,
    item_id TEXT NOT NULL,
    CONSTRAINT fk_transactions_item
        FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS inventory_lot_transactions (
    inventory_lot_id TEXT NOT NULL,
    transaction_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    PRIMARY KEY (inventory_lot_id, transaction_id),
    CONSTRAINT fk_invlot_transactions_lot
        FOREIGN KEY (inventory_lot_id) REFERENCES inventory_lots(id) ON DELETE RESTRICT,
    CONSTRAINT fk_invlot_transactions_tx
        FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE RESTRICT
);

-- Indexes
CREATE INDEX idx_inventory_lots_item_id ON inventory_lots(item_id);
CREATE INDEX idx_inventory_lot_transactions_tx ON inventory_lot_transactions(transaction_id);

CREATE UNIQUE INDEX idx_item_categories_name ON item_categories(name);
CREATE INDEX idx_items_item_type_id ON items(item_type_id);
CREATE UNIQUE INDEX idx_items_name ON items(name);
CREATE INDEX idx_item_types_category_id ON item_types(category_id);
CREATE UNIQUE INDEX idx_item_types_name ON item_types(name);
CREATE INDEX idx_transactions_item_id ON transactions(item_id);
CREATE UNIQUE INDEX idx_user_pseudo ON "user"(pseudo);
