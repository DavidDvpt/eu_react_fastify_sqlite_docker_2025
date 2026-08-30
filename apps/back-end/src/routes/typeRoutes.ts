import { typeFormSchema, typeQuerySchema } from '@eu/zod-schemas';

import { getIdParam, getSystemReadableUserIds, getSystemUserId } from './utils.js';

import type { TypeFormBody } from '@eu/types';
import type { FastifyPluginCallback } from 'fastify';

import prismaClient from '#prisma/prismaClient.js';
import { ItemService } from '#src/lib/services/index.js';
import { TypeService } from '#src/lib/services/prisma/typeService.js';

const typeRoutes: FastifyPluginCallback = (app, _opts, done) => {
  const ts = new TypeService(prismaClient);

  app.protect();

  app.get('/', async (request, reply) => {
    const { sortKey, sortOrder, categoryId, isActive } = typeQuerySchema.parse(request.query);
    const effectiveIsActive = request.user.role === 'ADMIN' ? isActive : true;

    const rows = await ts.getAll({
      isActive: effectiveIsActive,
      categoryId: categoryId,
      sort: { key: sortKey ?? 'name', order: sortOrder },
    });

    return reply.code(200).send(rows);
  });
  app.get('/:id', async (request, reply) => {
    const { id } = getIdParam(request);

    const row = await ts.getById({
      id,
      userIds: getSystemReadableUserIds(),
    });

    if (!row) return reply.code(404).send({ message: 'Type not found' });
    if (!row.isActive) return reply.code(403).send({ message: 'Type is not active' });

    return reply.code(200).send(row);
  });
  app.get('/:id/items', async (request, reply) => {
    const { id } = getIdParam(request);

    const is = new ItemService(prismaClient);
    const rows = await is.getAll({
      typeId: id,
      isActive: true,
    });

    return reply.code(200).send(rows);
  });

  app.register((adminApp, _adminOpts, adminDone) => {
    adminApp.adminProtect();

    adminApp.post('/', async (request, reply) => {
      const body: TypeFormBody = typeFormSchema.parse(request.body);
      const created = await ts.create({ userId: getSystemUserId(), body });
      return reply.code(201).send({ id: created.id });
    });

    adminApp.patch('/:id', async (request, reply) => {
      try {
        const { id } = getIdParam(request);

        const body: Partial<TypeFormBody> = typeFormSchema.partial().parse(request.body);
        const updated = await ts.update({ id, body, userId: getSystemUserId() });
        return reply.code(200).send(updated);
      } catch (error) {
        if (error instanceof Error && error.message.includes('Forbidden mutation')) {
          return reply.code(403).send({ message: 'Forbidden' });
        }
        throw error;
      }
    });

    adminDone();
  });

  done();
};

export default typeRoutes;
