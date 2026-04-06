import { z } from 'zod';

import type { FastifyPluginCallback } from 'fastify';

const categoryCreateSchema = z.object({
  name: z.string().min(1),
  is_active: z.boolean().optional(),
});

const categoryUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  is_active: z.boolean().optional(),
});

const typeCreateSchema = z.object({
  name: z.string().min(1),
  category_id: z.string().min(1),
  is_active: z.boolean().optional(),
});

const typeUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  category_id: z.string().min(1).optional(),
  is_active: z.boolean().optional(),
});

const itemCreateSchema = z.object({
  name: z.string().min(1),
  image_url_id: z.string(),
  value: z.coerce.number(),
  is_limited: z.boolean(),
  item_type_id: z.string().min(1),
  is_active: z.boolean().optional(),
});

const itemUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  image_url_id: z.string().optional(),
  value: z.coerce.number().optional(),
  is_limited: z.boolean().optional(),
  item_type_id: z.string().min(1).optional(),
  is_active: z.boolean().optional(),
});

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
    const rows = await app.repos.itemTypes.findMany(undefined, request.user.id);
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
    const rows = await app.repos.items.findMany(undefined, request.user.id);
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
