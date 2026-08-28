import { NextResponse } from 'next/server';
import { getAccumulated12MonthRate } from '@/lib/rent-index';
import type { AdjustmentIndex } from '@/generated/prisma/client';

const INDICES: AdjustmentIndex[] = ['IGPM', 'IPCA', 'INPC'];

const FALLBACK_RATES: Record<AdjustmentIndex, number> = {
  IGPM: 3.2,
  IPCA: 4.5,
  INPC: 4.7,
};

export async function GET() {
  const now = new Date();

  const entries = await Promise.all(
    INDICES.map(async (index) => {
      try {
        const value = await getAccumulated12MonthRate(index, now);
        return [index, Number(value.toFixed(2))] as const;
      } catch (error) {
        console.error(`[api/public/rent-index] fallback para ${index}`, error);
        return [index, FALLBACK_RATES[index]] as const;
      }
    }),
  );

  return NextResponse.json(Object.fromEntries(entries), {
    headers: { 'Cache-Control': 'public, max-age=3600' },
  });
}
