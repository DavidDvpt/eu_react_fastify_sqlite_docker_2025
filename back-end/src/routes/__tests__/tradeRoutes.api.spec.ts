import Fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { describe, expect, it, vi } from 'vitest';

import { API_PREFIX } from '../../config/routes.js';
import tradeRoutes from '../tradeRoutes.js';

import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

describe('tradeRoutes', () => {
  function buildApp() {
    const app = Fastify({ logger: false }).withTypeProvider<ZodTypeProvider>();
    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);

    const tx = {
      item: {
        findMany: vi.fn(),
      },
      session: {
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
      lot: {
        create: vi.fn(),
        update: vi.fn(),
      },
      sessionLine: {
        create: vi.fn(),
      },
    };

    const prisma = {
      item: {
        findMany: vi.fn(),
      },
      $transaction: vi.fn((callback: (trx: typeof tx) => unknown) => Promise.resolve(callback(tx))),
    };

    const lotStock = {
      getStock: vi.fn(),
      getStockByItemId: vi.fn(),
      getStockDetailsByItemId: vi.fn(),
      getAvailableStockByItemIds: vi.fn(),
      getAvailableLotsFifoByItemId: vi.fn(),
      getSellableLotById: vi.fn(),
    };

    app.decorate('prisma', prisma as unknown as FastifyInstance['prisma']);
    app.decorate('repos', { lotStock } as unknown as FastifyInstance['repos']);
    app.decorate('protect', function (this: FastifyInstance) {
      // eslint-disable-next-line @typescript-eslint/require-await
      this.addHook('preHandler', async (request) => {
        request.user = { id: 'user-1', role: 'USER', pseudo: 'john' };
      });
    });

    app.register(tradeRoutes, { prefix: API_PREFIX });

    return { app, tx, prisma, lotStock };
  }

  it('POST /api/v1/trade/purchase creates session, line and lot', async () => {
    const { app, tx, prisma } = buildApp();

    vi.mocked(prisma.item.findMany).mockResolvedValueOnce([{ id: 'item-1', value: 10 } as never]);
    vi.mocked(tx.session.create).mockResolvedValueOnce({ id: 'session-1' } as never);
    vi.mocked(tx.lot.create).mockResolvedValueOnce({ id: 'lot-1' } as never);
    vi.mocked(tx.sessionLine.create).mockResolvedValueOnce({ id: 'line-1' } as never);
    vi.mocked(tx.session.update).mockResolvedValueOnce({ id: 'session-1' } as never);

    await app.ready();
    const res = await app.inject({
      method: 'POST',
      url: `${API_PREFIX}/trade/purchase`,
      payload: {
        lines: [{ itemId: 'item-1', quantity: 2, ttc: 25 }],
      },
    });

    expect(res.statusCode).toBe(201);
    expect(tx.session.create).toHaveBeenCalledTimes(1);
    const purchaseLineCreateCall = vi.mocked(tx.sessionLine.create).mock.calls[0]?.[0] as {
      data: {
        item_id: string;
        quantity: number;
        line_type: string;
        sale_status: string | null;
      };
    };
    expect(purchaseLineCreateCall.data.item_id).toBe('item-1');
    expect(purchaseLineCreateCall.data.quantity).toBe(2);
    expect(purchaseLineCreateCall.data.line_type).toBe('IN');
    expect(purchaseLineCreateCall.data.sale_status).toBeNull();
    await app.close();
  });

  it('POST /api/v1/trade/sell processes valid lines and rejects insufficient stock', async () => {
    const { app, tx, lotStock } = buildApp();

    vi.mocked(lotStock.getAvailableStockByItemIds).mockResolvedValueOnce([
      { itemId: 'item-1', availableQuantity: 3 },
      { itemId: 'item-2', availableQuantity: 1 },
    ]);
    vi.mocked(tx.item.findMany).mockResolvedValueOnce([
      { id: 'item-1', value: 10, is_stackable: true } as never,
    ]);
    vi.mocked(tx.session.create).mockResolvedValueOnce({ id: 'session-2' } as never);
    vi.mocked(lotStock.getAvailableLotsFifoByItemId).mockResolvedValueOnce([
      {
        id: 'lot-1',
        itemId: 'item-1',
        quantityRemaining: 2,
        quantityExported: 0,
        priceRemaining: 20,
        dateCreated: '2026-01-01T00:00:00.000Z',
      },
      {
        id: 'lot-2',
        itemId: 'item-1',
        quantityRemaining: 2,
        quantityExported: 0,
        priceRemaining: 20,
        dateCreated: '2026-01-02T00:00:00.000Z',
      },
    ]);
    vi.mocked(tx.sessionLine.create).mockResolvedValue({ id: 'line' } as never);
    vi.mocked(tx.lot.update).mockResolvedValue({ id: 'lot' } as never);
    vi.mocked(tx.session.update).mockResolvedValue({ id: 'session-2' } as never);

    await app.ready();
    const res = await app.inject({
      method: 'POST',
      url: `${API_PREFIX}/trade/sell`,
      payload: {
        lines: [
          { itemId: 'item-1', quantity: 3, tt: 999, ttc: 36 },
          { itemId: 'item-2', quantity: 2, ttc: 40 },
        ],
      },
    });

    expect(res.statusCode).toBe(207);
    expect(lotStock.getAvailableStockByItemIds).toHaveBeenCalledWith('user-1', [
      'item-1',
      'item-2',
    ]);
    const firstSellLineCreateCall = vi.mocked(tx.sessionLine.create).mock.calls[0]?.[0] as {
      data: {
        item_id: string;
        quantity: number;
        tt: number;
        ttc: number;
      };
    };
    expect(firstSellLineCreateCall.data.item_id).toBe('item-1');
    expect(firstSellLineCreateCall.data.quantity).toBe(2);
    expect(firstSellLineCreateCall.data.tt).toBe(20);
    expect(firstSellLineCreateCall.data.ttc).toBe(24);

    const secondSellLineCreateCall = vi.mocked(tx.sessionLine.create).mock.calls[1]?.[0] as {
      data: {
        item_id: string;
        quantity: number;
        tt: number;
        ttc: number;
      };
    };
    expect(secondSellLineCreateCall.data.item_id).toBe('item-1');
    expect(secondSellLineCreateCall.data.quantity).toBe(1);
    expect(secondSellLineCreateCall.data.tt).toBe(10);
    expect(secondSellLineCreateCall.data.ttc).toBe(12);
    expect(tx.session.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'session-2' },
        data: { win_tt: 30, win_ttc: 36 },
      })
    );
    expect(res.json()).toEqual(
      expect.objectContaining({
        sessionId: 'session-2',
        processed: [{ itemId: 'item-1', quantity: 3 }],
        rejected: [
          {
            itemId: 'item-2',
            requestedQuantity: 2,
            availableQuantity: 1,
            reason: 'INSUFFICIENT_STOCK',
          },
        ],
      })
    );
    await app.close();
  });
});
