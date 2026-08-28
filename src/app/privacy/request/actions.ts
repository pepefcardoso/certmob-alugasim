'use server';

import { requireSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { env } from '@/lib/env';
import { privacyRequestSchema, type PrivacyRequestInput } from '@/lib/validations/privacy-request';
import { privacyRequestNotificationHtml } from '@/lib/email-templates/privacy-request-notification';

export async function createPrivacyRequest(input: PrivacyRequestInput) {
  const session = await requireSession();
  const data = privacyRequestSchema.parse(input);

  await prisma.privacyRequest.create({
    data: { ...data, userId: session.user.id },
  });

  await sendEmail({
    to: env.DPO_EMAIL,
    subject: 'Nova solicitação de titular (LGPD)',
    html: privacyRequestNotificationHtml({
      requesterName: session.user.name,
      requesterEmail: session.user.email,
      type: data.type,
      details: data.details,
    }),
  });
}
