import dotenv from 'dotenv';
import { z } from 'zod';

if (process.env.NODE_ENV !== 'production') {
  const envPath =
    process.env.NODE_ENV === 'test'
      ? new URL('../../config/.env.test', import.meta.url)
      : new URL('../../config/.env.dev', import.meta.url);

  dotenv.config({ path: envPath, override: false });
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(8020),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  CORS_ORIGIN: z.string().default(''),
  JWT_ACCESS_SECRET: z.string().min(1, 'JWT_ACCESS_SECRET is required'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('24h'),
  JWT_REFRESH_SECRET: z.string().min(1, 'JWT_REFRESH_SECRET is required'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  SYSTEM_USER_ID: z.string().optional(),
  SYSTEM_USER_PSEUDO: z.string().optional(),
  SYSTEM_USER_EMAIL: z.string().optional(),
  SYSTEM_USER_PASSWORD: z.string().optional(),
  DEV_DATA_USER_ID: z.string().optional(),
  DEV_DATA_USER_LOGIN: z.string().optional(),
  DEV_DATA_USER_PASSWORD: z.string().optional(),
  DEV_DATA_USER_EMAIL: z.string().optional(),
  DEV_ADMIN_ID: z.string().optional(),
  DEV_ADMIN_PSEUDO: z.string().optional(),
  DEV_ADMIN_EMAIL: z.string().optional(),
  DEV_ADMIN_PASSWORD: z.string().optional(),
  SEED_INCLUDE_DEV_DATA: z
    .enum(['true', 'false'])
    .optional()
    .default('false')
    .transform((value) => value === 'true'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const errors = parsedEnv.error.issues
    .map((issue) => `${issue.path.join('.') || 'env'}: ${issue.message}`)
    .join('\n');
  throw new Error(`Invalid environment variables:\n${errors}`);
}

export const env = parsedEnv.data;
