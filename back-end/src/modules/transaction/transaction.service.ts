import { TransactionType } from '../../../prisma/generated/client.js';
import { createRepositories } from '../../lib/repositories/index.js';

import {
  buildRequestedByItem,
  computeInitialSellTotals,
  loadSellItemsById,
  processSellLines,
  splitProcessableSellLines,
} from './sellProcess.js';

import type { PrismaClient } from '../../../prisma/generated/client.js';
import type { PedCardEntryInput } from '../../lib/repositories/pedCardRepository.js';
import type {
  BuyLineInput,
  SellLineInput,
  TransactionExecutionResult,
  TransactionProcessedItem,
  TransactionRejectedItem,
} from '../../types/index.js';
import type { StocksService } from '../inventory/index.js';

const PEDCARD_INSUFFICIENT_BALANCE_ERROR = 'PEDCARD_INSUFFICIENT_BALANCE';

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
      return { transactionId: null, processed: [], rejected };
    }

    // Compute purchase totals at transaction level.
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

    const buyFee = processable.reduce((sum, line) => sum + (line.fee ?? 0), 0);

    return this.prisma.$transaction(async (tx) => {
      const repos = createRepositories(tx);
      const pedCardEntries: PedCardEntryInput[] = [];

      if (buyFee > 0) {
        pedCardEntries.push({
          userId,
          transactionId: null,
          type: 'BUY_FEE',
          value: -buyFee,
        });
      }

      if (buyCostTtc > 0) {
        pedCardEntries.push({
          userId,
          transactionId: null,
          type: 'BUY_TTC',
          value: -buyCostTtc,
        });
      }

      const hasEnoughBalance = await repos.pedCard.hasEnoughBalanceForEntries(
        userId,
        pedCardEntries
      );

      if (!hasEnoughBalance) {
        throw new Error(PEDCARD_INSUFFICIENT_BALANCE_ERROR);
      }

      // Create the transaction, then persist IN lines and inventory lots.
      const transaction = await tx.transaction.create({
        data: {
          transaction_type: TransactionType.PURCHASE,
          status: 'CLOSED',
          user_id: userId,
          cost_tt: buyCostTt,
          cost_ttc: buyCostTtc,
          win_tt: 0,
          win_ttc: 0,
        },
        select: { id: true },
      });

      await repos.pedCard.createManyEntries(
        pedCardEntries.map((entry) => ({
          ...entry,
          transactionId: transaction.id,
        }))
      );

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
            lot_type: 'TRANSACTION',
            date_created: now,
            user_id: userId,
          },
          select: { id: true },
        });

        await tx.transactionLot.create({
          data: {
            transaction_id: transaction.id,
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
        transactionId: transaction.id,
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

    // Keep only processable lines before opening a transaction.
    const { processable, rejected } = splitProcessableSellLines(lines, availableByItem);

    if (!processable.length) {
      return { transactionId: null, processed: [], rejected };
    }

    return this.prisma.$transaction(async (tx) => {
      const repos = createRepositories(tx);
      const now = new Date().toISOString();

      // Load sell item metadata and derive provisional transaction totals.
      const itemById = await loadSellItemsById(tx, processable);
      const { initialWinTt, initialWinTtc } = computeInitialSellTotals(processable, itemById);
      const sellFee = processable.reduce((sum, line) => sum + line.fee, 0);
      const pedCardEntries: PedCardEntryInput[] =
        sellFee > 0
          ? [
              {
                userId,
                transactionId: null,
                type: 'SELL_FEE',
                value: -sellFee,
              },
            ]
          : [];

      const hasEnoughBalance = await repos.pedCard.hasEnoughBalanceForEntries(
        userId,
        pedCardEntries
      );

      if (!hasEnoughBalance) {
        throw new Error(PEDCARD_INSUFFICIENT_BALANCE_ERROR);
      }

      // Create sell transaction first; totals are finalized after line processing.
      const transaction = await tx.transaction.create({
        data: {
          transaction_type: TransactionType.SELL,
          status: 'OPENNED',
          user_id: userId,
          cost_tt: 0,
          cost_ttc: 0,
          win_tt: initialWinTt,
          win_ttc: initialWinTtc,
        },
        select: { id: true },
      });

      await repos.pedCard.createManyEntries(
        pedCardEntries.map((entry) => ({
          ...entry,
          transactionId: transaction.id,
        }))
      );

      // Delegate line-level processing (stackable vs non-stackable) to helpers.
      const {
        processed,
        rejected: mergedRejected,
        totalTt,
        totalTtc,
      } = await processSellLines({
        tx,
        userId,
        transactionId: transaction.id,
        now,
        processable,
        itemById,
        initialRejected: rejected,
        stocksService: this.stocksService,
      });

      // Remove empty transaction when no line could be sold.
      if (!processed.length) {
        await tx.transaction.delete({ where: { id: transaction.id } });
        return { transactionId: null, processed, rejected: mergedRejected };
      }

      // Persist final transaction totals after all accepted lines are processed.
      await tx.transaction.update({
        where: { id: transaction.id },
        data: {
          win_tt: totalTt,
          win_ttc: totalTtc,
        },
      });

      return {
        transactionId: transaction.id,
        processed,
        rejected: mergedRejected,
      };
    });
  }
}

export { TransactionService };
