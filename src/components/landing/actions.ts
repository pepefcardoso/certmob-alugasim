'use server';

import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { leadMagnetHtml } from '@/lib/email-templates/lead-magnet';
import { leadSchema, type LeadInput } from '@/lib/validations/lead';

export async function captureLead(input: LeadInput, source = 'landing_hero') {
  const data = leadSchema.parse(input);

  await prisma.lead.create({
    data: {
      email: data.email,
      whatsapp: data.whatsapp.replace(/\D/g, ''),
      propertyCount: Number(data.propertyCount),
      source,
    },
  });

  try {
    await sendEmail({
      to: data.email,
      subject: 'Seu cálculo de reajuste — RentEasy',
      html: leadMagnetHtml({ propertyCount: Number(data.propertyCount) }),
    });
  } catch (error) {
    console.error('[captureLead] falha ao enviar e-mail de confirmação', error);
  }

  return { success: true as const };
}
