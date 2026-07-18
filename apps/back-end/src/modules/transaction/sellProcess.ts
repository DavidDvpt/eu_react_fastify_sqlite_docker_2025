import type { Prisma } from '../../../prisma/generated/client.js';
import type {
  SellItemData,
  SellProcessingResult,
  SellLineInput,
  SellTotals,
  TransactionProcessedItem,
  TransactionRejectedItem,
} from '../../types/index.js';
import type { StocksService } from '../inventory/index.js';

const buildRequestedByItem = (lines: SellLineInput[]): Map<string, number> => {
  const requestedByItem = new Map<string, number>();
  for (const line of lines) {
    const current = requestedByItem.get(line.itemId) ?? 0;
    requestedByItem.set(line.itemId, current + line.quantity);
  }
  return requestedByItem;
};

const splitProcessableSellLines = (
  lines: SellLineInput[],
  availableByItem: Map<string, number>
): { processable: SellLineInput[]; rejected: TransactionRejectedItem[] } => {
  const processable: SellLineInput[] = [];
  const rejected: TransactionRejectedItem[] = [];

  for (const line of lines) {
    const available = availableByItem.get(line.itemId) ?? 0;
    if (line.quantity > available) {
      rejected.push({
        itemId: line.itemId,
        requestedQuantity: line.quantity,
        availableQuantity: available,
        reason: 'INSUFFICIENT_STOCK',
      });
      continue;
    }
    processable.push(line);
  }

  return { processable, rejected };
};

const loadSellItemsById = async (
  tx: Prisma.TransactionClient,
  processable: SellLineInput[]
): Promise<Map<string, SellItemData>> => {
  const itemIds = Array.from(new Set(processable.map((line) => line.itemId)));
  const items = await tx.item.findMany({
    where: { id: { in: itemIds } },
    select: { id: true, value: true, is_stackable: true },
  });

  return new Map(
    items.map((item) => [
      item.id,
      {
        id: item.id,
        unitPrice: Number(item.value),
        isStackable: item.is_stackable,
      },
    ])
  );
};

const computeInitialSellTotals = (
  processable: SellLineInput[],
  itemById: Map<string, SellItemData>
): SellTotals => {
  let initialWinTt = 0;
  let initialWinTtc = 0;

  for (const line of processable) {
    const item = itemById.get(line.itemId);
    if (!item) {
      continue;
    }

    const lineTt = item.isStackable
      ? item.unitPrice * line.quantity
      : (line.tt ?? item.unitPrice * line.quantity);

    initialWinTt += lineTt;
    initialWinTtc += Number(line.ttc);
  }

  return { initialWinTt, initialWinTtc };
};

const processStackableSellLine = async (input: {
  tx: Prisma.TransactionClient;
  stocksService: StocksService;
  userId: string;
  now: string;
  transactionId: string;
  line: SellLineInput;
  item: SellItemData;
}): Promise<
  { ok: true; lineTt: number; lineTtc: number } | { ok: false; rejection: TransactionRejectedItem }
> => {
  const { tx, stocksService, userId, now, transactionId, line, item } = input;
  const lots = await stocksService.getAvailableLotsFifoByItemId(userId, line.itemId);
  const available = lots.reduce((sum, lot) => sum + lot.quantityRemaining, 0);
  if (line.quantity > available) {
    return {
      ok: false,
      rejection: {
        itemId: line.itemId,
        requestedQuantity: line.quantity,
        availableQuantity: available,
        reason: 'INSUFFICIENT_STOCK',
      },
    };
  }

  const lineTt = item.unitPrice * line.quantity;
  const lineTtc = line.ttc;
  let remainingToSell = line.quantity;
  let remainingSaleTt = lineTt;
  let remainingSaleTtc = lineTtc;

  for (const lot of lots) {
    if (remainingToSell < 0) {
      throw new Error('Invariant violation: remainingToSell cannot be negative');
    }

    if (remainingToSell === 0) {
      break;
    }

    const consumed = Math.min(remainingToSell, lot.quantityRemaining);
    const consumedPrice = item.unitPrice * consumed;
    const isFinalConsumption = consumed === remainingToSell;
    const consumedSaleTt = isFinalConsumption
      ? remainingSaleTt
      : (lineTt * consumed) / line.quantity;
    const consumedSaleTtc = isFinalConsumption
      ? remainingSaleTtc
      : (lineTtc * consumed) / line.quantity;

    await tx.transactionLot.create({
      data: {
        transaction_id: transactionId,
        item_id: line.itemId,
        inventory_lot_id: lot.id,
        quantity: consumed,
        line_type: 'OUT',
        line_status: 'OPENNED',
        sale_status: 'RUNNING',
        tt: consumedSaleTt,
        ttc: consumedSaleTtc,
        user_id: userId,
      },
    });

    remainingSaleTt -= consumedSaleTt;
    remainingSaleTtc -= consumedSaleTtc;

    await tx.lot.update({
      where: { id: lot.id },
      data: {
        quantity_remaining: { decrement: consumed },
        quantity_exported: { increment: consumed },
        price_remaining: String(Math.max(0, lot.priceRemaining - consumedPrice)),
        date_updated: now,
      },
    });

    remainingToSell -= consumed;
  }

  return { ok: true, lineTt, lineTtc };
};

