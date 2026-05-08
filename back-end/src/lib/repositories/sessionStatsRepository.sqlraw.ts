import { Prisma } from '../../../prisma/generated/client.js';

import type { TransactionStatus } from '../../../prisma/generated/client.js';

const getSellSessionsSql = (userId: string, status?: TransactionStatus) => {
  const statusFilter = status ? Prisma.sql`AND sl.sale_status = ${status}` : Prisma.empty;

  return Prisma.sql`
    SELECT
      sl.session_id,
      i.name,
      COALESCE(SUM(sl.quantity), 0) AS quantity,
      COALESCE(SUM(sl.ttc), 0) AS total_price,
      COUNT(*) AS lines_total,
      sl.sale_status
    FROM session_line sl
    JOIN session s ON s.id = sl.session_id
    JOIN item i ON i.id = sl.item_id
    WHERE sl.user_id = ${userId}
      AND sl.line_type = 'OUT'
      AND s.session_type = 'TRADE'
      ${statusFilter}
    GROUP BY sl.session_id, i.id, i.name, sl.sale_status
    ORDER BY i.name, sl.session_id
  `;
};

const getRunningSellLinesSql = (userId: string) => Prisma.sql`
  SELECT
    sl.id AS session_line_id,
    sl.session_id,
    sl.item_id,
    i.name AS item_name,
    sl.inventory_lot_id,
    sl.quantity,
    sl.tt,
    sl.ttc,
    sl.line_status,
    sl.sale_status
  FROM session_line sl
  JOIN session s ON s.id = sl.session_id
  JOIN item i ON i.id = sl.item_id
  WHERE sl.user_id = ${userId}
    AND s.user_id = ${userId}
    AND sl.line_type = 'OUT'
    AND sl.sale_status = 'RUNNING'
    AND s.session_type = 'TRADE'
  ORDER BY sl.session_id, sl.id
`;

export { getSellSessionsSql, getRunningSellLinesSql };
