import type { AdjustmentIndex } from '@/generated/prisma/client';

const SGS_SERIES_CODE: Record<AdjustmentIndex, number> = {
  IGPM: 189,
  INPC: 188,
  IPCA: 433,
};

export interface IndexMonthlyRate {
  date: Date;
  value: number;
}

interface BcbSgsEntry {
  data: string;
  valor: string;
}

function formatBcbDate(date: Date): string {
  const dd = String(date.getUTCDate()).padStart(2, '0');
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${date.getUTCFullYear()}`;
}

function parseBcbDate(value: string): Date {
  const [day, month, year] = value.split('/').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export async function getIndexMonthlyRates(
  index: AdjustmentIndex,
  startDate: Date,
  endDate: Date,
): Promise<IndexMonthlyRate[]> {
  const code = SGS_SERIES_CODE[index];
  const url = `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${code}/dados?formato=json&dataInicial=${formatBcbDate(startDate)}&dataFinal=${formatBcbDate(endDate)}`;

  console.log(`[bcb] fetching ${index} série ${code} (${formatBcbDate(startDate)}–${formatBcbDate(endDate)})`);

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`BCB SGS ${index} (série ${code}) failed: ${res.status} ${res.statusText}`);
  }

  const entries = (await res.json()) as BcbSgsEntry[];
  return entries.map((entry) => ({
    date: parseBcbDate(entry.data),
    value: Number(entry.valor.replace(',', '.')),
  }));
}