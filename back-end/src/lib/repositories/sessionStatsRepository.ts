import { getSellSessionsSql } from './sessionStatsRepository.sqlraw.js';

import type { Prisma } from '../../../prisma/generated/client.js';
import type { TransactionStatus } from '../../../prisma/generated/client.js';
import type { PrismaLikeClient, SellSessionRow } from '../../types/index.js';

export class SessionStatsRepository {
  constructor(private readonly client: PrismaLikeClient) {}

  async getSellSessions(userId: string, status?: TransactionStatus): Promise<SellSessionRow[]> {
    const rows = await this.client.$queryRaw<
      Array<{
        session_id: string;
        name: string;
        quantity: Prisma.Decimal | number;
        total_price: Prisma.Decimal | number;
        lines_total: bigint | number;
        sale_status: TransactionStatus | null;
      }>
    >(getSellSessionsSql(userId, status));

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
