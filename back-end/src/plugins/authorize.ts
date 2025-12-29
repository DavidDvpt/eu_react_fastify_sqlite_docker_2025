// plugins/authorize.ts
import fp from 'fastify-plugin';

import type { FastifyPluginCallback, FastifyReply, FastifyRequest } from 'fastify';

const authorizePlugin: FastifyPluginCallback = (app, _opts, done) => {
  app.decorate(
    'authorize',
    (allowedRoles: string[]) =>
      async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
        const role = request.user?.role;

        // si pas de role dans le token => pas de droits
        if (!role) {
          return reply.code(403).send({ message: 'Forbidden' });
        }

        if (!allowedRoles.includes(role)) {
          return reply.code(403).send({ message: 'Forbidden' });
        }
      }
  );

  done();
};

export default fp(authorizePlugin, { name: 'authorize' });
