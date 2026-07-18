import argon2 from 'argon2';

import { env } from '../config/env.js';
import { AUTH_API_PREFIX } from '../config/index.js';
import { parseDurationToSeconds } from '../lib/auth/index.js';
import { HashTools } from '../lib/security/index.js';
import { signinBodySchema, signupBodySchema } from '../lib/validations/index.js';
import { UsersService } from '../modules/users/index.js';

import type { FastifyPluginAsync } from 'fastify';

// eslint-disable-next-line @typescript-eslint/require-await
const authRoutes: FastifyPluginAsync = async (app, _opts) => {
  const accessTokenMaxAge = parseDurationToSeconds(env.JWT_ACCESS_EXPIRES_IN);
  const refreshTokenMaxAge = parseDurationToSeconds(env.JWT_REFRESH_EXPIRES_IN);
  const usersService = () => new UsersService(app.repos.users);

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
        firstname?: string;
        lastname?: string;
      };

      // 1) check existing user
      const existing = await usersService().getByEmail(email);
      if (existing) {
        return reply.code(409).send({ message: 'Email already in use' });
      }
      // 2) hash
      const hash = await argon2.hash(password);

      // 3) create (role forced)
      await usersService().createAuthUser({
        email,
        pseudo,
        firstname,
        lastname,
        passwordHash: hash,
      });

      return reply.code(201).send({
        message: 'User created',
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

      const user = await usersService().getByPseudo(pseudo);

      if (!user) {
        return reply.code(401).send({ message: 'Identifiants invalides' });
      }

      if (!user.is_active) {
        return reply.code(401).send({ message: 'utilisateur desactivé' });
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
          maxAge: accessTokenMaxAge,
          secure: false,
          sameSite: 'lax',
          path: '/',
        })
        .setCookie('refresh_token', refreshToken, {
          httpOnly: true,
          maxAge: refreshTokenMaxAge,
          secure: false,
          sameSite: 'lax',
          path: AUTH_API_PREFIX,
        })
        .send({ message: 'Success' });
    }
  );

  app.post('/logout', async (_request, reply) => {
    return reply
      .clearCookie('access_token', {
        path: '/',
      })
      .clearCookie('refresh_token', {
        path: AUTH_API_PREFIX,
      })
      .code(200)
      .send({ message: 'Logged out' });
  });

  // protected routes
  app.register((protectedApp) => {
    protectedApp.protect();

    protectedApp.get('/me', async (request, reply) => {
      try {
        const id = request.user.id;
        const user = await usersService().getById(id);

        if (!user) return reply.code(401).send('Unauthorized');

        return reply.code(200).send({ id: user.id, role: user.role, pseudo: user.pseudo });
      } catch {
        return reply.code(401).send('Unauthorized');
      }
    });
  });
};

export default authRoutes;
