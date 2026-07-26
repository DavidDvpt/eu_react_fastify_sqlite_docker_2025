import type {} from '../types/fastify-augment.js';
import type {} from '../types/fastify-jwt.js';
import z from 'zod';

import type { FastifyRequest } from 'fastify';

export function getRequestUserId(request: FastifyRequest): string {
  const requestUserSchema = z.object({
    id: z.string().min(1),
  });
  return requestUserSchema.parse(request.user).id;
}
