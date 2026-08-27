import { betterAuth } from 'better-auth';
import { prismaAdapter } from '@better-auth/prisma-adapter';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { env } from '@/lib/env';

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      personType: {
        type: ['PF', 'PJ'],
        required: true,
        input: true,
      },
      document: {
        type: 'string',
        required: true,
        input: true,
      },
    },
  },
});

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}
