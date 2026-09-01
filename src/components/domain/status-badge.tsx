import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { CheckCircle2, Clock3, AlertTriangle, Send, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type PaymentStatusVariant = 'received' | 'pending' | 'overdue' | 'sent';

const statusBadgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium',
  {
    variants: {
      status: {
        received: 'bg-success-100 text-success-700',
        pending: 'bg-warning-100 text-warning-700',
        overdue: 'bg-danger-100 text-danger-700',
        sent: 'bg-brand-100 text-brand-800',
      } satisfies Record<PaymentStatusVariant, string>,
    },
  },
);

const STATUS_ICON: Record<PaymentStatusVariant, LucideIcon> = {
  received: CheckCircle2,
  pending: Clock3,
  overdue: AlertTriangle,
  sent: Send,
};

interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof statusBadgeVariants> {
  status: PaymentStatusVariant;
}

export function StatusBadge({ status, className, children, ...props }: StatusBadgeProps) {
  const Icon = STATUS_ICON[status];
  return (
    <span className={cn(statusBadgeVariants({ status }), className)} {...props}>
      <Icon className="size-3.5" aria-hidden="true" />
      {children}
    </span>
  );
}
