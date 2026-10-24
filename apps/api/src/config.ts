import dotenv from 'dotenv';
import { z } from 'zod';

// Load local .env if available
dotenv.config();

const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  DATABASE_URL: z
    .string()
    .default('postgresql://postgres:postgres@localhost:5432/peyroo?schema=public'),
});

const parsed = environmentSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment configuration:', parsed.error.format());
  throw new Error('Environment configuration validation failed');
}

export const config = parsed.data;
