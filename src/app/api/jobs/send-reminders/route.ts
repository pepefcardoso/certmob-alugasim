import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { env } from '@/lib/env';
import { sendEmail } from '@/lib/email';
import { paymentReminderHtml } from '@/lib/email-templates/payment-reminder';
import { isDueInDays } from '@/lib/payment-generation';

const REMINDER_DAYS_BEFORE_DUE = 3;

function isAuthorized(request: Request) {
  const auth = request.headers.get('authorization');
  return auth === `Bearer ${env.CRON_SECRET}`;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const candidates = await prisma.payment.findMany({
    where: { status: 'UPCOMING', reminderSentAt: null },
    include: {
      contract: {
        include: {
          tenant: true,
          property: true,
        },
      },
    },
  });

  const now = new Date();
  let sent = 0;

  for (const payment of candidates) {
    if (!isDueInDays(payment.dueDate, REMINDER_DAYS_BEFORE_DUE, now)) continue;

    const { tenant, property } = payment.contract;
    const propertyAddress = `${property.addressStreet}, ${property.addressNumber} - ${property.addressCity}/${property.addressState}`;

    await sendEmail({
      to: tenant.email,
      subject: 'Lembrete de pagamento — Alugasim',
      html: paymentReminderHtml({
        tenantName: tenant.name,
        propertyAddress,
        amount: payment.amount,
        dueDate: payment.dueDate,
      }),
    });

    await prisma.payment.update({
      where: { id: payment.id },
      data: { reminderSentAt: new Date() },
    });
    sent += 1;
  }

  return NextResponse.json({ checked: candidates.length, sent });
}
