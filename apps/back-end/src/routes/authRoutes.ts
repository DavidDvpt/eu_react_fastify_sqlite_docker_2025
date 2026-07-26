import argon2 from 'argon2';

import { env } from '../config/env.js';
import { AUTH_API_PREFIX } from '../config/index.js';
import { parseDurationToSeconds } from '../lib/auth/index.js';
import { HashTools } from '../lib/security/index.js';
import { signinBodySchema, signupBodySchema } from '../lib/validations/index.js';

import type { FastifyPluginAsync } from 'fastify';

import prismaClient from '#prisma/prismaClient.js';
import { UserService } from '#src/lib/services/userService.js';

// eslint-disable-next-line @typescript-eslint/require-await
const authRoutes: FastifyPluginAsync = async (app, _opts) => {
  const accessTokenMaxAge = parseDurationToSeconds(env.JWT_ACCESS_EXPIRES_IN);
  const refreshTokenMaxAge = parseDurationToSeconds(env.JWT_REFRESH_EXPIRES_IN);

  const as = new UserService(prismaClient);

  app.post(
    '/signup',
    {
      schema: {
        body: signupBodySchema,
      },
    },
    async (request, reply) => {
      const { email, password, pseudo, firstname, lastname } = signupBodySchema.parse(request.body);

      const emailExists = await as.getByEmail({ email });
      const pseudoExists = await as.getByPseudo({ pseudo });

      if (!emailExists) {
        return reply.code(409).send({ message: 'Email already in use' });
      }
      if (!pseudoExists) {
        return reply.code(409).send({ message: 'Pseudo already in use' });
      }

      const hash = await argon2.hash(password);

      await as.create({
        body: { email, pseudo, firstname, lastname, password: hash },
      });

      return reply.code(201).send({
        message: 'User created',
      });
    }
  );

  app.post(
    '/signin',
    {
      schema: {
        body: signinBodySchema,
      },
    },
    async (request, reply) => {
      const { password, pseudo } = signinBodySchema.parse(request.body);

      const user = await as.getByPseudo({ pseudo });

      if (!user) {
        return reply.code(401).send({ message: 'Identifiants invalides' });
      }

      if (!user.isActive) {
        return reply.code(401).send({ message: 'utilisateur desactivé' });
      }

      if (!user.password) {
        return reply.code(401).send({ message: 'password incorrect' });
      }

      const passOk = await HashTools.verifyPassword(user.password, password);

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

        const user = await as.getbyId({ id });

        if (!user) return reply.code(401).send('Unauthorized');

        return reply.code(200).send({ id: user.id, role: user.role, pseudo: user.pseudo });
      } catch {
        return reply.code(401).send('Unauthorized');
      }
    });
  });
};

export default authRoutes;
