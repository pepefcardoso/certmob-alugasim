import { cva } from 'class-variance-authority';
import { CircleCheck, CircleSlash, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ContractStatus } from '@/generated/prisma/client';

const contractStatusVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium',
  {
    variants: {
      status: {
        ACTIVE: 'bg-success-100 text-success-700',
        ENDED: 'bg-neutral-100 text-neutral-700',
      } satisfies Record<ContractStatus, string>,
    },
  },
);

const STATUS_ICON: Record<ContractStatus, LucideIcon> = {
  ACTIVE: CircleCheck,
  ENDED: CircleSlash,
};

const STATUS_LABEL: Record<ContractStatus, string> = { ACTIVE: 'Ativo', ENDED: 'Encerrado' };

export function ContractStatusBadge({
  status,
  className,
}: {
  status: ContractStatus;
  className?: string;
}) {
  const Icon = STATUS_ICON[status];
  return (
    <span className={cn(contractStatusVariants({ status }), className)}>
      <Icon className="size-3.5" aria-hidden="true" />
      {STATUS_LABEL[status]}
    </span>
  );
}
