import { SessionType } from '../../../prisma/generated/client.js';

import {
  buildRequestedByItem,
  computeInitialSellTotals,
  loadSellItemsById,
  processSellLines,
  splitProcessableSellLines,
} from './sellProcess.js';

import type { PrismaClient } from '../../../prisma/generated/client.js';
import type {
  BuyLineInput,
  SellLineInput,
  TransactionExecutionResult,
  TransactionProcessedItem,
  TransactionRejectedItem,
} from '../../types/index.js';
import type { StocksService } from '../inventory/index.js';

class TransactionService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly stocksService: StocksService
  ) {}

  async buy(userId: string, lines: BuyLineInput[]): Promise<TransactionExecutionResult> {
    const now = new Date().toISOString();

    // Load referenced items once to validate lines and compute fallback amounts.
    const uniqueItemIds = Array.from(new Set(lines.map((line) => line.itemId)));
    const items = await this.prisma.item.findMany({
      where: { id: { in: uniqueItemIds } },
      select: { id: true, value: true },
    });
    const itemById = new Map(items.map((item) => [item.id, item]));

    // Split payload into processable lines and explicit rejections.
    const processable = lines.filter((line) => itemById.has(line.itemId));

    const rejected: TransactionRejectedItem[] = lines
      .filter((line) => !itemById.has(line.itemId))
      .map((line) => ({
        itemId: line.itemId,
        requestedQuantity: line.quantity,
        availableQuantity: 0,
        reason: 'ITEM_NOT_FOUND',
      }));

    if (!processable.length) {
      return { sessionId: null, processed: [], rejected };
    }

    // Compute purchase totals at session level.
    const buyCostTt = processable.reduce((sum, line) => {
      const item = itemById.get(line.itemId);
      if (!item) {
        return sum;
      }
      return sum + Number(item.value) * line.quantity;
    }, 0);

    const buyCostTtc = processable.reduce((sum, line) => {
      const item = itemById.get(line.itemId);
      if (!item) {
        return sum;
      }
      return sum + line.ttc;
    }, 0);

    return this.prisma.$transaction(async (tx) => {
      // Create the session, then persist IN lines and inventory lots.
      const session = await tx.session.create({
        data: {
          session_type: SessionType.TRANSACTION,
          status: 'CLOSED',
          user_id: userId,
          cost_tt: buyCostTt,
          cost_ttc: buyCostTtc,
          win_tt: 0,
          win_ttc: 0,
        },
        select: { id: true },
      });

      const processed: TransactionProcessedItem[] = [];

      for (const line of processable) {
        const item = itemById.get(line.itemId);
        if (!item) {
          continue;
        }

        const lineTt = line.tt;
        const lineTtc = line.ttc;

        const lot = await tx.lot.create({
          data: {
            quantity_remaining: line.quantity,
            quantity_exported: 0,
            price_remaining: String(lineTtc),
            item_id: line.itemId,
            lot_type: 'SESSION_LINE',
            date_created: now,
            user_id: userId,
          },
          select: { id: true },
        });

        await tx.sessionLine.create({
          data: {
            session_id: session.id,
            item_id: line.itemId,
            inventory_lot_id: lot.id,
            quantity: line.quantity,
            line_type: 'IN',
            line_status: 'CLOSED',
            sale_status: null,
            tt: lineTt,
            ttc: lineTtc,
            user_id: userId,
          },
        });

        processed.push({ itemId: line.itemId, quantity: line.quantity });
      }

      return {
        sessionId: session.id,
        processed,
        rejected,
      };
    });
  }

  async sell(userId: string, lines: SellLineInput[]): Promise<TransactionExecutionResult> {
    // Aggregate quantities by item and run a coarse stock availability check.
    const requestedByItem = buildRequestedByItem(lines);
    const availabilityRows = await this.stocksService.getAvailableStockByItemIds(
      userId,
      Array.from(requestedByItem.keys())
    );
    const availableByItem = new Map(
      availabilityRows.map((row) => [row.itemId, row.availableQuantity] as const)
    );

    // Keep only processable lines before opening a transaction session.
    const { processable, rejected } = splitProcessableSellLines(lines, availableByItem);

    if (!processable.length) {
      return { sessionId: null, processed: [], rejected };
    }

    return this.prisma.$transaction(async (tx) => {
      const now = new Date().toISOString();

      // Load sell item metadata and derive provisional session totals.
      const itemById = await loadSellItemsById(tx, processable);
      const { initialWinTt, initialWinTtc } = computeInitialSellTotals(processable, itemById);

      // Create sell session first; totals are finalized after line processing.
      const session = await tx.session.create({
        data: {
          session_type: SessionType.TRANSACTION,
          status: 'OPENNED',
          user_id: userId,
          cost_tt: 0,
          cost_ttc: 0,
          win_tt: initialWinTt,
          win_ttc: initialWinTtc,
        },
        select: { id: true },
      });

      // Delegate line-level processing (stackable vs non-stackable) to helpers.
      const {
        processed,
        rejected: mergedRejected,
        totalTt,
        totalTtc,
      } = await processSellLines({
        tx,
        userId,
        sessionId: session.id,
        now,
        processable,
        itemById,
        initialRejected: rejected,
        stocksService: this.stocksService,
      });

      // Remove empty session when no line could be sold.
      if (!processed.length) {
        await tx.session.delete({ where: { id: session.id } });
        return { sessionId: null, processed, rejected: mergedRejected };
      }

      // Persist final session totals after all accepted lines are processed.
      await tx.session.update({
        where: { id: session.id },
        data: {
          win_tt: totalTt,
          win_ttc: totalTtc,
        },
      });

      return {
        sessionId: session.id,
        processed,
        rejected: mergedRejected,
      };
    });
  }
}

export { TransactionService };
