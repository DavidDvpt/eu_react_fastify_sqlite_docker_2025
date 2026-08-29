import { nexusParamsSchema } from '@eu/zod-schemas';
import axios from 'axios';

import type { FastifyPluginCallback } from 'fastify';

import prismaClient from '#prisma/prismaClient.js';
import { env } from '#src/config/env.js';
import { TypeService } from '#src/lib/services/index.js';
import { getReadableUserIds } from '#src/routes/utils.js';
const NEXUS_URL = env.NEXUS_API_URL;

const authaurizedTypes = ['finders', 'excavators', 'refiners'];
const nexusRoutes: FastifyPluginCallback = (app, _opts, done) => {
  app.protect();
  app.adminProtect();

  app.get('/:type', async (request, reply) => {
    const { type } = nexusParamsSchema.parse(request.params);
    const userIds = getReadableUserIds(request);

    if (!NEXUS_URL || !type) {
      return reply.code(200).send([]);
    }

    const ts = new TypeService(prismaClient);

    const typeExists = await ts.isTypeExists({ name: type, userIds: userIds });

    if (!typeExists) {
      reply.code(422).send({ message: "the type doesn't exists" });
    }

    if (!authaurizedTypes.includes(type.toLocaleLowerCase())) {
      reply.code(422).send({ message: 'this type not allowed' });
    }

    const url = `${NEXUS_URL}/${type}`;

    const response = await axios.get(url, {});

    return reply.code(200).send({ message: 'end' });
  });

  done();
};

export default nexusRoutes;
