import type {} from '../types/fastify-augment.js';
import type {} from '../types/fastify-jwt.js';

import { idSchema } from '@eu/zod-schemas';

import type { FastifyRequest } from 'fastify';

import { env } from '#src/config/env.js';
import { requestUserSchema } from '#src/lib/schemas/commonSchemas.js';

export function getRequestUserId(request: FastifyRequest): string {
  return requestUserSchema.parse(request.user).id;
}

export function getReadableUserIds(request: FastifyRequest): string[] {
  const userId = getRequestUserId(request);

  return [...new Set([userId, env.SYSTEM_USER_ID].filter(Boolean))];
}

export function getIdParam(request: FastifyRequest): { id: string } {
  return idSchema.parse(request.params);
}
