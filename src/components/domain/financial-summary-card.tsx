import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/format';

const TONE_STYLE = {
  success: 'bg-success-100 text-success-700',
  warning: 'bg-warning-100 text-warning-700',
  danger: 'bg-danger-100 text-danger-700',
  neutral: 'bg-brand-100 text-brand-800',
} as const;

interface FinancialSummaryCardProps {
  label: string;
  value: number;
  period?: string;
  icon: LucideIcon;
  helperText?: string;
  tone?: keyof typeof TONE_STYLE;
}

export function FinancialSummaryCard({
  label,
  value,
  period,
  icon: Icon,
  helperText,
  tone = 'neutral',
}: FinancialSummaryCardProps) {
  return (
    <Card className="shadow-card">
      <CardContent className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-body-sm text-neutral-700">{label}</p>
          <p className="text-display text-neutral-950 tabular-nums">{formatCurrency(value)}</p>
          {period && <p className="text-caption text-neutral-500">{period}</p>}
          {helperText && <p className="text-body-sm text-neutral-700">{helperText}</p>}
        </div>
        <span
          className={cn(
            'flex size-9 shrink-0 items-center justify-center rounded-lg',
            TONE_STYLE[tone],
          )}
        >
          <Icon className="size-4.5" aria-hidden="true" />
        </span>
      </CardContent>
    </Card>
  );
}
