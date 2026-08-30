import { categoryFormSchema, categoryQuerySchema } from '@eu/zod-schemas';

import { getIdParam, getSystemReadableUserIds, getSystemUserId } from './utils.js';

import type { FastifyPluginCallback } from 'fastify';

import prismaClient from '#prisma/prismaClient.js';
import { CategoryService, TypeService } from '#src/lib/services/index.js';

export const categoryRoutes: FastifyPluginCallback = (app, _opts, done) => {
  const cs = new CategoryService(prismaClient);

  app.protect();

  app.get('/', async (request, reply) => {
    const { sortKey, sortOrder, isActive } = categoryQuerySchema.parse(request.query);
    const effectiveIsActive = request.user.role === 'ADMIN' ? isActive : true;
    const rows = await cs.getAll({
      isActive: effectiveIsActive,
      sort: { key: sortKey ?? 'name', order: sortOrder },
    });

    return reply.code(200).send(rows);
  });
  app.get('/:id', async (request, reply) => {
    const { id } = getIdParam(request);

    const row = await cs.getById({
      id,
      userIds: getSystemReadableUserIds(),
    });

    if (!row) return reply.code(404).send({ message: 'Category not found' });

    if (!row.isActive) return reply.code(403).send({ message: 'Category is not active' });

    return reply.code(200).send(row);
  });

  app.get('/:id/types', async (request, reply) => {
    const { id } = getIdParam(request);
    const ts = new TypeService(prismaClient);

    const rows = await ts.getAll({
      categoryId: id,
      isActive: true,
    });

    return reply.code(200).send(rows);
  });

  app.register((adminApp, _adminOpts, adminDone) => {
    adminApp.adminProtect();

    adminApp.post('/', async (request, reply) => {
      const body = categoryFormSchema.parse(request.body);
      const created = await cs.create({ userId: getSystemUserId(), body });

      return reply.code(201).send({ id: created.id });
    });
    adminApp.patch('/:id', async (request, reply) => {
      try {
        const { id } = getIdParam(request);
        const body = categoryFormSchema.partial().parse(request.body);
        const updated = await cs.update({ id, userId: getSystemUserId(), body });

        return reply.code(200).send({ id: updated.id });
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
