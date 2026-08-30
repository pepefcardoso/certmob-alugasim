function addMonthsUTC(date: Date, months: number): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, date.getUTCDate()));
}

export function nextAdjustmentDate({
  baseDate,
  lastAdjustmentAt,
}: {
  baseDate: Date;
  lastAdjustmentAt: Date | null;
}): Date {
  return addMonthsUTC(lastAdjustmentAt ?? baseDate, 12);
}

export function isAdjustmentEligible(
  input: { baseDate: Date; lastAdjustmentAt: Date | null },
  now = new Date(),
): boolean {
  return now >= nextAdjustmentDate(input);
}
