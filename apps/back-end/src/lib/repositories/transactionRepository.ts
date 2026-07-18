import { getRunningSellLinesSql } from './transactionRepository.sqlraw.js';

import type { Prisma } from '../../../prisma/generated/client.js';
import type { RunningTransactionLineRow } from '../../modules/transactionStatus/index.js';
import type { PrismaLikeClient } from '../../types/index.js';

export class TransactionRepository {
  constructor(private readonly client: PrismaLikeClient) {}

  async getRunningSellLines(userId: string): Promise<RunningTransactionLineRow[]> {
    const rows = await this.client.$queryRaw<
      Array<{
        id: string;
        item_id: string;
        quantity: Prisma.Decimal | number;
        tt: Prisma.Decimal | number;
        fee: Prisma.Decimal | number;
        ttc: Prisma.Decimal | number;
        status: 'RUNNING';
        created_at: string;
      }>
    >(getRunningSellLinesSql(userId));

    return rows.map((row) => ({
      id: row.id,
      itemId: row.item_id,
      quantity: typeof row.quantity === 'number' ? row.quantity : Number(row.quantity.toString()),
      tt: typeof row.tt === 'number' ? row.tt : Number(row.tt.toString()),
      fee: typeof row.fee === 'number' ? row.fee : Number(row.tt.toString()),
      ttc: typeof row.ttc === 'number' ? row.ttc : Number(row.ttc.toString()),
      status: row.status,
      createdAt: row.created_at,
    }));
  }
}
