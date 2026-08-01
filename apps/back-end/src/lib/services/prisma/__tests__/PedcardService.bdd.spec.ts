/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { describe, expect, it, vi } from 'vitest';

import { PedcardService } from '../pedcardService.js';

describe('PedcardService', () => {
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
});
