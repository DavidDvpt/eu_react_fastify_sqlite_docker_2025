import { categoryFormSchema, categoryQuerySchema } from '@eu/zod-schemas';

import { getReadableUserIds } from './utils.js';

import type { FastifyPluginCallback } from 'fastify';

import prismaClient from '#prisma/prismaClient.js';
import { CategoryService } from '#src/lib/services/index.js';

export const categoryRoutes: FastifyPluginCallback = (app, _opts, done) => {
  const cs = new CategoryService(prismaClient);

  app.get('/', async (request, reply) => {
    const query = categoryQuerySchema.parse(request.query);
    const rows = await cs.getAll({
      userIds: getReadableUserIds(request),
      isActive: query.isActive,
      sort: { key: 'name' },
    });

    return reply.code(200).send(rows);
  });
  app.get('/:id', async (request, reply) => {
    const params = request.params as { id: string };
    const row = await cs.getById({
      id: params.id,
      userIds: getReadableUserIds(request),
    });

    if (!row) return reply.code(404).send({ message: 'Category not found' });
    if (!row.isActive) return reply.code(403).send({ message: 'Category is not active' });

    return reply.code(200).send(row);
  });

  app.post('/', async (request, reply) => {
    const body = categoryFormSchema.parse(request.body);
    const created = await cs.create({ userId: request.user.id, body });

    return reply.code(201).send({ id: created.id });
  });

  app.patch('/:id', async (request, reply) => {
    try {
      const params = request.params as { id: string };
      const body = categoryFormSchema.partial().parse(request.body);
      const updated = await cs.update({ id: params.id, userId: request.user.id, body });

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
