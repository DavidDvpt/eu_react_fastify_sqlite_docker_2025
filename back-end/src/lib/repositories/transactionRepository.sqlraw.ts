import { Prisma } from '../../../prisma/generated/client.js';

import type { TransactionStatus } from '../../../prisma/generated/client.js';

const getSellSessionsSql = (userId: string, status?: TransactionStatus) => {
  const statusFilter = status ? Prisma.sql`AND sl.sale_status = ${status}` : Prisma.empty;

  return Prisma.sql`
    SELECT
      sl.transaction_id,
      i.name,
      COALESCE(SUM(sl.quantity), 0) AS quantity,
      COALESCE(SUM(sl.ttc), 0) AS total_price,
      COUNT(*) AS lines_total,
      sl.sale_status
    FROM transaction_lot sl
    JOIN transaction s ON s.id = sl.transaction_id
    JOIN item i ON i.id = sl.item_id
    WHERE sl.user_id = ${userId}
      AND sl.line_type = 'OUT'
      AND s.transaction_type = 'SELL'
      ${statusFilter}
    GROUP BY sl.transaction_id, i.id, i.name, sl.sale_status
    ORDER BY i.name, sl.transaction_id
  `;
};

const getRunningSellLinesSql = (userId: string) => Prisma.sql`
  SELECT
    sl.id AS transaction_lot_id,
    sl.transaction_id,
    sl.item_id,
    i.name AS item_name,
    sl.inventory_lot_id,
    sl.quantity,
    sl.tt,
    sl.ttc,
    sl.line_status,
    sl.sale_status
  FROM transaction_lot sl
  JOIN transaction s ON s.id = sl.transaction_id
  JOIN item i ON i.id = sl.item_id
  WHERE sl.user_id = ${userId}
    AND s.user_id = ${userId}
    AND sl.line_type = 'OUT'
    AND sl.sale_status = 'RUNNING'
    AND s.transaction_type = 'SELL'
  ORDER BY sl.transaction_id, sl.id
`;

export { getSellSessionsSql, getRunningSellLinesSql };
