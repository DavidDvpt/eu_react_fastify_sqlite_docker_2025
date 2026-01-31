import argon2 from 'argon2';

import HashTools from '../lib/security/HashTools.js';
import { signinBodySchema } from '../lib/validations/signin.Validation.js';
import { signupBodySchema } from '../lib/validations/signup.Validation.js';

import type { FastifyPluginAsync } from 'fastify';

// eslint-disable-next-line @typescript-eslint/require-await
const authRoutes: FastifyPluginAsync = async (app, _opts) => {
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
  //signin
  app.post(
    '/signin',
    {
      schema: {
        body: signinBodySchema,
      },
    },
    async (request, reply) => {
      const { password, pseudo } = request.body as { password: string; pseudo: string };

      const user = await app.repos.users.findUnique({ where: { pseudo } });

      if (!user) {
        return reply.code(401).send({ message: 'Identifiants invalides' });
      }
      const passOk = await HashTools.verifyPassword(user.password_hash, password);
      if (!passOk) {
        return reply.code(401).send({ message: 'Identifiants invalides' });
      }

      const accessToken = request.server.jwt.access.sign({
        sub: user.id,
        role: user.role,
        pseudo: user.pseudo,
      });

      const refreshToken = request.server.jwt.refresh.sign({
        sub: user.id,
      });

      reply
        .setCookie('access_token', accessToken, {
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          path: '/',
          // maxAge: 60 * 15, // optionnel, sinon c'est géré par l'exp du JWT
        })
        .setCookie('refresh_token', refreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          path: '/auth/refresh', // classique: limiter l’envoi du refresh token
          // maxAge: 60 * 60 * 24 * 7,
        })
        .send({ message: 'Success' });
    }
  );

  // protected routes
  app.register((protectedApp) => {
    protectedApp.protect();

    protectedApp.get('/me', async (request, reply) => {
      try {
        const id = request.user.id;
        const user = await protectedApp.repos.users.findUnique({ where: { id } });

        if (!user) return reply.code(401).send('Unauthorized');

        return reply.code(200).send({ id: user.id, role: user.role, pseudo: user.pseudo });
      } catch {
        return reply.code(401).send('Unauthorized');
      }
    });
  });
};

export default authRoutes;
