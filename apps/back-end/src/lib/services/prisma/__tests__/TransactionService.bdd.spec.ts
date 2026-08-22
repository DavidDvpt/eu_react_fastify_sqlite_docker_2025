/* eslint-disable @typescript-eslint/no-explicit-any */
import { afterEach, describe, expect, it, vi } from 'vitest';

import { LotService } from '../lotService.js';
import { PedcardService } from '../pedcardService.js';
import { TransactionService } from '../transactionService.js';

describe('TransactionService', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('reads one transaction by id and parses its lines', async () => {
    const prisma = {
      transaction: {
        findUnique: vi.fn().mockResolvedValue({
          id: 'transaction-1',
          tt: 10,
          fee: 2,
          ttc: 12,
          created_at: '2026-08-01T10:00:00.000Z',
          updated_at: null,
          user_id: 'user-1',
          status: 'RUNNING',
          transaction_type: 'SELL',
          lines: [
            {
              quantity: 2,
              lot_id: 'lot-1',
              lot: { item_id: 'item-1' },
            },
            {
              quantity: 3,
              lot_id: 'lot-2',
              lot: { item_id: 'item-1' },
            },
          ],
        }),
      },
    };
    const service = new TransactionService(prisma as any);

    const found = await service.getById({ userId: 'user-1', id: 'transaction-1' });

    expect(prisma.transaction.findUnique).toHaveBeenCalledWith({
      where: { id: 'transaction-1', user_id: 'user-1' },
      include: {
        lines: {
          select: {
            quantity: true,
            lot_id: true,
            lot: { select: { item_id: true } },
          },
        },
      },
    });
    expect(found).toEqual({
      id: 'transaction-1',
      tt: 10,
      fee: 2,
      ttc: 12,
      createdAt: '2026-08-01T10:00:00.000Z',
      updatedAt: null,
      quantity: 5,
      entries: [
        { quantity: 2, lotId: 'lot-1', lot: { itemId: 'item-1' } },
        { quantity: 3, lotId: 'lot-2', lot: { itemId: 'item-1' } },
      ],
      userId: 'user-1',
      status: 'RUNNING',
      transactionType: 'SELL',
    });
  });

  it('lists filtered transactions for one user', async () => {
    const prisma = {
      transaction: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: 'transaction-1',
            tt: 10,
            fee: 2,
            ttc: 12,
            created_at: '2026-08-01T10:00:00.000Z',
            updated_at: null,
            user_id: 'user-1',
            status: null,
            transaction_type: 'BUY',
            lines: [{ quantity: 1, lot_id: 'lot-1', lot: { item_id: 'item-1' } }],
          },
        ]),
      },
    };
    const service = new TransactionService(prisma as any);

    const all = await service.getAll({
      userId: 'user-1',
      status: 'SOLDED',
      transactionType: 'BUY',
      itemId: 'item-1',
    });

    expect(prisma.transaction.findMany).toHaveBeenCalledWith({
      where: {
        user_id: 'user-1',
        status: 'SOLDED',
        transaction_type: 'BUY',
        lines: {
          some: {
            lot: {
              item_id: 'item-1',
            },
          },
        },
      },
      include: {
        lines: {
          where: {
            lot: {
              item_id: 'item-1',
            },
          },
          select: {
            quantity: true,
            lot_id: true,
            lot: { select: { item_id: true } },
          },
        },
      },
    });
    expect(all[0]?.status).toBeNull();
  });

  it('lists running transactions and keeps itemId on entries', async () => {
    const prisma = {
      transaction: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: 'transaction-1',
            tt: 100,
            fee: 12,
            ttc: 112,
            created_at: '2026-08-01T10:00:00.000Z',
            updated_at: null,
            user_id: 'user-1',
            status: 'RUNNING',
            transaction_type: 'SELL',
            lines: [
              { quantity: 2, lot_id: 'lot-1', lot: { item_id: 'item-1' } },
              { quantity: 3, lot_id: 'lot-2', lot: { item_id: 'item-1' } },
            ],
          },
        ]),
      },
    };
    const service = new TransactionService(prisma as any);

    const found = await service.getAll({ userId: 'user-1', status: 'RUNNING' });

    expect(prisma.transaction.findMany).toHaveBeenCalledWith({
      where: { user_id: 'user-1', status: 'RUNNING', transaction_type: undefined, lines: undefined },
      include: {
        lines: {
          select: {
            quantity: true,
            lot_id: true,
            lot: {
              select: {
                item_id: true,
              },
            },
          },
        },
      },
    });
    expect(found).toEqual([
      {
        tt: 100,
        fee: 12,
        ttc: 112,
        itemId: null,
        lotId: null,
        quantityLot: null,
        status: 'RUNNING',
        transactionType: 'SELL',
      },
    ]);
  });

  it('creates a BUY transaction, pedcard entries and one lot', async () => {
    const tx = {
      transaction: {
        create: vi.fn().mockResolvedValue({ id: 'transaction-1' }),
      },
      transactionLot: {
        create: vi.fn().mockResolvedValue({ id: 'line-1' }),
      },
    };
    const prisma = {
      $transaction: vi.fn(async (callback: (trx: unknown) => unknown) => callback(tx)),
    };
    const canPaySpy = vi.spyOn(PedcardService.prototype, 'canPay').mockResolvedValueOnce(false as never);
    const createManySpy = vi
      .spyOn(PedcardService.prototype, 'createMany')
      .mockResolvedValueOnce([{ id: 'pedcard-1' }, { id: 'pedcard-2' }] as never);
    const createLotSpy = vi.spyOn(LotService.prototype, 'create').mockResolvedValueOnce({ id: 'lot-1' });
    const service = new TransactionService(prisma as any);

    const created = await service.buy({
      userId: 'user-1',
      body: {
        itemId: 'item-1',
        quantity: 2,
        tt: 20,
        ttc: 25,
        fee: 1,
        transactionType: 'BUY',
        status: 'SOLDED',
      },
    });

    expect(created).toEqual({ id: 'transaction-1' });
    expect(canPaySpy).toHaveBeenCalledWith({ userId: 'user-1', value: 26 });
    expect(tx.transaction.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        transaction_type: 'BUY',
        status: null,
        user_id: 'user-1',
        tt: 20,
        ttc: 25,
        fee: 1,
      }),
      select: { id: true },
    });
    expect(createManySpy).toHaveBeenCalledWith({
      userId: 'user-1',
      transactionId: 'transaction-1',
      bodys: [
        { type: 'BUY_FEE', value: -1 },
        { type: 'BUY_TTC', value: -25 },
      ],
    });
    expect(createLotSpy).toHaveBeenCalledWith({
      userId: 'user-1',
      body: expect.objectContaining({
        itemId: 'item-1',
        quantityRemaining: 2,
        quantityExported: 0,
        priceRemaining: 0,
        lotType: 'TRADE',
        isActive: true,
      }),
    });
    expect(tx.transactionLot.create).toHaveBeenCalledWith({
      data: {
        transaction_id: 'transaction-1',
        lot_id: 'lot-1',
        quantity: 2,
      },
    });
  });

  it('creates a SELL transaction, fee entry and transaction lines', async () => {
    const tx = {
      transaction: {
        create: vi.fn().mockResolvedValue({ id: 'transaction-2' }),
      },
      transactionLot: {
        create: vi.fn().mockResolvedValue({ id: 'line-1' }),
      },
    };
    const prisma = {
      $transaction: vi.fn(async (callback: (trx: unknown) => unknown) => callback(tx)),
    };
    const canPaySpy = vi.spyOn(PedcardService.prototype, 'canPay').mockResolvedValueOnce(false as never);
    const createSpy = vi.spyOn(PedcardService.prototype, 'create').mockResolvedValueOnce({ id: 'pedcard-1' });
    const consumeSpy = vi.spyOn(LotService.prototype, 'consumeQuantityOnLots').mockResolvedValueOnce([
      { lotId: 'lot-1', quantity: 2 },
      { lotId: 'lot-2', quantity: 1 },
    ]);
    const service = new TransactionService(prisma as any);

    const created = await service.sell({
      userId: 'user-1',
      body: {
        itemId: 'item-1',
        quantity: 3,
        tt: 30,
        ttc: 36,
        fee: 6,
        transactionType: 'SELL',
        status: 'RUNNING',
      },
    });

    expect(created).toEqual({ id: 'transaction-2' });
    expect(canPaySpy).toHaveBeenCalledWith({ userId: 'user-1', value: 6 });
    expect(tx.transaction.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        transaction_type: 'SELL',
        status: 'RUNNING',
        user_id: 'user-1',
        tt: 30,
        ttc: 36,
        fee: 6,
      }),
      select: { id: true },
    });
    expect(createSpy).toHaveBeenCalledWith({
      userId: 'user-1',
      transactionId: 'transaction-2',
      body: { type: 'SELL_FEE', value: -6 },
    });
    expect(consumeSpy).toHaveBeenCalledWith({ userId: 'user-1', quantity: 3, itemId: 'item-1' });
    expect(tx.transactionLot.create).toHaveBeenCalledTimes(2);
  });

  it('updates a RUNNING transaction to SOLDED and creates the sell ttc entry', async () => {
    const tx = {
      transaction: {
        update: vi.fn().mockResolvedValue({ id: 'transaction-1', ttc: 112 }),
      },
    };
    const prisma = {
      transaction: {
        findUnique: vi.fn().mockResolvedValue({
          id: 'transaction-1',
          tt: 100,
          fee: 12,
          ttc: 112,
          created_at: '2026-08-01T10:00:00.000Z',
          updated_at: null,
          user_id: 'user-1',
          status: 'RUNNING',
          transaction_type: 'SELL',
          lines: [{ quantity: 1, lot_id: 'lot-1', lot: { item_id: 'item-1' } }],
        }),
        update: vi.fn().mockResolvedValue({ id: 'transaction-1', ttc: 112 }),
      },
      $transaction: vi.fn(async (callback: (trx: typeof tx) => unknown) => callback(tx)),
    };
    const createSpy = vi.spyOn(PedcardService.prototype, 'create').mockResolvedValueOnce({ id: 'pedcard-1' });
    const service = new TransactionService(prisma as any);

    await service.updateStatus({
      userId: 'user-1',
      id: 'transaction-1',
      status: 'SOLDED',
    });

    expect(prisma.transaction.update).toHaveBeenCalledWith({
      where: { user_id: 'user-1', id: 'transaction-1' },
      data: { status: 'SOLDED' },
    });
    expect(createSpy).toHaveBeenCalledWith({
      userId: 'user-1',
      transactionId: 'transaction-1',
      body: { type: 'SELL_TTC', value: 112 },
    });
  });

  it('updates a RUNNING transaction to RETURNED and restores lot quantities', async () => {
    const tx = {
      transaction: {
        update: vi.fn().mockResolvedValue({ id: 'transaction-1' }),
      },
      transactionLot: {
        findMany: vi.fn().mockResolvedValue([
          { lot_id: 'lot-1', quantity: 2 },
          { lot_id: 'lot-2', quantity: 1 },
        ]),
      },
    };
    const prisma = {
      transaction: {
        findUnique: vi.fn().mockResolvedValue({
          id: 'transaction-1',
          tt: 100,
          fee: 12,
          ttc: 112,
          created_at: '2026-08-01T10:00:00.000Z',
          updated_at: null,
          user_id: 'user-1',
          status: 'RUNNING',
          transaction_type: 'SELL',
          lines: [{ quantity: 3, lot_id: 'lot-1', lot: { item_id: 'item-1' } }],
        }),
      },
      $transaction: vi.fn(async (callback: (trx: typeof tx) => unknown) => callback(tx)),
    };
    const incrementSpy = vi.spyOn(LotService.prototype, 'remainingIncrement').mockResolvedValue({ id: 'lot-1' });
    const service = new TransactionService(prisma as any);

    await service.updateStatus({
      userId: 'user-1',
      id: 'transaction-1',
      status: 'RETURNED',
    });

    expect(tx.transaction.update).toHaveBeenCalledWith({
      where: { user_id: 'user-1', id: 'transaction-1' },
      data: { status: 'RETURNED' },
    });
    expect(tx.transactionLot.findMany).toHaveBeenCalledWith({
      where: { transaction_id: 'transaction-1' },
    });
    expect(incrementSpy).toHaveBeenCalledTimes(2);
  });

  it('rejects a status update when the transaction is not RUNNING', async () => {
    const prisma = {
      transaction: {
        findUnique: vi.fn().mockResolvedValue({
          id: 'transaction-1',
          tt: 100,
          fee: 12,
          ttc: 112,
          created_at: '2026-08-01T10:00:00.000Z',
          updated_at: null,
          user_id: 'user-1',
          status: 'SOLDED',
          transaction_type: 'SELL',
          lines: [{ quantity: 1, lot_id: 'lot-1', lot: { item_id: 'item-1' } }],
        }),
      },
      $transaction: vi.fn(),
    };
    const service = new TransactionService(prisma as any);

    await expect(
      service.updateStatus({
        userId: 'user-1',
        id: 'transaction-1',
        status: 'SOLDED',
      })
    ).rejects.toThrow("A non running transaction can't be updated");
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('cancels a transaction, restores lots and deletes related pedcard entries', async () => {
    const tx = {
      transaction: {
        update: vi.fn().mockResolvedValue({ id: 'transaction-1' }),
      },
      transactionLot: {
        findMany: vi.fn().mockResolvedValue([
          { lot_id: 'lot-1', quantity: 2 },
          { lot_id: 'lot-2', quantity: 1 },
        ]),
      },
    };
    const prisma = {
      $transaction: vi.fn(async (callback: (trx: typeof tx) => unknown) => callback(tx)),
    };
    const incrementSpy = vi.spyOn(LotService.prototype, 'remainingIncrement').mockResolvedValue({ id: 'lot-1' });
    const deleteSpy = vi
      .spyOn(PedcardService.prototype, 'deleteByTransactionId')
      .mockResolvedValueOnce({ count: 2 } as never);
    const service = new TransactionService(prisma as any);

    await service.cancel({
      userId: 'user-1',
      id: 'transaction-1',
      status: 'CANCELED',
    });

    expect(tx.transaction.update).toHaveBeenCalledWith({
      where: { user_id: 'user-1', id: 'transaction-1' },
      data: { status: 'CANCELED' },
    });
    expect(tx.transactionLot.findMany).toHaveBeenCalledWith({
      where: { transaction_id: 'transaction-1' },
    });
    expect(incrementSpy).toHaveBeenCalledTimes(2);
    expect(deleteSpy).toHaveBeenCalledWith({
      userId: 'user-1',
      transactionId: 'transaction-1',
    });
  });
});
