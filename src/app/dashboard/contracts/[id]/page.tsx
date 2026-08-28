import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EndContractButton } from '../end-contract-button';
import { ApplyAdjustmentDialog } from '../apply-adjustment-dialog';
import { isAdjustmentEligible, nextAdjustmentDate } from '@/lib/adjustment-eligibility';
import type { ContractStatus } from '@/generated/prisma/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const date = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' });
const percent = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const STATUS_LABEL: Record<ContractStatus, string> = { ACTIVE: 'Ativo', ENDED: 'Encerrado' };
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
    },
  });

  if (!contract) notFound();

  const lastAdjustmentAt = contract.adjustments[0]?.appliedAt ?? null;
  const eligible = isAdjustmentEligible({ baseDate: contract.baseDate, lastAdjustmentAt });
  const nextEligibleDate = nextAdjustmentDate({ baseDate: contract.baseDate, lastAdjustmentAt });

  if (!contract) notFound();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Link href="/dashboard/contracts" className="text-muted-foreground text-sm">
            &larr; Contratos
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold">{contract.property.label}</h1>
            <Badge variant={contract.status === 'ACTIVE' ? 'default' : 'secondary'}>
              {STATUS_LABEL[contract.status]}
            </Badge>
            {contract.status === 'ACTIVE' && (
              <Badge variant={eligible ? 'default' : 'outline'}>
                {eligible
                  ? 'Elegível para reajuste'
                  : `Próximo reajuste em ${date.format(nextEligibleDate)}`}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex gap-2">
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
          <CardTitle>Termos do contrato</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div>
            <p className="text-muted-foreground text-sm">Valor do aluguel</p>
            <p>{currency.format(Number(contract.rentValue))}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Índice de reajuste</p>
            <p>{INDEX_LABEL[contract.adjustmentIndex]}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Data base</p>
            <p>{date.format(contract.baseDate)}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Data de início</p>
            <p>{date.format(contract.startDate)}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Data de término</p>
            <p>{contract.endDate ? date.format(contract.endDate) : '—'}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Imóvel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p>{contract.property.label}</p>
            <p className="text-muted-foreground">
              {contract.property.addressStreet}, {contract.property.addressNumber} -{' '}
              {contract.property.addressCity}/{contract.property.addressState}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Locatário</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p>{contract.tenant.name}</p>
            <p className="text-muted-foreground">{contract.tenant.email}</p>
            {contract.tenant.phone && (
              <p className="text-muted-foreground">{contract.tenant.phone}</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de reajustes</CardTitle>
        </CardHeader>
        <CardContent>
          {contract.adjustments.length === 0 ? (
            <p className="text-muted-foreground text-sm">Nenhum reajuste aplicado ainda.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Índice</TableHead>
                  <TableHead>Taxa</TableHead>
                  <TableHead>Valor anterior → Novo valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contract.adjustments.map((adjustment) => (
                  <TableRow key={adjustment.id}>
                    <TableCell>{date.format(adjustment.appliedAt)}</TableCell>
                    <TableCell>{INDEX_LABEL[adjustment.indexUsed]}</TableCell>
                    <TableCell>{percent.format(Number(adjustment.indexRatePercent))}%</TableCell>
                    <TableCell>
                      {currency.format(Number(adjustment.previousValue))} →{' '}
                      {currency.format(Number(adjustment.newValue))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de pagamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">Nenhum pagamento registrado ainda.</p>
        </CardContent>
      </Card>
    </div>
  );
}