const processNonStackableSellLine = async (input: {
  tx: Prisma.TransactionClient;
  stocksService: StocksService;
  userId: string;
  now: string;
  transactionId: string;
  line: SellLineInput;
  item: SellItemData;
}): Promise<
  { ok: true; lineTt: number; lineTtc: number } | { ok: false; rejection: TransactionRejectedItem }
> => {
  const { tx, stocksService, userId, now, transactionId, line, item } = input;

  if (!line.inventoryLotId) {
    return {
      ok: false,
      rejection: {
        itemId: line.itemId,
        requestedQuantity: line.quantity,
        availableQuantity: 0,
        reason: 'LOT_ID_REQUIRED',
      },
    };
  }

  const lot = await stocksService.getSellableLotById(userId, line.inventoryLotId);
  if (!lot || lot.itemId !== line.itemId) {
    return {
      ok: false,
      rejection: {
        itemId: line.itemId,
        requestedQuantity: line.quantity,
        availableQuantity: 0,
        reason: 'LOT_NOT_FOUND',
      },
    };
  }

  if (line.quantity > lot.quantityRemaining) {
    return {
      ok: false,
      rejection: {
        itemId: line.itemId,
        requestedQuantity: line.quantity,
        availableQuantity: lot.quantityRemaining,
        reason: 'INSUFFICIENT_STOCK',
      },
    };
  }

  const consumedPrice = item.unitPrice * line.quantity;
  const lineTt = line.tt ?? consumedPrice;
  const lineTtc = line.ttc;

  await tx.transactionLot.create({
    data: {
      transaction_id: transactionId,
      item_id: line.itemId,
      inventory_lot_id: lot.id,
      quantity: line.quantity,
      line_type: 'OUT',
      line_status: 'OPENNED',
      sale_status: 'RUNNING',
      tt: lineTt,
      ttc: lineTtc,
      user_id: userId,
    },
  });

  await tx.lot.update({
    where: { id: lot.id },
    data: {
      quantity_remaining: { decrement: line.quantity },
      quantity_exported: { increment: line.quantity },
      price_remaining: String(Math.max(0, lot.priceRemaining - consumedPrice)),
      date_updated: now,
    },
  });

  return { ok: true, lineTt, lineTtc };
};

const processSellLines = async ({
  tx,
  userId,
  transactionId,
  now,
  processable,
  itemById,
  initialRejected,
  stocksService,
}: {
  tx: Prisma.TransactionClient;
  userId: string;
  transactionId: string;
  now: string;
  processable: SellLineInput[];
  itemById: Map<string, SellItemData>;
  initialRejected: TransactionRejectedItem[];
  stocksService: StocksService;
}): Promise<SellProcessingResult> => {
  const processed: TransactionProcessedItem[] = [];
  const rejected: TransactionRejectedItem[] = [...initialRejected];
  let totalTt = 0;
  let totalTtc = 0;

  for (const line of processable) {
    const item = itemById.get(line.itemId);
    if (!item) {
      rejected.push({
        itemId: line.itemId,
        requestedQuantity: line.quantity,
        availableQuantity: 0,
        reason: 'ITEM_NOT_FOUND',
      });
      continue;
    }

    const shouldUseFifo = item.isStackable || !line.inventoryLotId;
    const processResult = shouldUseFifo
      ? await processStackableSellLine({
          tx,
          stocksService,
          userId,
          now,
          transactionId,
          line,
          item,
        })
      : await processNonStackableSellLine({
          tx,
          stocksService,
          userId,
          now,
          transactionId,
          line,
          item,
        });

    if (!processResult.ok) {
      rejected.push(processResult.rejection);
      continue;
    }

    totalTt += processResult.lineTt;
    totalTtc += processResult.lineTtc;
    processed.push({ itemId: line.itemId, quantity: line.quantity });
  }

  return { processed, rejected, totalTt, totalTtc };
};

export {
  buildRequestedByItem,
  splitProcessableSellLines,
  loadSellItemsById,
  computeInitialSellTotals,
  processSellLines,
};
