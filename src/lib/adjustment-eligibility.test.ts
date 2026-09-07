import { describe, expect, it } from 'vitest';
import { isAdjustmentEligible, nextAdjustmentDate } from './adjustment-eligibility';

describe('isAdjustmentEligible', () => {
  it('is eligible 13 months after baseDate with no prior adjustment', () => {
    const baseDate = new Date(Date.UTC(2025, 0, 15));
    const now = new Date(Date.UTC(2026, 1, 15));

    expect(isAdjustmentEligible({ baseDate, lastAdjustmentAt: null }, now)).toBe(true);
  });

  it('is not eligible when the last adjustment was 2 months ago', () => {
    const baseDate = new Date(Date.UTC(2020, 0, 15));
    const lastAdjustmentAt = new Date(Date.UTC(2026, 5, 28));
    const now = new Date(Date.UTC(2026, 7, 28));

    expect(isAdjustmentEligible({ baseDate, lastAdjustmentAt }, now)).toBe(false);
  });

  it('is eligible at the exact 12-month boundary instant (>=, not >)', () => {
    const baseDate = new Date(Date.UTC(2025, 0, 15));
    const now = new Date(Date.UTC(2026, 0, 15));

    expect(isAdjustmentEligible({ baseDate, lastAdjustmentAt: null }, now)).toBe(true);
  });

  it('is not eligible 1ms before the boundary', () => {
    const baseDate = new Date(Date.UTC(2025, 0, 15));
    const now = new Date(Date.UTC(2026, 0, 14, 23, 59, 59, 999));

    expect(isAdjustmentEligible({ baseDate, lastAdjustmentAt: null }, now)).toBe(false);
  });

  it('leap-day base date rolls to Mar 1 (not clamped to Feb 28) in the following non-leap year', () => {
    const baseDate = new Date(Date.UTC(2024, 1, 29));

    expect(
      nextAdjustmentDate({ baseDate, lastAdjustmentAt: null }).toISOString().slice(0, 10),
    ).toBe('2025-03-01');
  });

  it('is not yet eligible on Feb 28 following a leap-day last adjustment, but is eligible on the rolled-over Mar 1', () => {
    const baseDate = new Date(Date.UTC(2020, 0, 1));
    const lastAdjustmentAt = new Date(Date.UTC(2024, 1, 29));

    expect(
      isAdjustmentEligible({ baseDate, lastAdjustmentAt }, new Date(Date.UTC(2025, 1, 28))),
    ).toBe(false);
    expect(
      isAdjustmentEligible({ baseDate, lastAdjustmentAt }, new Date(Date.UTC(2025, 2, 1))),
    ).toBe(true);
  });
});
