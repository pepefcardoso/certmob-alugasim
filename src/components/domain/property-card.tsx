import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge, type PaymentStatusVariant } from '@/components/domain/status-badge';
import { formatCurrency } from '@/lib/format';

interface PropertyCardProps {
  href: string;
  label: string;
  address: string;
  tenantName?: string;
  rentValue: number;
  status: PaymentStatusVariant;
  statusLabel: string;
}

export function PropertyCard({
  href,
  label,
  address,
  tenantName,
  rentValue,
  status,
  statusLabel,
}: PropertyCardProps) {
  return (
    <Link href={href} className="block">
      <Card className="shadow-card hover:shadow-elevated transition-shadow">
        <CardHeader className="flex-row items-start justify-between gap-2">
          <div>
            <CardTitle className="text-heading-3">{label}</CardTitle>
            <p className="text-body-sm text-neutral-700">{address}</p>
          </div>
          <StatusBadge status={status}>{statusLabel}</StatusBadge>
        </CardHeader>
        <CardContent className="flex items-center justify-between text-sm">
          <p className="text-neutral-700">{tenantName ?? 'Sem inquilino'}</p>
          <p className="text-heading-3 tabular-nums">{formatCurrency(rentValue)}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
