import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { buildIncomeExportRows, rowsToCsv } from '@/lib/reports';

export async function GET(request: Request) {
  const session = await requireSession();
  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month');

  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return NextResponse.json(
      { error: 'Parâmetro "month" inválido (esperado YYYY-MM)' },
      { status: 400 },
    );
  }

  const [year, m] = month.split('-').map(Number);
  const start = new Date(Date.UTC(year, m - 1, 1));
  const end = new Date(Date.UTC(year, m, 1));

  const payments = await prisma.payment.findMany({
    where: {
      contract: { ownerId: session.user.id },
      status: 'PAID',
      paidAt: { gte: start, lt: end },
    },
    select: {
      paidAt: true,
      amount: true,
      contract: {
        select: {
          property: {
            select: {
              addressStreet: true,
              addressNumber: true,
              addressCity: true,
              addressState: true,
            },
          },
          tenant: { select: { name: true } },
        },
      },
    },
  });

  const csv = rowsToCsv(buildIncomeExportRows(payments));

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="renteasy-receita-${month}.csv"`,
    },
  });
}
