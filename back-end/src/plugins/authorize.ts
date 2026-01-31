import fp from 'fastify-plugin';

import type {
  FastifyPluginAsync,
  FastifyPluginCallback,
  FastifyReply,
  FastifyRequest,
} from 'fastify';

export type AuthorizeFn = (
  allowedRoles: string[]
) => (request: FastifyRequest, reply: FastifyReply) => void | Promise<void>;

// eslint-disable-next-line @typescript-eslint/require-await
const authorizePlugin: FastifyPluginAsync = async (app, _opts) => {
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
};
// const authorizePlugin = async (app) => {
//   app.decorate('authorize', (allowedRoles) => {
//     return async (request, reply) => {
//       const role = request.user?.role;

//       if (!role || !allowedRoles.includes(role)) {
//         return reply.code(403).send({ message: 'Forbidden' });
//       }
//     };
//   });
// };

export default fp(authorizePlugin);
