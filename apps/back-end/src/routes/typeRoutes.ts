import { typeFormSchema, typeQuerySchema } from '@eu/zod-schemas';

import { getReadableUserIds } from './utils.js';

import type { TypeFormOutputBody } from '@eu/types';
import type { FastifyPluginCallback } from 'fastify';

import prismaClient from '#prisma/prismaClient.js';
import { TypeService } from '#src/lib/services/prisma/typeService.js';

const typeRoutes: FastifyPluginCallback = (app, _opts, done) => {
  const ts = new TypeService(prismaClient);

  app.get('/', async (request, reply) => {
    const { sortKey, sortOrder, categoryId, isActive } = typeQuerySchema.parse(request.query);

    const rows = await ts.getAll({
      userIds: getReadableUserIds(request),
      isActive: isActive,
      categoryId: categoryId,
      sort: { key: sortKey ?? 'name', order: sortOrder },
    });

    return reply.code(200).send(rows);
  });
  app.get('/:id', async (request, reply) => {
    const params = request.params as { id: string };
    const row = await ts.getById({
      id: params.id,
      userIds: getReadableUserIds(request),
    });

    if (!row) return reply.code(404).send({ message: 'Type not found' });
    if (!row.isActive) return reply.code(403).send({ message: 'Type is not active' });

    return reply.code(200).send(row);
  });

  app.post('/', async (request, reply) => {
    const body: TypeFormOutputBody = typeFormSchema.parse(request.body);
    const created = await ts.create({ userId: request.user.id, body });
    return reply.code(201).send({ id: created.id });
  });

  app.patch('/:id', async (request, reply) => {
    try {
      const params = request.params as { id: string };
      const body: Partial<TypeFormOutputBody> = typeFormSchema.partial().parse(request.body);
      const updated = await ts.update({ id: params.id, body, userId: request.user.id });
      return reply.code(200).send(updated);
    } catch (error) {
      if (error instanceof Error && error.message.includes('Forbidden mutation')) {
        return reply.code(403).send({ message: 'Forbidden' });
      }
      throw error;
    }
  });

  done();
};

export default typeRoutes;
