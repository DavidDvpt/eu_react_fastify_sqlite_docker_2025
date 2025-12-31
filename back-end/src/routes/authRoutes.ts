import argon2 from 'argon2';
import { FastifyPluginCallback } from 'fastify';

import { signupBodySchema } from '../lib/validations/signup.Validation.js';

const authRoutes: FastifyPluginCallback = (app, _opts, done) => {
  app.post(
    '/signup',
    {
      schema: {
        body: signupBodySchema,
      },
    },
    async (request, reply) => {
      const { email, password, pseudo, firstname, lastname } = request.body as {
        email: string;
        password: string;
        pseudo: string;
        firstname: string;
        lastname: string;
      };

      // 1) check existing user
      const existing = await app.repos.users.findUnique({ where: { email } });
      if (existing) {
        return reply.code(409).send({ message: 'Email already in use' });
      }

      // 2) hash
      const hash = await argon2.hash(password);

      // 3) create (role forced)
      const user = await app.repos.users.create({
        data: {
          email,
          pseudo,
          firstname,
          lastname,
          password_hash: hash,
          role: 'USER',
          is_active: true,
          date_created: new Date().toISOString(),
        },
        select: { id: true, email: true, role: true },
      });

      // 4) issue JWT (optional but common)
      const token = app.jwt.sign({ sub: user.id, role: user.role });

      return reply.code(201).send({
        user,
        token,
      });
    }
  );
  done();
};

export default authRoutes;
