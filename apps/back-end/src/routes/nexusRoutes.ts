import { idSchema, nexusFormSchema, nexusUpdateParamSchema } from '@eu/zod-schemas';

import type { NexusFormBody, NexusUpdateDto } from '@eu/types';
import type { FastifyPluginCallback } from 'fastify';

import prismaClient from '#prisma/prismaClient.js';
import { ItemService, TypeService } from '#src/lib/services/index.js';
import { NexusService } from '#src/lib/services/prisma/NexusService.js';
import { WikiDataToPrismaImportService } from '#src/lib/services/WikiDataToPrismaImportService.js';
import { getRequestUserId } from '#src/routes/utils.js';

const nexusRoutes: FastifyPluginCallback = (app, _opts, done) => {
  const ns = new NexusService(prismaClient);

  app.protect();
  app.adminProtect();

  app.get('/', async (request, reply) => {
    const response = await ns.getAll();

    return reply.code(200).send(response);
  });

  app.post('/init', async (request, reply) => {
    const ts = new TypeService(prismaClient);
    const is = new ItemService(prismaClient);

    const countNexus = await ns.count();

    if (countNexus.count > 0) {
      return reply.code(204).send();
    }

    const countType = await ts.count();

    if (countType.count === 0) {
      return reply.code(204).send();
    }

    const itemCountByType = (await is.groupByType()) ?? {};
    const itemWithoutImageCountByType = (await is.groupByType({ noImage: true })) ?? {};
    const types = await ts.getAll();

    const nexusArray: NexusUpdateDto[] = types.map((m) => ({
      id: m.id,
      appTypeName: m.name,
      appTypeId: m.id,
      nexusName: m.name,
      nexusRequestType: null,
      itemCount: itemCountByType[m.id] ?? 0,
      imageMissingCount: itemWithoutImageCountByType[m.id] ?? 0,
      changeCount: 0,
      createdAt: new Date().toISOString(),
      insertedAt: null,
      updatedAt: null,
    }));

    const init = await ns.createMany({ values: nexusArray });

    return reply.code(201).send(init.count);
  });

  app.post('/update-base', async (request, reply) => {
    const userId = getRequestUserId(request);
    const { type } = nexusUpdateParamSchema.parse(request.body);
    const ns = new WikiDataToPrismaImportService(prismaClient);

    const count = await ns.importDatasFromNexus({ requestType: type, userId });

    return reply.code(201).send({ count });
  });

  app.patch('/:id', async (request, reply) => {
    const { id } = idSchema.parse(request.params);
    const body: NexusFormBody = nexusFormSchema.parse(request.body);
    const updated = await ns.update({ id, body });

    return reply.code(200).send(updated);
  });

  done();
};

export default nexusRoutes;
