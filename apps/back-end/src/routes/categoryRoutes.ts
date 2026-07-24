import { categoryFormSchema } from '@eu/zod-schemas';
import { CategoryService } from 'src/lib/services/categoryService.js';

import type { CategoryFormOutputBody } from '@eu/types';
import type { FastifyPluginCallback } from 'fastify';

const categorieRoutes: FastifyPluginCallback = (app, _opts, done) => {
  app.get('/', async (request, reply) => {
    const rows = await CategoryService.getAll(request.user.id);

    return reply.code(200).send(rows);
  });

  app.get('/:id', async (request, reply) => {
    const params = request.params as { id: string };

    const row = await CategoryService.getById(params.id, request.user.id);

    if (!row) return reply.code(404).send({ message: 'Category not found' });

    return reply.code(200).send(row);
  });

  app.post('/', async (request, reply) => {
    const body: CategoryFormOutputBody = categoryFormSchema.parse(request.body);
    const created = await CategoryService.create(request.user.id, body);

    return reply.code(201).send({ id: created.id });
  });

  app.patch('/:id', async (request, reply) => {
    try {
      const params = request.params as { id: string };
      const body: Partial<CategoryFormOutputBody> = categoryFormSchema
        .partial()
        .parse(request.body);
      const updated = await CategoryService.update(params.id, request.user.id, body);

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

export default categorieRoutes;
