import { prisma } from '@/lib/prisma';
import { getIndexMonthlyRates } from '@/lib/bcb';
import type { AdjustmentIndex } from '@/generated/prisma/client';

function startOfMonthUTC(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

function subMonthsUTC(date: Date, months: number): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() - months, date.getUTCDate()));
}

export async function getAccumulated12MonthRate(
  index: AdjustmentIndex,
  referenceDate: Date,
): Promise<number> {
  const cacheKey = startOfMonthUTC(referenceDate);

  const cached = await prisma.indexRateCache.findUnique({
    where: { index_referenceDate: { index, referenceDate: cacheKey } },
  });
  if (cached) return Number(cached.accumulatedPercent);

  const monthlyRates = await getIndexMonthlyRates(
    index,
    subMonthsUTC(referenceDate, 11),
    referenceDate,
  );
  if (monthlyRates.length < 12) {
    throw new Error(`BCB retornou ${monthlyRates.length} meses para ${index}, esperado 12`);
  }

  const accumulatedPercent =
    (monthlyRates.slice(-12).reduce((factor, rate) => factor * (1 + rate.value / 100), 1) - 1) *
    100;

  await prisma.indexRateCache.upsert({
    where: { index_referenceDate: { index, referenceDate: cacheKey } },
    create: { index, referenceDate: cacheKey, accumulatedPercent },
    update: { accumulatedPercent },
  });

  return accumulatedPercent;
}
