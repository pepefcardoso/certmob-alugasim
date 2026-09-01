import type { PaymentStatus } from '@/generated/prisma/client';
import type { PaymentStatusVariant } from '@/components/domain/status-badge';

export function toStatusVariant(
  payment: { status: PaymentStatus; reminderSentAt?: Date | null } | null,
): PaymentStatusVariant {
  if (!payment) return 'received';
  if (payment.status === 'LATE') return 'overdue';
  if (payment.status === 'PAID') return 'received';
  return payment.reminderSentAt ? 'sent' : 'pending';
}

export const STATUS_LABEL_PT: Record<PaymentStatusVariant, string> = {
  received: 'Pago',
  pending: 'A vencer',
  overdue: 'Atrasado',
  sent: 'Cobrança enviada',
};

export const STATUS_PRIORITY: Record<PaymentStatusVariant, number> = {
  overdue: 0,
  pending: 1,
  sent: 1,
  received: 2,
};
