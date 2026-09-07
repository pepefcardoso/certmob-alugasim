import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { env } from '@/lib/env';
import {
  buildUpcomingPayments,
  dedupeNewPayments,
  isLateFlipCandidate,
} from '@/lib/payment-generation';

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
      const existing = await tx.payment.findMany({
        where: { contractId: contract.id },
        select: { dueDate: true },
      });
      const existingDueDates = new Set(existing.map((p) => p.dueDate.toISOString().slice(0, 10)));

      const candidates = buildUpcomingPayments({
        contractId: contract.id,
        startDate: contract.startDate,
        rentValue: contract.rentValue,
        existingCount: existing.length,
      });
      const rowsToInsert = dedupeNewPayments(candidates, existingDueDates);
      if (rowsToInsert.length === 0) return 0;

      const result = await tx.payment.createMany({ data: rowsToInsert, skipDuplicates: true });
      return result.count;
    });
  }

  const upcoming = await prisma.payment.findMany({
    where: { status: 'UPCOMING' },
    select: { id: true, status: true, dueDate: true },
  });
  const now = new Date();
  const lateIds = upcoming.filter((p) => isLateFlipCandidate(p, now)).map((p) => p.id);

  let markedLate = 0;
  if (lateIds.length > 0) {
    const result = await prisma.payment.updateMany({
      where: { id: { in: lateIds } },
      data: { status: 'LATE' },
    });
    markedLate = result.count;
  }

  return NextResponse.json({ contractsProcessed: contracts.length, created, markedLate });
}
