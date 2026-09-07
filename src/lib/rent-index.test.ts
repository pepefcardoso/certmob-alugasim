import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  findUnique: vi.fn(),
  upsert: vi.fn(),
  getIndexMonthlyRates: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
  prisma: { indexRateCache: { findUnique: mocks.findUnique, upsert: mocks.upsert } },
}));
vi.mock('@/lib/bcb', () => ({ getIndexMonthlyRates: mocks.getIndexMonthlyRates }));

import { getAccumulated12MonthRate } from './rent-index';

function monthlyRates(values: number[]) {
  return values.map((value, i) => ({ date: new Date(Date.UTC(2025, i, 1)), value }));
}

beforeEach(() => {
  mocks.findUnique.mockReset();
  mocks.upsert.mockReset();
  mocks.getIndexMonthlyRates.mockReset();
});

describe('getAccumulated12MonthRate', () => {
  it('returns the cached value and never calls BCB on a cache hit', async () => {
    mocks.findUnique.mockResolvedValue({ accumulatedPercent: '12.3456' });

    const result = await getAccumulated12MonthRate('IPCA', new Date(Date.UTC(2026, 0, 15)));

    expect(result).toBe(12.3456);
    expect(mocks.getIndexMonthlyRates).not.toHaveBeenCalled();
    expect(mocks.upsert).not.toHaveBeenCalled();
  });

  it('compounds monthly rates instead of summing them naively, and caches the result', async () => {
    mocks.findUnique.mockResolvedValue(null);

    mocks.getIndexMonthlyRates.mockResolvedValue(
      monthlyRates([10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
    );
    mocks.upsert.mockResolvedValue({});

    const result = await getAccumulated12MonthRate('IGPM', new Date(Date.UTC(2026, 0, 15)));

    expect(result).toBeCloseTo(21, 10);
    expect(result).not.toBeCloseTo(20, 10);
    expect(mocks.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({ accumulatedPercent: expect.closeTo(21, 10) }),
      }),
    );
  });

  it('only compounds the last 12 months when BCB returns extra leading entries', async () => {
    mocks.findUnique.mockResolvedValue(null);
    mocks.getIndexMonthlyRates.mockResolvedValue(
      monthlyRates([50, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
    );

    const result = await getAccumulated12MonthRate('IGPM', new Date(Date.UTC(2026, 0, 15)));

    expect(result).toBeCloseTo(21, 10);
  });

  it('throws when BCB returns fewer than 12 months', async () => {
    mocks.findUnique.mockResolvedValue(null);
    mocks.getIndexMonthlyRates.mockResolvedValue(monthlyRates([10, 10, 0]));

    await expect(
      getAccumulated12MonthRate('INPC', new Date(Date.UTC(2026, 0, 15))),
    ).rejects.toThrow('esperado 12');
    expect(mocks.upsert).not.toHaveBeenCalled();
  });

  it('requests an 11-month lookback window ending at referenceDate, and caches by month start', async () => {
    mocks.findUnique.mockResolvedValue(null);
    mocks.getIndexMonthlyRates.mockResolvedValue(monthlyRates(Array(12).fill(1)));
    mocks.upsert.mockResolvedValue({});

    const referenceDate = new Date(Date.UTC(2026, 5, 20));

    await getAccumulated12MonthRate('IPCA', referenceDate);

    const [, startDate, endDate] = mocks.getIndexMonthlyRates.mock.calls[0];
    expect(startDate.toISOString().slice(0, 10)).toBe('2025-07-20');
    expect(endDate.toISOString().slice(0, 10)).toBe('2026-06-20');

    const cacheKey = new Date(Date.UTC(2026, 5, 1));
    expect(mocks.findUnique).toHaveBeenCalledWith({
      where: { index_referenceDate: { index: 'IPCA', referenceDate: cacheKey } },
    });
    expect(mocks.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { index_referenceDate: { index: 'IPCA', referenceDate: cacheKey } },
      }),
    );
  });
});
