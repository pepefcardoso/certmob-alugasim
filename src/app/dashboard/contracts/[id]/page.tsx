import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ContractStatusBadge } from '@/components/domain/contract-status-badge';
import { StatusBadge } from '@/components/domain/status-badge';
import { EndContractButton } from '../end-contract-button';
import { ApplyAdjustmentDialog } from '../apply-adjustment-dialog';
import { MarkPaidButton } from '../mark-paid-button';
import { isAdjustmentEligible, nextAdjustmentDate } from '@/lib/adjustment-eligibility';
import { toStatusVariant, STATUS_LABEL_PT } from '@/lib/payment-status';
import { formatCurrency, formatDate } from '@/lib/format';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const INDEX_LABEL = { IGPM: 'IGP-M', IPCA: 'IPCA', INPC: 'INPC' } as const;

export default async function ContractDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireSession();
  const { id } = await params;

  const contract = await prisma.contract.findFirst({
    where: { id, ownerId: session.user.id },
    include: {
      property: true,
      tenant: true,
      adjustments: { orderBy: { appliedAt: 'desc' } },
      payments: { orderBy: { dueDate: 'asc' } },
    },
  });

  if (!contract) notFound();

  const lastAdjustmentAt = contract.adjustments[0]?.appliedAt ?? null;
  const eligible = isAdjustmentEligible({ baseDate: contract.baseDate, lastAdjustmentAt });
  const nextEligibleDate = nextAdjustmentDate({ baseDate: contract.baseDate, lastAdjustmentAt });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <Link href="/dashboard/contracts" className="text-body-sm text-neutral-500">
            &larr; Contratos
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-heading-1">{contract.property.label}</h1>
            <ContractStatusBadge status={contract.status} />
            {contract.status === 'ACTIVE' && (
              <span className="text-caption text-neutral-500">
                {eligible
                  ? 'Elegível para reajuste'
                  : `Próximo reajuste em ${formatDate(nextEligibleDate)}`}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/contracts/${contract.id}/edit`}>Editar</Link>
          </Button>
          {contract.status === 'ACTIVE' && (
            <ApplyAdjustmentDialog contractId={contract.id} eligible={eligible} />
          )}
          {contract.status === 'ACTIVE' && <EndContractButton contractId={contract.id} />}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-heading-3">Termos do contrato</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div>
            <p className="text-body-sm text-neutral-500">Valor do aluguel</p>
            <p className="tabular-nums">{formatCurrency(Number(contract.rentValue))}</p>
          </div>
          <div>
            <p className="text-body-sm text-neutral-500">Índice de reajuste</p>
            <p>{INDEX_LABEL[contract.adjustmentIndex]}</p>
          </div>
          <div>
            <p className="text-body-sm text-neutral-500">Data base</p>
            <p>{formatDate(contract.baseDate)}</p>
          </div>
          <div>
            <p className="text-body-sm text-neutral-500">Data de início</p>
            <p>{formatDate(contract.startDate)}</p>
          </div>
          <div>
            <p className="text-body-sm text-neutral-500">Data de término</p>
            <p>{contract.endDate ? formatDate(contract.endDate) : '—'}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-heading-3">Imóvel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p>{contract.property.label}</p>
            <p className="text-neutral-500">
              {contract.property.addressStreet}, {contract.property.addressNumber} -{' '}
              {contract.property.addressCity}/{contract.property.addressState}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-heading-3">Locatário</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p>{contract.tenant.name}</p>
            <p className="text-neutral-500">{contract.tenant.email}</p>
            {contract.tenant.phone && <p className="text-neutral-500">{contract.tenant.phone}</p>}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-heading-3">Histórico de pagamentos</CardTitle>
        </CardHeader>
        <CardContent>
          {contract.payments.length === 0 ? (
            <p className="text-body-sm text-neutral-500">Nenhum pagamento registrado ainda.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Pago em</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contract.payments.map((payment) => {
                    const variant = toStatusVariant(payment);
                    return (
                      <TableRow key={payment.id}>
                        <TableCell>{formatDate(payment.dueDate)}</TableCell>
                        <TableCell className="tabular-nums">
                          {formatCurrency(Number(payment.amount))}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={variant}>{STATUS_LABEL_PT[variant]}</StatusBadge>
                        </TableCell>
                        <TableCell>{payment.paidAt ? formatDate(payment.paidAt) : '—'}</TableCell>
                        <TableCell>
                          {payment.status !== 'PAID' && <MarkPaidButton paymentId={payment.id} />}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
