import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.url(),
  BETTER_AUTH_SECRET: z.string().min(1, 'BETTER_AUTH_SECRET is required'),
  BETTER_AUTH_URL: z.url(),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().min(1, 'EMAIL_FROM is required'),
  NEXT_PUBLIC_BETTER_AUTH_URL: z.url(),
  CRON_SECRET: z.string().min(1, 'CRON_SECRET is required'),
  DPO_EMAIL: z.email('DPO_EMAIL inválido'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', z.treeifyError(parsed.error));
  throw new Error('Invalid environment variables. Check .env against .env.example');
}

export const env = parsed.data;
