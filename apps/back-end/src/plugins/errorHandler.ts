import { ZodError } from 'zod';

import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

import { Prisma } from '#prisma/generated/client.js';

export function errorHandler(error: FastifyError, request: FastifyRequest, reply: FastifyReply) {
  if (error instanceof ZodError) {
    return reply.status(422).send({
      message: 'Invalid request',
      errors: error.issues.map((issue) => ({
        path: issue.path.join(),
        message: 'Invalid value',
      })),
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return reply.status(409).send({
          message: 'Resource already exists',
        });

      case 'P2025':
        return reply.status(404).send({
          message: 'Resource not found',
        });
    }
  }

  request.log.error(error);

  return reply.status(500).send({
    message: 'Internal server error',
  });
}
