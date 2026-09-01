import { describe, expect, it } from 'vitest';
import { addMonthsClamped, billingDueDate, buildUpcomingPayments } from './payment-generation';

describe('addMonthsClamped', () => {
  it('clamps the 31st into a 30-day month without crashing', () => {
    const start = new Date(Date.UTC(2026, 2, 31));
    expect(addMonthsClamped(start, 1).toISOString().slice(0, 10)).toBe('2026-04-30');
  });

  it('does not drift after a clamp (Jan 31 -> Feb 28 -> Mar 31, not Mar 28)', () => {
    const start = new Date(Date.UTC(2026, 0, 31));
    expect(billingDueDate(start, 1).toISOString().slice(0, 10)).toBe('2026-02-28');
    expect(billingDueDate(start, 2).toISOString().slice(0, 10)).toBe('2026-03-31');
  });
});

describe('buildUpcomingPayments', () => {
  it('generates 3 rows starting at periodIndex 0 for a new contract', () => {
    const startDate = new Date(Date.UTC(2026, 0, 15));
    const rows = buildUpcomingPayments({
      contractId: 'c1',
      startDate,
      rentValue: 1500,
      existingCount: 0,
    });

    expect(rows).toHaveLength(3);
    expect(rows.map((r) => r.dueDate.toISOString().slice(0, 10))).toEqual([
      '2026-01-15',
      '2026-02-15',
      '2026-03-15',
    ]);
    expect(rows.every((r) => r.status === 'UPCOMING' && r.amount === 1500)).toBe(true);
  });

  it('continues from existingCount instead of restarting at startDate', () => {
    const startDate = new Date(Date.UTC(2025, 0, 15));
    const rows = buildUpcomingPayments({
      contractId: 'c1',
      startDate,
      rentValue: 1800,
      existingCount: 14,
    });

    expect(rows.map((r) => r.dueDate.toISOString().slice(0, 10))).toEqual([
      '2026-03-15',
      '2026-04-15',
      '2026-05-15',
    ]);
  });
});
