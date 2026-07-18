import { CategoriesService } from '../../modules/categories/index.js';

import { categoryUpdateSchema, categoryCreateSchema } from './categorieRoutes.schema.js';

import type { FastifyPluginCallback } from 'fastify';

const categorieRoutes: FastifyPluginCallback = (app, _opts, done) => {
  const categoriesService = new CategoriesService(app.repos.categories);

  app.get('/', async (request, reply) => {
    const rows = await categoriesService.list(request.user.id);
    return reply.code(200).send(rows);
  });

  app.get('/:id', async (request, reply) => {
    const params = request.params as { id: string };
    const row = await categoriesService.getById(params.id, request.user.id);

    if (!row) return reply.code(404).send({ message: 'Category not found' });

    return reply.code(200).send(row);
  });

  app.post('/', async (request, reply) => {
    const body = categoryCreateSchema.parse(request.body);
    const created = await categoriesService.create(body, request.user.id);
    return reply.code(201).send(created);
  });

  app.put('/:id/edit', async (request, reply) => {
    try {
      const params = request.params as { id: string };
      const body = categoryUpdateSchema.parse(request.body);
      const updated = await categoriesService.update(params.id, body, request.user.id);
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

export default categorieRoutes;
