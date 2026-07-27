// config/env.ts
import { z } from 'zod';
import dotenv from 'dotenv';
import logger from './logger.js';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),

  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).optional(),

  FRONTEND_URL: z.string().url('FRONTEND_URL must be a valid URL'),

  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  REDIS_URL: z.string().min(1, 'REDIS_URL is required'),

  JWT_ACCESS_SECRET: z.string().min(1, 'JWT_ACCESS_SECRET is required'),
  JWT_REFRESH_SECRET: z.string().min(1, 'JWT_REFRESH_SECRET is required'),

  GOOGLE_OAUTH_CLIENT_ID: z.string().min(1, 'GOOGLE_OAUTH_CLIENT_ID is required'),
  GOOGLE_OAUTH_CLIENT_SECRET: z.string().min(1, 'GOOGLE_OAUTH_CLIENT_SECRET is required'),
  GOOGLE_OAUTH_REDIRECT_URI: z.string().min(1, 'GOOGLE_OAUTH_REDIRECT_URI is required'),

  GMAIL_USER: z.string().email('GMAIL_USER must be a valid email'),
  GMAIL_APP_PASSWORD: z.string().min(1, 'GMAIL_APP_PASSWORD is required'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  logger.error({ validationErrors: parsed.error.format() }, 'Invalid environment variables');
  process.exit(1);
}

export const env = parsed.data;