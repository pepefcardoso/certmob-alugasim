import { betterAuth } from 'better-auth';
import { prismaAdapter } from '@better-auth/prisma-adapter';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { env } from '@/lib/env';
import { sendEmail } from '@/lib/email';
import { passwordResetHtml } from '@/lib/email-templates/password-reset';

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    resetPasswordTokenExpiresIn: 60 * 60,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      sendEmail({
        to: user.email,
        subject: 'Redefinição de senha — Alugasim',
        html: passwordResetHtml({ name: user.name, url }),
      }).catch((err) => console.error('[auth] falha ao enviar e-mail de reset', err));
    },
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
      activationNudgeSentAt: {
        type: 'date',
        required: false,
        input: false,
      },
    },
  },
});

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function requireSession() {
  const session = await getSession();
  if (!session) {
    redirect('/sign-in');
  }
  return session;
}
