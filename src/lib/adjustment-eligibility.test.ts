import { describe, expect, it } from 'vitest';
import { isAdjustmentEligible } from './adjustment-eligibility';

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
});