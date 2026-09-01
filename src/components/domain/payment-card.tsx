import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge, type PaymentStatusVariant } from '@/components/domain/status-badge';
import { formatCurrency, relativeDueLabel } from '@/lib/format';

const STATUS_LABEL: Record<PaymentStatusVariant, string> = {
  received: 'Recebido',
  pending: 'Pendente',
  overdue: 'Atrasado',
  sent: 'Cobrança enviada',
};

interface PaymentCardProps {
  propertyLabel: string;
  tenantName: string;
  amount: number;
  dueDate: Date;
  status: PaymentStatusVariant;
  actions?: ReactNode;
}

export function PaymentCard({
  propertyLabel,
  tenantName,
  amount,
  dueDate,
  status,
  actions,
}: PaymentCardProps) {
  return (
    <Card size="sm" className="shadow-card">
      <CardContent className="flex items-center justify-between gap-4">
        <div className="space-y-0.5">
          <p className="text-heading-3">{propertyLabel}</p>
          <p className="text-body-sm text-neutral-700">{tenantName}</p>
          <p className="text-body-sm text-neutral-500">{relativeDueLabel(dueDate, status)}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <p className="text-heading-3 tabular-nums">{formatCurrency(amount)}</p>
          <StatusBadge status={status}>{STATUS_LABEL[status]}</StatusBadge>
          {actions}
        </div>
      </CardContent>
    </Card>
  );
}
