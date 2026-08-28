import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EndContractButton } from '../end-contract-button';
import type { ContractStatus } from '@/generated/prisma/client';

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const date = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' });

const STATUS_LABEL: Record<ContractStatus, string> = { ACTIVE: 'Ativo', ENDED: 'Encerrado' };
const INDEX_LABEL = { IGPM: 'IGP-M', IPCA: 'IPCA', INPC: 'INPC' } as const;

export default async function ContractDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireSession();
  const { id } = await params;

  const contract = await prisma.contract.findFirst({
    where: { id, ownerId: session.user.id },
    include: { property: true, tenant: true },
  });

  if (!contract) notFound();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Link href="/dashboard/contracts" className="text-sm text-muted-foreground">
            &larr; Contratos
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold">{contract.property.label}</h1>
            <Badge variant={contract.status === 'ACTIVE' ? 'default' : 'secondary'}>
              {STATUS_LABEL[contract.status]}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/contracts/${contract.id}/edit`}>Editar</Link>
          </Button>
          {contract.status === 'ACTIVE' && <EndContractButton contractId={contract.id} />}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Termos do contrato</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground">Valor do aluguel</p>
            <p>{currency.format(Number(contract.rentValue))}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Índice de reajuste</p>
            <p>{INDEX_LABEL[contract.adjustmentIndex]}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Data base</p>
            <p>{date.format(contract.baseDate)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Data de início</p>
            <p>{date.format(contract.startDate)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Data de término</p>
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
            {contract.tenant.phone && <p className="text-muted-foreground">{contract.tenant.phone}</p>}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de reajustes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Nenhum reajuste aplicado ainda.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de pagamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Nenhum pagamento registrado ainda.</p>
        </CardContent>
      </Card>
    </div>
  );
}