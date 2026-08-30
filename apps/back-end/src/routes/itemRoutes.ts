import {
  itemFormSchema,
  itemQuerySchema,
  lotQuerySchema,
  transactionQuerySchema,
} from '@eu/zod-schemas';

import {
  getIdParam,
  getRequestUserId,
  getSystemReadableUserIds,
  getSystemUserId,
} from './utils.js';

import type { FastifyPluginCallback } from 'fastify';

import prismaClient from '#prisma/prismaClient.js';
import { toItemFinancialReport } from '#src/lib/helpers/transactionFinancialReportHelper.js';
import { TransactionService, getItemService } from '#src/lib/services/index.js';

const itemRoutes: FastifyPluginCallback = (app, _opts, done) => {
  app.protect();

  app.get('/', async (request, reply) => {
    const { sortKey, sortOrder, typeId, isActive, details } = itemQuerySchema.parse(request.query);
    const is = getItemService(details);
    const effectiveIsActive = request.user.role === 'ADMIN' ? isActive : true;

    const rows = await is.getAll({
      isActive: effectiveIsActive,
      typeId,
      sort: { key: sortKey ?? 'name', order: sortOrder },
      details,
    });

    return reply.code(200).send(rows);
  });

  app.get('/:id/stock', async (request, reply) => {
    const is = getItemService();
    const userId = getRequestUserId(request);
    const { id } = getIdParam(request);

    const stock = await is.getStock({ userId, itemId: id });

    return reply.code(200).send(stock);
  });
  app.get('/:id/lots', async (request, reply) => {
    const is = getItemService();
    const userId = getRequestUserId(request);
    const { id } = getIdParam(request);
    const { sortKey, sortOrder, isActive, hasInitialValue } = lotQuerySchema
      .partial()
      .parse(request.query);

    const lots = await is.getLots({
      userId,
      itemId: id,
      isActive,
      sort: sortKey && { key: sortKey, order: sortOrder },
      hasInitialValue,
    });

    if (!lots) return reply.code(404).send({ message: 'Item not found' });

    return reply.code(200).send(lots);
  });
  app.get('/:id/transactions', async (request, reply) => {
    const userId = getRequestUserId(request);
    const { id } = getIdParam(request);
    const ts = new TransactionService(prismaClient);
    const { status, type, withItemId, withLotId } = transactionQuerySchema
      .partial()
      .parse(request.query);

    const rows = await ts.getAll({
      userId,
      itemId: id,
      status,
      transactionType: type,
      withItemId,
      withLotId,
    });

    return reply.code(200).send(rows);
  });
  app.get('/:id/financial-report', async (request, reply) => {
    const userId = getRequestUserId(request);
    const { id } = getIdParam(request);
    const { withLotId } = transactionQuerySchema.partial().parse(request.query);

    const ts = new TransactionService(prismaClient);

    const rows = await ts.getAll({ userId, itemId: id, withItemId: true, withLotId });

    const parsed = toItemFinancialReport(rows);

    return reply.code(200).send({ [id]: parsed });
  });

  app.get('/:id', async (request, reply) => {
    const is = getItemService();
    const { id } = getIdParam(request);

    const row = await is.getById({
      id,
      userIds: getSystemReadableUserIds(),
    });

    return reply.code(200).send(row);
  });

  app.register((adminApp, _adminOpts, adminDone) => {
    adminApp.adminProtect();

    adminApp.post('/', async (request, reply) => {
      const is = getItemService();
      const body = itemFormSchema.parse(request.body);
      const created = await is.create({ userId: getSystemUserId(), body });

      return reply.code(201).send(created);
    });
    adminApp.put('/:id', async (request, reply) => {
      const is = getItemService();
      const { id } = getIdParam(request);
      const body = itemFormSchema.parse(request.body);

      const updated = await is.update({ id, userId: getSystemUserId(), body });

      return reply.code(200).send(updated);
    });

    adminDone();
  });

  done();
};

export default itemRoutes;
