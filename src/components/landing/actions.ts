'use server';

import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { leadNotificationHtml } from '@/lib/email-templates/lead-notification';
import { leadSchema, type LeadInput } from '@/lib/validations/lead';
import { env } from '@/lib/env';

export async function captureLead(input: LeadInput, source = 'landing_hero') {
  const data = leadSchema.parse(input);
  const whatsapp = data.whatsapp.replace(/\D/g, '');
  const propertyCount = Number(data.propertyCount);

  await prisma.lead.create({
    data: { whatsapp, propertyCount, source },
  });

  try {
    await sendEmail({
      to: env.LEAD_NOTIFY_EMAIL,
      subject: `Novo lead: ${propertyCount} imóve${propertyCount > 1 ? 'is' : 'l'}`,
      html: leadNotificationHtml({ whatsapp, propertyCount, source }),
    });
  } catch (error) {
    console.error('[captureLead] falha ao notificar time por e-mail', error);
  }

  return { success: true as const };
}
