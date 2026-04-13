import {
  categoryCreateSchema,
  categoryUpdateSchema,
  includeQuerySchema,
  itemCreateSchema,
  itemUpdateSchema,
  typeCreateSchema,
  typeUpdateSchema,
} from './manageRoutes.schema.js';

import type { FastifyPluginCallback } from 'fastify';

function shouldIncludeParent(query: unknown): boolean {
  const parsed = includeQuerySchema.safeParse(query);
  if (!parsed.success) {
    return false;
  }

  const include = parsed.data.include;
  if (!include) {
    return false;
  }

  return include
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .includes('parent');
}

const manageRoutes: FastifyPluginCallback = (app, _opts, done) => {
  app.protect();

  app.get('/categories', async (request, reply) => {
    const rows = await app.repos.itemCategories.findMany(undefined, request.user.id);
    return reply.code(200).send(rows);
  });

  app.get('/categories/:id', async (request, reply) => {
    const params = request.params as { id: string };
    const row = await app.repos.itemCategories.findUnique(
      { where: { id: params.id } },
      request.user.id
    );

    if (!row) return reply.code(404).send({ message: 'Category not found' });

    return reply.code(200).send(row);
  });

  app.post('/categories', async (request, reply) => {
    const body = categoryCreateSchema.parse(request.body);
    const now = new Date().toISOString();
    const created = await app.repos.itemCategories.create({
      data: {
        name: body.name,
        is_active: body.is_active ?? true,
        date_created: now,
        date_updated: null,
        user_id: request.user.id,
      },
    });
    return reply.code(201).send(created);
  });

  app.put('/categories/:id/edit', async (request, reply) => {
    try {
      const params = request.params as { id: string };
      const body = categoryUpdateSchema.parse(request.body);
      const updated = await app.repos.itemCategories.update(
        {
          where: { id: params.id },
          data: { ...body, date_updated: new Date().toISOString() },
        },
        request.user.id
      );
      return reply.code(200).send(updated);
    } catch (error) {
      if (error instanceof Error && error.message.includes('Forbidden mutation')) {
        return reply.code(403).send({ message: 'Forbidden' });
      }
      throw error;
    }
  });

  app.get('/types', async (request, reply) => {
    const includeParent = shouldIncludeParent(request.query);
    const rows = await app.repos.itemTypes.findMany(
      includeParent
        ? {
            include: {
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          }
        : undefined,
      request.user.id
    );
    return reply.code(200).send(rows);
  });

  app.get('/types/:id', async (request, reply) => {
    const params = request.params as { id: string };
    const row = await app.repos.itemTypes.findUnique({ where: { id: params.id } }, request.user.id);

    if (!row) return reply.code(404).send({ message: 'Type not found' });

    return reply.code(200).send(row);
  });

  app.post('/types', async (request, reply) => {
    const body = typeCreateSchema.parse(request.body);
    const now = new Date().toISOString();
    const created = await app.repos.itemTypes.create({
      data: {
        name: body.name,
        category_id: body.category_id,
        is_active: body.is_active ?? true,
        supports_limited: body.supports_limited ?? false,
        is_stackable: body.is_stackable ?? false,
        date_created: now,
        date_updated: null,
        user_id: request.user.id,
      },
    });
    return reply.code(201).send(created);
  });

  app.put('/types/:id/edit', async (request, reply) => {
    try {
      const params = request.params as { id: string };
      const body = typeUpdateSchema.parse(request.body);
      const updated = await app.repos.itemTypes.update(
        {
          where: { id: params.id },
          data: { ...body, date_updated: new Date().toISOString() },
        },
        request.user.id
      );
      return reply.code(200).send(updated);
    } catch (error) {
      if (error instanceof Error && error.message.includes('Forbidden mutation')) {
        return reply.code(403).send({ message: 'Forbidden' });
      }
      throw error;
    }
  });

  app.get('/items', async (request, reply) => {
    const includeParent = shouldIncludeParent(request.query);
    const rows = await app.repos.items.findMany(
      includeParent
        ? {
            include: {
              item_type: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          }
        : undefined,
      request.user.id
    );
    return reply.code(200).send(rows);
  });

  app.get('/items/:id', async (request, reply) => {
    const params = request.params as { id: string };
    const row = await app.repos.items.findUnique({ where: { id: params.id } }, request.user.id);

    if (!row) return reply.code(404).send({ message: 'Item not found' });

    return reply.code(200).send(row);
  });

  app.post('/items', async (request, reply) => {
    const body = itemCreateSchema.parse(request.body);
    const now = new Date().toISOString();
    const created = await app.repos.items.create({
      data: {
        name: body.name,
        image_url_id: body.image_url_id,
        value: body.value,
        is_limited: body.is_limited,
        is_stackable: body.is_stackable ?? true,
        item_type_id: body.item_type_id,
        is_active: body.is_active ?? true,
        date_created: now,
        date_updated: null,
        user_id: request.user.id,
      },
    });
    return reply.code(201).send(created);
  });

  app.put('/items/:id/edit', async (request, reply) => {
    try {
      const params = request.params as { id: string };
      const body = itemUpdateSchema.parse(request.body);
      const updated = await app.repos.items.update(
        {
          where: { id: params.id },
          data: { ...body, date_updated: new Date().toISOString() },
        },
        request.user.id
      );
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

export default manageRoutes;
