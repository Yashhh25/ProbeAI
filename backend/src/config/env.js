require('dotenv').config();

const { z } = require('zod');

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),

  PORT: z.coerce.number().int().positive().default(5000),

  MONGO_URI: z.string().min(1, 'MONGO_URI is required'),

  JWT_SECRET: z
    .string()
    .min(8, 'JWT_SECRET must be at least 8 characters'),

  JWT_EXPIRES_IN: z.string().default('7d'),

  OPENROUTER_API_KEY: z
    .string()
    .min(1, 'OPENROUTER_API_KEY is required'),

  OPENROUTER_BASE_URL: z
    .string()
    .url('OPENROUTER_BASE_URL must be a valid URL'),

  AI_MODEL: z.string().default('openai/gpt-4o-mini'),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  const messages = result.error.issues
    .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
    .join('\n');

  throw new Error(`Environment validation failed:\n${messages}`);
}

const env = Object.freeze({
  nodeEnv: result.data.NODE_ENV,
  port: result.data.PORT,
  mongoUri: result.data.MONGO_URI,
  jwtSecret: result.data.JWT_SECRET,
  jwtExpiresIn: result.data.JWT_EXPIRES_IN,

  openRouterApiKey: result.data.OPENROUTER_API_KEY,
  openRouterBaseUrl: result.data.OPENROUTER_BASE_URL,
  aiModel: result.data.AI_MODEL,
});

module.exports = env;