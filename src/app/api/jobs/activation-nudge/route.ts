import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { env } from '@/lib/env';
import { sendEmail } from '@/lib/email';
import { activationNudgeHtml } from '@/lib/email-templates/activation-nudge';

function isAuthorized(request: Request) {
    const auth = request.headers.get('authorization');
    return auth === `Bearer ${env.CRON_SECRET}`;
}

export async function POST(request: Request) {
    if (!isAuthorized(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000);

    const candidates = await prisma.user.findMany({
        where: {
            createdAt: { lte: cutoff },
            activationNudgeSentAt: null,
            contracts: { none: {} },
        },
        select: { id: true, name: true, email: true },
    });

    let notified = 0;
    for (const user of candidates) {
        try {
            await sendEmail({
                to: user.email,
                subject: 'Seu primeiro contrato está te esperando — Alugasim',
                html: activationNudgeHtml({
                    name: user.name?.split(' ')[0] ?? '',
                    propertiesUrl: `${env.NEXT_PUBLIC_BETTER_AUTH_URL}/dashboard/properties/new`,
                }),
            });
            await prisma.user.update({
                where: { id: user.id },
                data: { activationNudgeSentAt: new Date() },
            });
            notified += 1;
        } catch (error) {
            console.error(`[activation-nudge] falha ao notificar ${user.id}`, error);
        }
    }

    return NextResponse.json({ candidates: candidates.length, notified });
}