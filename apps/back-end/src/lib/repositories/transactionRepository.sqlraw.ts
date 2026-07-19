import { Prisma } from '../../../prisma/generated/client.js';

export const getRunningTransactionsSql = (userId: string) => Prisma.sql`
  SELECT
    t.id,
    l.item_id,
    tl.quantity,
    t.tt,
    t.fee,
    t.ttc,
    t.status,
    t.created_at
  FROM transaction t
  JOIN transaction_lot tl ON t.id = tl.transaction_id
  JOIN lot l ON l.id = tl.lot_id
  WHERE t.user_id = ${userId}
    AND t.status = 'RUNNING'
    AND t.transaction_type = 'SELL'
  ORDER BY t.created_at, t.id
`;
