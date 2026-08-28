import Link from 'next/link';
import { requireSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { ContractStatus } from '@/generated/prisma/client';

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

const STATUS_LABEL: Record<ContractStatus, string> = {
  ACTIVE: 'Ativo',
  ENDED: 'Encerrado',
};

export default async function ContractsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await requireSession();
  const { status } = await searchParams;
  const statusFilter = status === 'ACTIVE' || status === 'ENDED' ? status : undefined;

  const contracts = await prisma.contract.findMany({
    where: { ownerId: session.user.id, ...(statusFilter && { status: statusFilter }) },
    include: { property: true, tenant: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button variant={!statusFilter ? 'secondary' : 'ghost'} size="sm" asChild>
            <Link href="/dashboard/contracts">Todos</Link>
          </Button>
          <Button variant={statusFilter === 'ACTIVE' ? 'secondary' : 'ghost'} size="sm" asChild>
            <Link href="/dashboard/contracts?status=ACTIVE">Ativos</Link>
          </Button>
          <Button variant={statusFilter === 'ENDED' ? 'secondary' : 'ghost'} size="sm" asChild>
            <Link href="/dashboard/contracts?status=ENDED">Encerrados</Link>
          </Button>
        </div>
        <Button asChild>
          <Link href="/dashboard/contracts/new">Novo contrato</Link>
        </Button>
      </div>

      {contracts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <p className="text-muted-foreground">Nenhum contrato encontrado.</p>
          </CardContent>
        </Card>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Imóvel</TableHead>
              <TableHead>Locatário</TableHead>
              <TableHead>Valor do aluguel</TableHead>
              <TableHead>Índice</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts.map((contract) => (
              <TableRow key={contract.id}>
                <TableCell>{contract.property.label}</TableCell>
                <TableCell>{contract.tenant.name}</TableCell>
                <TableCell>{currency.format(Number(contract.rentValue))}</TableCell>
                <TableCell>{contract.adjustmentIndex}</TableCell>
                <TableCell>
                  <Badge variant={contract.status === 'ACTIVE' ? 'default' : 'secondary'}>
                    {STATUS_LABEL[contract.status]}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
  <Button variant="ghost" size="sm" asChild>
    <Link href={`/dashboard/contracts/${contract.id}`}>Ver detalhes</Link>
  </Button>
</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
