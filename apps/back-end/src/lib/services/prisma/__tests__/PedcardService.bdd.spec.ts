/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { describe, expect, it, vi } from 'vitest';

import { PedcardService } from '../pedcardService.js';

describe('PedcardService', () => {
  it('lists parsed pedcard entries for a user', async () => {
    const prisma = {
      pedCard: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: 'pedcard-1',
            created_at: '2026-08-01T10:00:00.000Z',
            type: 'INITIAL_BALANCE',
            transaction_id: null,
            user_id: 'user-1',
            value: 100,
          },
        ]),
      },
    };
    const service = new PedcardService(prisma as any);

    const all = await service.getAll({ userId: 'user-1' });

    expect(prisma.pedCard.findMany).toHaveBeenCalledWith({
      where: {
        user_id: 'user-1',
      },
    });
    expect(all).toEqual([
      {
        id: 'pedcard-1',
        createdat: '2026-08-01T10:00:00.000Z',
        type: 'INITIAL_BALANCE',
        transactionId: null,
        userId: 'user-1',
        value: 100,
      },
    ]);
  });

  it('detects an initial balance entry for a user', async () => {
    const prisma = {
      pedCard: {
        findFirst: vi.fn().mockResolvedValue({ id: 'pedcard-1' }),
      },
    };
    const service = new PedcardService(prisma as any);

    const hasInitialBalance = await service.hasInitialBalance({ userId: 'user-1' });

    expect(prisma.pedCard.findFirst).toHaveBeenCalledWith({
      where: {
        user_id: 'user-1',
        type: 'INITIAL_BALANCE',
      },
      select: {
        id: true,
      },
    });
    expect(hasInitialBalance).toBe(true);
  });

  it('sums every pedCard value for a user', async () => {
    const prisma = {
      pedCard: {
        aggregate: vi.fn().mockResolvedValue({
          _sum: {
            value: { toString: () => '115.5' },
          },
        }),
      },
    };
    const service = new PedcardService(prisma as any);

    const balance = await service.getBalance({ userId: 'user-1' });

    expect(prisma.pedCard.aggregate).toHaveBeenCalledWith({
      where: {
        user_id: 'user-1',
      },
      _sum: {
        value: true,
      },
    });
    expect(balance).toBe(115.5);
  });

  it('returns zero balance when the aggregate sum is null', async () => {
    const prisma = {
      pedCard: {
        aggregate: vi.fn().mockResolvedValue({
          _sum: {
            value: null,
          },
        }),
      },
    };
    const service = new PedcardService(prisma as any);

    const balance = await service.getBalance({ userId: 'user-1' });

    expect(balance).toBe(0);
  });

  it('canPay returns false when the amount is positive with the current guard clause', async () => {
    const prisma = {
      pedCard: {
        aggregate: vi.fn(),
      },
    };
    const service = new PedcardService(prisma as any);

    const canPay = await service.canPay({ userId: 'user-1', value: 25 });

    expect(canPay).toBe(false);
    expect(prisma.pedCard.aggregate).not.toHaveBeenCalled();
  });

  it('creates one pedcard entry', async () => {
    const prisma = {
      pedCard: {
        create: vi.fn().mockResolvedValue({ id: 'pedcard-1' }),
      },
    };
    const service = new PedcardService(prisma as any);

    const created = await service.create({
      userId: 'user-1',
      transactionId: 'transaction-1',
      body: { type: 'BUY_TTC', value: -25 },
    });

    expect(created).toEqual({ id: 'pedcard-1' });
    expect(prisma.pedCard.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        user_id: 'user-1',
        transaction_id: 'transaction-1',
        type: 'BUY_TTC',
        value: -25,
      }),
    });
  });

  it('creates many pedcard entries for one transaction', async () => {
    const prisma = {
      pedCard: {
        create: vi
          .fn()
          .mockResolvedValueOnce({ id: 'pedcard-1' })
          .mockResolvedValueOnce({ id: 'pedcard-2' }),
      },
    };
    const service = new PedcardService(prisma as any);

    const created = await service.createMany({
      userId: 'user-1',
      transactionId: 'transaction-1',
      bodys: [
        { type: 'BUY_FEE', value: -1 },
        { type: 'BUY_TTC', value: -25 },
      ],
    });

    expect(created).toEqual([{ id: 'pedcard-1' }, { id: 'pedcard-2' }]);
    expect(prisma.pedCard.create).toHaveBeenCalledTimes(2);
  });

  it('updates one pedcard entry', async () => {
    const prisma = {
      pedCard: {
        update: vi.fn().mockResolvedValue({ id: 'pedcard-1' }),
      },
    };
    const service = new PedcardService(prisma as any);

    const updated = await service.update({
      userId: 'user-1',
      id: 'pedcard-1',
      body: { value: 150 },
    });

    expect(updated).toEqual({ id: 'pedcard-1' });
    expect(prisma.pedCard.update).toHaveBeenCalledWith({
      where: { user_id: 'user-1', id: 'pedcard-1' },
      data: expect.objectContaining({
        value: 150,
      }),
    });
  });

  it('deletes one pedcard entry', async () => {
    const prisma = {
      pedCard: {
        delete: vi.fn().mockResolvedValue({ id: 'pedcard-1' }),
      },
    };
    const service = new PedcardService(prisma as any);

    const deleted = await service.delete({ userId: 'user-1', id: 'pedcard-1' });

    expect(deleted).toEqual({ id: 'pedcard-1' });
    expect(prisma.pedCard.delete).toHaveBeenCalledWith({
      where: { user_id: 'user-1', id: 'pedcard-1' },
    });
  });

  it('deletes every pedcard entry linked to one transaction', async () => {
    const prisma = {
      pedCard: {
        deleteMany: vi.fn().mockResolvedValue({ count: 2 }),
      },
    };
    const service = new PedcardService(prisma as any);

    const deleted = await service.deleteByTransactionId({
      userId: 'user-1',
      transactionId: 'transaction-1',
    });

    expect(deleted).toEqual({ count: 2 });
    expect(prisma.pedCard.deleteMany).toHaveBeenCalledWith({
      where: { user_id: 'user-1', transaction_id: 'transaction-1' },
    });
  });
});
