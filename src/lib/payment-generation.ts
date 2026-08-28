import type { PaymentStatus } from '@/generated/prisma/client';

export const PAYMENT_WINDOW_MONTHS = 3;

export function addMonthsClamped(date: Date, months: number): Date {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();
  const lastDayOfTargetMonth = new Date(Date.UTC(year, month + months + 1, 0)).getUTCDate();
  return new Date(Date.UTC(year, month + months, Math.min(day, lastDayOfTargetMonth)));
}

export function billingDueDate(startDate: Date, periodIndex: number): Date {
  return addMonthsClamped(startDate, periodIndex);
}

export function buildUpcomingPayments({
  contractId,
  startDate,
  rentValue,
  existingCount,
  windowMonths = PAYMENT_WINDOW_MONTHS,
}: {
  contractId: string;
  startDate: Date;
  rentValue: number | string;
  existingCount: number;
  windowMonths?: number;
}): { contractId: string; dueDate: Date; amount: number | string; status: PaymentStatus }[] {
  return Array.from({ length: windowMonths }, (_, i) => ({
    contractId,
    dueDate: billingDueDate(startDate, existingCount + i),
    amount: rentValue,
    status: 'UPCOMING' as const,
  }));
}
