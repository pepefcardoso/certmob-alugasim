import { describe, expect, it } from 'vitest';
import {
  addMonthsClamped,
  billingDueDate,
  buildUpcomingPayments,
  dedupeNewPayments,
  isLateFlipCandidate,
} from './payment-generation';

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

describe('isLateFlipCandidate', () => {
  const now = new Date(Date.UTC(2026, 5, 15, 12, 0, 0));

  it('flips UPCOMING payments whose dueDate is strictly before now', () => {
    const dueDate = new Date(Date.UTC(2026, 5, 15, 11, 59, 59, 999));
    expect(isLateFlipCandidate({ status: 'UPCOMING', dueDate }, now)).toBe(true);
  });

  it('does not flip at the exact boundary instant (dueDate === now)', () => {
    expect(isLateFlipCandidate({ status: 'UPCOMING', dueDate: now }, now)).toBe(false);
  });

  it('does not flip a future dueDate', () => {
    const dueDate = new Date(Date.UTC(2026, 5, 15, 12, 0, 0, 1));
    expect(isLateFlipCandidate({ status: 'UPCOMING', dueDate }, now)).toBe(false);
  });

  it('does not flip non-UPCOMING statuses even if overdue', () => {
    const dueDate = new Date(Date.UTC(2020, 0, 1));
    expect(isLateFlipCandidate({ status: 'PAID', dueDate }, now)).toBe(false);
    expect(isLateFlipCandidate({ status: 'LATE', dueDate }, now)).toBe(false);
  });
});

describe('dedupeNewPayments', () => {
  it('drops candidates whose dueDate already exists, keeps the rest', () => {
    const candidates = [
      { dueDate: new Date(Date.UTC(2026, 0, 15)) },
      { dueDate: new Date(Date.UTC(2026, 1, 15)) },
    ];
    const existing = new Set(['2026-01-15']);

    expect(dedupeNewPayments(candidates, existing)).toEqual([
      { dueDate: new Date(Date.UTC(2026, 1, 15)) },
    ]);
  });
});

describe('generation idempotency (P7.3): re-running with an unchanged existing set', () => {
  it('produces zero new rows on a second run when nothing was persisted in between', () => {
    const startDate = new Date(Date.UTC(2026, 0, 15));
    const existingDueDates = new Set<string>();

    const run1 = dedupeNewPayments(
      buildUpcomingPayments({
        contractId: 'c1',
        startDate,
        rentValue: 1500,
        existingCount: existingDueDates.size,
      }),
      existingDueDates,
    );
    run1.forEach((r) => existingDueDates.add(r.dueDate.toISOString().slice(0, 10)));
    expect(run1).toHaveLength(3);

    const run2 = dedupeNewPayments(
      buildUpcomingPayments({ contractId: 'c1', startDate, rentValue: 1500, existingCount: 0 }),
      existingDueDates,
    );
    expect(run2).toHaveLength(0);
    expect(existingDueDates.size).toBe(3);
  });

  it('a correctly-advanced second run (existingCount reflects run 1) adds the next window without overlap', () => {
    const startDate = new Date(Date.UTC(2026, 0, 15));
    const existingDueDates = new Set<string>();

    const run1 = dedupeNewPayments(
      buildUpcomingPayments({
        contractId: 'c1',
        startDate,
        rentValue: 1500,
        existingCount: existingDueDates.size,
      }),
      existingDueDates,
    );
    run1.forEach((r) => existingDueDates.add(r.dueDate.toISOString().slice(0, 10)));

    const run2 = dedupeNewPayments(
      buildUpcomingPayments({
        contractId: 'c1',
        startDate,
        rentValue: 1500,
        existingCount: existingDueDates.size,
      }),
      existingDueDates,
    );

    expect(run2.map((r) => r.dueDate.toISOString().slice(0, 10))).toEqual([
      '2026-04-15',
      '2026-05-15',
      '2026-06-15',
    ]);
  });
});
