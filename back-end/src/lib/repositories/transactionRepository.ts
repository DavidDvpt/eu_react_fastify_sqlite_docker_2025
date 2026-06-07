import { getRunningSellLinesSql, getSellSessionsSql } from './transactionRepository.sqlraw.js';

import type { Prisma } from '../../../prisma/generated/client.js';
import type { TransactionStatus } from '../../../prisma/generated/client.js';
import type {
  RunningTransactionLineRow,
  TransactionSellRow,
} from '../../modules/transactionStatus/index.js';
import type { PrismaLikeClient } from '../../types/index.js';

export class TransactionRepository {
  constructor(private readonly client: PrismaLikeClient) {}

  async getSellSessions(userId: string, status?: TransactionStatus): Promise<TransactionSellRow[]> {
    const rows = await this.client.$queryRaw<
      Array<{
        transaction_id: string;
        name: string;
        quantity: Prisma.Decimal | number;
        total_price: Prisma.Decimal | number;
        lines_total: bigint | number;
        sale_status: TransactionStatus | null;
      }>
    >(getSellSessionsSql(userId, status));

    return rows.map((row) => ({
      transactionId: row.transaction_id,
      name: row.name,
      quantity: typeof row.quantity === 'number' ? row.quantity : Number(row.quantity.toString()),
      totalPrice:
        typeof row.total_price === 'number' ? row.total_price : Number(row.total_price.toString()),
      linesTotal: typeof row.lines_total === 'number' ? row.lines_total : Number(row.lines_total),
      saleStatus: row.sale_status,
    }));
  }

  async getRunningSellLines(userId: string): Promise<RunningTransactionLineRow[]> {
    const rows = await this.client.$queryRaw<
      Array<{
        transaction_lot_id: string;
        transaction_id: string;
        item_id: string;
        item_name: string;
        inventory_lot_id: string | null;
        quantity: Prisma.Decimal | number;
        tt: Prisma.Decimal | number;
        ttc: Prisma.Decimal | number;
        line_status: 'OPENNED' | 'CLOSED' | 'ARCHIVED';
        sale_status: 'RUNNING';
      }>
    >(getRunningSellLinesSql(userId));

    return rows.map((row) => ({
      transactionLotId: row.transaction_lot_id,
      transactionId: row.transaction_id,
      itemId: row.item_id,
      itemName: row.item_name,
      inventoryLotId: row.inventory_lot_id,
      quantity: typeof row.quantity === 'number' ? row.quantity : Number(row.quantity.toString()),
      tt: typeof row.tt === 'number' ? row.tt : Number(row.tt.toString()),
      ttc: typeof row.ttc === 'number' ? row.ttc : Number(row.ttc.toString()),
      lineStatus: row.line_status,
      saleStatus: row.sale_status,
    }));
  }
}
