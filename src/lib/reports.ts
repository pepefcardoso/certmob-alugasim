import type { Payment, Prisma } from '@/generated/prisma/client';

export function monthKey(date: Date): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
}

export function lastNMonthKeys(n: number, from: Date = new Date()): string[] {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth() - (n - 1 - i), 1));
    return monthKey(d);
  });
}

export type MonthlyRevenueRow = { month: string; total: number };

/** Sums PAID payments by paidAt month. Payments without paidAt are ignored. */
export function computeMonthlyRevenue(
  payments: Pick<Payment, 'status' | 'paidAt' | 'amount'>[],
  months: string[],
): MonthlyRevenueRow[] {
  const totals = new Map<string, number>(months.map((m) => [m, 0]));
  for (const p of payments) {
    if (p.status !== 'PAID' || !p.paidAt) continue;
    const key = monthKey(p.paidAt);
    if (!totals.has(key)) continue;
    totals.set(key, totals.get(key)! + Number(p.amount));
  }
  return months.map((month) => ({ month, total: totals.get(month) ?? 0 }));
}

export type DelinquencyRow = {
  month: string;
  latePct: number;
  lateCount: number;
  totalDue: number;
};

/** LATE payments / total payments due (by dueDate month), as a percentage per month. */
export function computeDelinquencyRate(
  payments: Pick<Payment, 'status' | 'dueDate'>[],
  months: string[],
): DelinquencyRow[] {
  const buckets = new Map<string, { late: number; total: number }>(
    months.map((m) => [m, { late: 0, total: 0 }]),
  );
  for (const p of payments) {
    const key = monthKey(p.dueDate);
    const bucket = buckets.get(key);
    if (!bucket) continue;
    bucket.total += 1;
    if (p.status === 'LATE') bucket.late += 1;
  }
  return months.map((month) => {
    const b = buckets.get(month)!;
    return {
      month,
      lateCount: b.late,
      totalDue: b.total,
      latePct: b.total === 0 ? 0 : (b.late / b.total) * 100,
    };
  });
}

export type IncomeExportRow = {
  date: string;
  propertyAddress: string;
  tenantName: string;
  amount: number;
};

export function buildIncomeExportRows(
  payments: {
    paidAt: Date | null;
    amount: Prisma.Decimal | number | string;
    contract: {
      property: {
        addressStreet: string;
        addressNumber: string;
        addressCity: string;
        addressState: string;
      };
      tenant: { name: string };
    };
  }[],
): IncomeExportRow[] {
  return payments
    .filter((p) => p.paidAt !== null)
    .map((p) => ({
      date: p.paidAt!.toISOString().slice(0, 10),
      propertyAddress: `${p.contract.property.addressStreet}, ${p.contract.property.addressNumber} - ${p.contract.property.addressCity}/${p.contract.property.addressState}`,
      tenantName: p.contract.tenant.name,
      amount: Number(p.amount),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

function csvEscape(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

export function rowsToCsv(rows: IncomeExportRow[]): string {
  const header = ['Data', 'Imóvel', 'Locatário', 'Valor'];
  const lines = rows.map((r) =>
    [r.date, csvEscape(r.propertyAddress), csvEscape(r.tenantName), r.amount.toFixed(2)].join(','),
  );
  return [header.join(','), ...lines].join('\n');
}
