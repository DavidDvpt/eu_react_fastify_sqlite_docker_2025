import { nexusParamsSchema } from '@eu/zod-schemas';
import axios from 'axios';

import type { NexusUpdateDto } from '@eu/types';
import type { FastifyPluginCallback } from 'fastify';

import prismaClient from '#prisma/prismaClient.js';
import { env } from '#src/config/env.js';
import { ItemService, TypeService } from '#src/lib/services/index.js';
import { NexusService } from '#src/lib/services/prisma/NexusService.js';
import { getSystemReadableUserIds } from '#src/routes/utils.js';

const NEXUS_URL = env.NEXUS_API_URL;

const authaurizedTypes = ['finders', 'excavators', 'refiners'];
const nexusRoutes: FastifyPluginCallback = (app, _opts, done) => {
  app.protect();
  app.adminProtect();

  app.get('/', async (request, reply) => {
    const ns = new NexusService(prismaClient);

    const response = await ns.getAll();

    return reply.code(200).send(response);
  });

  app.post('/init', async (request, reply) => {
    const ns = new NexusService(prismaClient);
    const ts = new TypeService(prismaClient);
    const is = new ItemService(prismaClient);

    const countNexus = await ns.count();
    const countType = await ts.count();

    if (countNexus.count > 0) {
      return reply.code(204).send();
    }

    if (countType.count === 0) {
      return reply.code(204).send();
    }

    const itemCountByType = (await is.groupByType()) ?? {};
    const itemWithoutImageCountByType = (await is.groupByType({ noImage: true })) ?? {};
    const types = await ts.getAll();

    const nexusArray: NexusUpdateDto[] = types.map((m) => ({
      id: m.id,
      name: m.name,
      nexusName: m.name,
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

  app.get('/:type', async (request, reply) => {
    const { type } = nexusParamsSchema.parse(request.params);

    if (!NEXUS_URL || !type) {
      return reply.code(200).send([]);
    }

    const ts = new TypeService(prismaClient);

    const typeExists = await ts.isTypeExists({ name: type, userIds: getSystemReadableUserIds() });

    if (!typeExists) {
      reply.code(422).send({ message: "the type doesn't exists" });
    }

    if (!authaurizedTypes.includes(type.toLocaleLowerCase())) {
      reply.code(422).send({ message: 'this type not allowed' });
    }

    const url = `${NEXUS_URL}/${type}`;

    await axios.get(url, {});

    return reply.code(200).send({ message: 'end' });
  });

  done();
};

export default nexusRoutes;
