import PrismaCrudRepository from './prismaCrudRepository.js';
import { getRunningSellLinesSql } from './transaction.sqlraw.js';
import { getRunningTransactionsSql } from './transactionRepository.sqlraw.js';

import type { Prisma, TransactionStatus } from '../../../prisma/generated/client.js';
import type { PrismaLikeClient } from '../../types/index.js';
import type { RunningTransactionDtos } from '@eu/types';

type RunningSellLineRow = {
  id: string;
  item_id: string;
  quantity: Prisma.Decimal | number;
  tt: Prisma.Decimal | number;
  fee: Prisma.Decimal | number;
  ttc: Prisma.Decimal | number;
  status: TransactionStatus;
  created_at: string;
};

type TransactionPatchRow = Prisma.TransactionGetPayload<{
  select: {
    id: true;
    status: true;
    lines: {
      select: {
        transaction_id: true;
        lot_id: true;
        quantity: true;
      };
    };
  };
}>;

export class TransactionRepository extends PrismaCrudRepository<PrismaLikeClient['transaction']> {
  constructor(private readonly client: PrismaLikeClient) {
    super(client.transaction);
  }

  async findUnique(
    args: Parameters<PrismaLikeClient['transaction']['findUnique']>[0],
    userId?: string
  ): Promise<TransactionPatchRow | null> {
    return (await super.findUnique(args, userId)) as TransactionPatchRow | null;
  }

  async getRunningTransactions(userId: string): Promise<RunningTransactionDtos> {
    const rows = await this.client.$queryRaw<RunningSellLineRow[]>(
      getRunningTransactionsSql(userId)
    );

    return rows.map((row) => ({
      id: row.id,
      itemId: row.item_id,
      quantity: typeof row.quantity === 'number' ? row.quantity : Number(row.quantity.toString()),
      tt: typeof row.tt === 'number' ? row.tt : Number(row.tt.toString()),
      fee: typeof row.fee === 'number' ? row.fee : Number(row.fee.toString()),
      ttc: typeof row.ttc === 'number' ? row.ttc : Number(row.ttc.toString()),
      status: row.status,
      createdAt: row.created_at,
    }));
  }
}
