import { Prisma } from '../../../prisma/generated/client.js';

import type { PrismaClient, TransactionStatus } from '../../../prisma/generated/client.js';

type PrismaLikeClient = PrismaClient | Prisma.TransactionClient;

export type SellSessionRow = {
  sessionId: string;
  name: string;
  quantity: number;
  totalPrice: number;
  linesTotal: number;
  saleStatus: TransactionStatus | null;
};

export class SessionStatsRepository {
  constructor(private readonly client: PrismaLikeClient) {}

  async getSellSessions(userId: string, status?: TransactionStatus): Promise<SellSessionRow[]> {
    const statusFilter = status ? Prisma.sql`AND sl.sale_status = ${status}` : Prisma.empty;

    const rows = await this.client.$queryRaw<
      Array<{
        session_id: string;
        name: string;
        quantity: Prisma.Decimal | number;
        total_price: Prisma.Decimal | number;
        lines_total: bigint | number;
        sale_status: TransactionStatus | null;
      }>
    >(Prisma.sql`
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
    `);

    return rows.map((row) => ({
      sessionId: row.session_id,
      name: row.name,
      quantity: typeof row.quantity === 'number' ? row.quantity : Number(row.quantity.toString()),
      totalPrice:
        typeof row.total_price === 'number' ? row.total_price : Number(row.total_price.toString()),
      linesTotal: typeof row.lines_total === 'number' ? row.lines_total : Number(row.lines_total),
      saleStatus: row.sale_status,
    }));
  }
}
