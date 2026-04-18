import { Prisma } from '../../../prisma/generated/client.js';

const getStockSql = (userId: string) => Prisma.sql`
  SELECT
    i.id AS item_id,
    i.image_url_id,
    i.name,
    i.value AS unit_price,
    COALESCE(SUM(l.quantity_remaining), 0) AS quantity,
    COALESCE(SUM(l.quantity_remaining * i.value), 0) AS total_price
  FROM item i
  JOIN lot l ON l.item_id = i.id AND l.is_active = true
  WHERE l.user_id = ${userId}
    AND l.quantity_remaining > 0
  GROUP BY i.id, i.image_url_id, i.name, i.value
  ORDER BY i.name
`;

const getStockByItemIdSql = (userId: string, itemId: string) => Prisma.sql`
  SELECT
    i.id AS item_id,
    i.image_url_id,
    i.name,
    i.value AS unit_price,
    COALESCE(SUM(l.quantity_remaining), 0) AS quantity,
    COALESCE(SUM(l.quantity_remaining * i.value), 0) AS total_price
  FROM item i
  JOIN lot l ON l.item_id = i.id AND l.is_active = true
  WHERE l.user_id = ${userId}
    AND i.id = ${itemId}
    AND l.quantity_remaining > 0
  GROUP BY i.id, i.image_url_id, i.name, i.value
`;

const getLotsInByItemIdSql = (userId: string, itemId: string) => Prisma.sql`
  SELECT
    l.id,
    l.lot_type,
    l.quantity_remaining,
    COALESCE(sl_in.quantity, l.quantity_remaining + l.quantity_exported) AS quantity_initial,
    l.quantity_exported,
    l.price_remaining,
    l.date_created
  FROM lot l
  LEFT JOIN LATERAL (
    SELECT sl.quantity
    FROM session_line sl
    WHERE sl.inventory_lot_id = l.id
      AND sl.user_id = ${userId}
      AND sl.item_id = ${itemId}
      AND sl.line_type = 'IN'
    ORDER BY sl.id ASC
    LIMIT 1
  ) sl_in ON TRUE
  WHERE l.user_id = ${userId}
    AND l.item_id = ${itemId}
    AND l.is_active = true
  ORDER BY l.date_created DESC
`;

const getLotsOutByItemIdSql = (userId: string, itemId: string) => Prisma.sql`
  SELECT
    sl.id,
    l.date_created,
    sl.quantity,
    sl.tt,
    sl.ttc,
    sl.sale_status
  FROM session_line sl
  LEFT JOIN lot l ON l.id = sl.inventory_lot_id
  WHERE sl.user_id = ${userId}
    AND sl.item_id = ${itemId}
    AND sl.line_type = 'OUT'
  ORDER BY sl.id DESC
`;

const getAvailableStockByItemIdsSql = (userId: string, itemIds: string[]) => Prisma.sql`
  SELECT
    l.item_id,
    COALESCE(SUM(l.quantity_remaining), 0) AS available_quantity
  FROM lot l
  WHERE l.user_id = ${userId}
    AND l.is_active = true
    AND l.quantity_remaining > 0
    AND l.item_id IN (${Prisma.join(itemIds)})
  GROUP BY l.item_id
`;

const getAvailableLotsFifoByItemIdSql = (userId: string, itemId: string) => Prisma.sql`
  SELECT
    l.id,
    l.item_id,
    l.quantity_remaining,
    l.quantity_exported,
    l.price_remaining,
    l.date_created
  FROM lot l
  WHERE l.user_id = ${userId}
    AND l.item_id = ${itemId}
    AND l.is_active = true
    AND l.quantity_remaining > 0
  ORDER BY l.date_created ASC, l.id ASC
`;

const getSellableLotByIdSql = (userId: string, lotId: string) => Prisma.sql`
  SELECT
    l.id,
    l.item_id,
    l.quantity_remaining,
    l.quantity_exported,
    l.price_remaining,
    l.date_created
  FROM lot l
  WHERE l.user_id = ${userId}
    AND l.id = ${lotId}
    AND l.is_active = true
    AND l.quantity_remaining > 0
  LIMIT 1
`;

export {
  getAvailableLotsFifoByItemIdSql,
  getAvailableStockByItemIdsSql,
  getLotsInByItemIdSql,
  getLotsOutByItemIdSql,
  getSellableLotByIdSql,
  getStockByItemIdSql,
  getStockSql,
};
