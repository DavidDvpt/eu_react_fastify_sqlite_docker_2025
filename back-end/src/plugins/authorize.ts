import fp from 'fastify-plugin';

import type { FastifyPluginCallback, FastifyReply, FastifyRequest } from 'fastify';

export type AuthorizeFn = (
  allowedRoles: string[]
) => (request: FastifyRequest, reply: FastifyReply) => void | Promise<void>;

const authorizePlugin: FastifyPluginCallback = (app, _opts, done) => {
  const authorize: AuthorizeFn = (allowedRoles) => {
    return async (request, reply) => {
      const user = request.user as { role?: string } | undefined;

      if (!user?.role || !allowedRoles.includes(user.role)) {
        return reply.code(403).send({ message: 'Forbidden' });
      }

      return;
    };
  };

  app.decorate('authorize', authorize);

  done();
};

export default fp(authorizePlugin);
