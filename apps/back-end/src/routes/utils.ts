import type {} from '../types/fastify-augment.js';
import type {} from '../types/fastify-jwt.js';

import type { FastifyRequest } from 'fastify';

import { requestUserSchema } from '#src/lib/schemas/commonSchemas.js';

export function getRequestUserId(request: FastifyRequest): string {
  return requestUserSchema.parse(request.user).id;
}
