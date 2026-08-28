import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { env } from '@/lib/env';
import { buildUpcomingPayments } from '@/lib/payment-generation';

function isAuthorized(request: Request) {
  const auth = request.headers.get('authorization');
  return auth === `Bearer ${env.CRON_SECRET}`;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const contracts = await prisma.contract.findMany({
    where: { status: 'ACTIVE' },
    select: { id: true, startDate: true, rentValue: true },
  });

  let created = 0;
  for (const contract of contracts) {
    created += await prisma.$transaction(async (tx) => {
      const existingCount = await tx.payment.count({ where: { contractId: contract.id } });
      const result = await tx.payment.createMany({
        data: buildUpcomingPayments({
          contractId: contract.id,
          startDate: contract.startDate,
          rentValue: contract.rentValue,
          existingCount,
        }),
        skipDuplicates: true,
      });
      return result.count;
    });
  }

  const { count: markedLate } = await prisma.payment.updateMany({
    where: { status: 'UPCOMING', dueDate: { lt: new Date() } },
    data: { status: 'LATE' },
  });

  return NextResponse.json({ contractsProcessed: contracts.length, created, markedLate });
}
