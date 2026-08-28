import { describe, expect, it } from 'vitest';
import {
  computeMonthlyRevenue,
  computeDelinquencyRate,
  buildIncomeExportRows,
  rowsToCsv,
  lastNMonthKeys,
  monthKey,
} from './reports';

const d = (y: number, m: number, day = 1) => new Date(Date.UTC(y, m - 1, day));

describe('monthKey / lastNMonthKeys', () => {
  it('formats YYYY-MM', () => {
    expect(monthKey(d(2026, 3, 15))).toBe('2026-03');
  });

  it('returns ascending months ending at "from"', () => {
    expect(lastNMonthKeys(3, d(2026, 3, 15))).toEqual(['2026-01', '2026-02', '2026-03']);
  });
});

describe('computeMonthlyRevenue', () => {
  it('sums PAID payments per calendar month across contracts, ignoring non-PAID/no paidAt', () => {
    const months = ['2026-01', '2026-02'];
    const payments = [
      { status: 'PAID' as const, paidAt: d(2026, 1, 5), amount: 1000 as unknown as never },
      { status: 'PAID' as const, paidAt: d(2026, 1, 20), amount: 500 as unknown as never },
      { status: 'PAID' as const, paidAt: d(2026, 2, 3), amount: 800 as unknown as never },
      { status: 'LATE' as const, paidAt: null, amount: 300 as unknown as never },
      { status: 'UPCOMING' as const, paidAt: null, amount: 300 as unknown as never },
    ];
    expect(computeMonthlyRevenue(payments, months)).toEqual([
      { month: '2026-01', total: 1500 },
      { month: '2026-02', total: 800 },
    ]);
  });
});

describe('computeDelinquencyRate', () => {
  it('matches a manually-computed rate: 1 LATE of 4 due in month = 25%', () => {
    const months = ['2026-01'];
    const payments = [
      { status: 'LATE' as const, dueDate: d(2026, 1, 1) },
      { status: 'PAID' as const, dueDate: d(2026, 1, 5) },
      { status: 'PAID' as const, dueDate: d(2026, 1, 10) },
      { status: 'UPCOMING' as const, dueDate: d(2026, 1, 20) },
    ];
    expect(computeDelinquencyRate(payments, months)).toEqual([
      { month: '2026-01', lateCount: 1, totalDue: 4, latePct: 25 },
    ]);
  });

  it('returns 0% for a month with no payments due', () => {
    expect(computeDelinquencyRate([], ['2026-05'])).toEqual([
      { month: '2026-05', lateCount: 0, totalDue: 0, latePct: 0 },
    ]);
  });
});

describe('buildIncomeExportRows / rowsToCsv', () => {
  it('produces one row per PAID payment with date, address, tenant, amount', () => {
    const rows = buildIncomeExportRows([
      {
        paidAt: d(2026, 1, 10),
        amount: 2500,
        contract: {
          property: {
            addressStreet: 'Rua X',
            addressNumber: '123',
            addressCity: 'SP',
            addressState: 'SP',
          },
          tenant: { name: 'Maria Santos' },
        },
      },
      {
        paidAt: null,
        amount: 100,
        contract: {
          property: {
            addressStreet: 'A',
            addressNumber: '1',
            addressCity: 'B',
            addressState: 'BA',
          },
          tenant: { name: 'X' },
        },
      },
    ]);
    expect(rows).toEqual([
      {
        date: '2026-01-10',
        propertyAddress: 'Rua X, 123 - SP/SP',
        tenantName: 'Maria Santos',
        amount: 2500,
      },
    ]);
  });

  it('CSV output matches on-screen total and parses back to the same amount', () => {
    const csv = rowsToCsv([
      {
        date: '2026-01-10',
        propertyAddress: 'Rua X, 123 - SP/SP',
        tenantName: 'Maria Santos',
        amount: 2500,
      },
    ]);
    const [header, row] = csv.split('\n');
    expect(header).toBe('Data,Imóvel,Locatário,Valor');
    expect(row).toBe('2026-01-10,Rua X, 123 - SP/SP,Maria Santos,2500.00');
  });

  it('quotes fields containing commas', () => {
    const csv = rowsToCsv([
      {
        date: '2026-01-10',
        propertyAddress: 'Rua X, 123 - SP/SP',
        tenantName: 'A, B',
        amount: 100,
      },
    ]);
    expect(csv.split('\n')[1]).toContain('"A, B"');
  });
});
