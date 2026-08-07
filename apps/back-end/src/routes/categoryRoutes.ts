import { cp } from 'node:fs';

import { categoryFormSchema, categoryQuerySchema } from '@eu/zod-schemas';

import { getIdParam, getReadableUserIds, getRequestUserId } from './utils.js';

import type { FastifyPluginCallback } from 'fastify';

import prismaClient from '#prisma/prismaClient.js';
import { CategoryService, TypeService } from '#src/lib/services/index.js';

export const categoryRoutes: FastifyPluginCallback = (app, _opts, done) => {
  const cs = new CategoryService(prismaClient);

  app.protect();

  app.get('/', async (request, reply) => {
    const { sortKey, sortOrder, isActive } = categoryQuerySchema.parse(request.query);
    const rows = await cs.getAll({
      userIds: getReadableUserIds(request),
      isActive,
      sort: { key: sortKey ?? 'name', order: sortOrder },
    });

    return reply.code(200).send(rows);
  });
  app.get('/:id', async (request, reply) => {
    const { id } = getIdParam(request);

    const row = await cs.getById({
      id,
      userIds: getReadableUserIds(request),
    });

    if (!row) return reply.code(404).send({ message: 'Category not found' });

    if (!row.isActive) return reply.code(403).send({ message: 'Category is not active' });

    return reply.code(200).send(row);
  });

  app.post('/', async (request, reply) => {
    const userId = getRequestUserId(request);

    const body = categoryFormSchema.parse(request.body);
    const created = await cs.create({ userId, body });

    return reply.code(201).send({ id: created.id });
  });
  app.get('/:id/types', async (request, reply) => {
    const { id } = getIdParam(request);
    const ts = new TypeService(prismaClient);

    const rows = await ts.getAll({
      userIds: getReadableUserIds(request),
      categoryId: id,
      isActive: true,
    });

    return reply.code(200).send(rows);
  });
  app.patch('/:id', async (request, reply) => {
    try {
      const { id } = getIdParam(request);
      const userId = getRequestUserId(request);

      const body = categoryFormSchema.partial().parse(request.body);
      const updated = await cs.update({ id, userId, body });

      return reply.code(200).send({ id: updated.id });
    } catch (error) {
      if (error instanceof Error && error.message.includes('Forbidden mutation')) {
        return reply.code(403).send({ message: 'Forbidden' });
      }
      throw error;
    }
  });

  done();
};
