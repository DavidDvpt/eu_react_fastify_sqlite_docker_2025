import { requestUserSchema } from './common.schema.js';

import type { FastifyRequest } from 'fastify';

export function getRequestUserId(request: FastifyRequest): string {
  return requestUserSchema.parse(request.user as unknown).id;
}
