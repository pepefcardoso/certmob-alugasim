import type { PaymentStatus, Prisma } from '@/generated/prisma/client';

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

export function isDueInDays(dueDate: Date, days: number, today: Date = new Date()): boolean {
  const dueUtc = Date.UTC(dueDate.getUTCFullYear(), dueDate.getUTCMonth(), dueDate.getUTCDate());
  const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  const diffDays = Math.round((dueUtc - todayUtc) / 86_400_000);
  return diffDays === days;
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
  rentValue: Prisma.Decimal | number | string;
  existingCount: number;
  windowMonths?: number;
}): { contractId: string; dueDate: Date; amount: Prisma.Decimal | number | string; status: PaymentStatus }[] {
  return Array.from({ length: windowMonths }, (_, i) => ({
    contractId,
    dueDate: billingDueDate(startDate, existingCount + i),
    amount: rentValue,
    status: 'UPCOMING' as const,
  }));
}
