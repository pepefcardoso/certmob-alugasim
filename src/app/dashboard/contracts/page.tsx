import Link from 'next/link';
import { requireSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ContractStatusBadge } from '@/components/domain/contract-status-badge';
import { EmptyState } from '@/components/domain/empty-state';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/lib/format';

const INDEX_LABEL = { IGPM: 'IGP-M', IPCA: 'IPCA', INPC: 'INPC' } as const;

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
      <div className="flex flex-wrap items-center justify-between gap-2">
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
        <EmptyState
          title="Nenhum contrato encontrado"
          description="Cadastre um contrato vinculando um imóvel a um inquilino para começar a acompanhar reajustes e recebimentos."
          action={{ label: 'Novo contrato', href: '/dashboard/contracts/new' }}
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
            {contracts.map((contract) => (
              <Link
                key={contract.id}
                href={`/dashboard/contracts/${contract.id}`}
                className="block"
              >
                <Card className="shadow-card">
                  <CardContent className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-heading-3">{contract.property.label}</p>
                        <p className="text-body-sm text-neutral-700">{contract.tenant.name}</p>
                      </div>
                      <ContractStatusBadge status={contract.status} />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-500">
                        {INDEX_LABEL[contract.adjustmentIndex]}
                      </span>
                      <span className="text-heading-3 tabular-nums">
                        {formatCurrency(Number(contract.rentValue))}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="hidden lg:block">
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
                    <TableCell className="tabular-nums">
                      {formatCurrency(Number(contract.rentValue))}
                    </TableCell>
                    <TableCell>{INDEX_LABEL[contract.adjustmentIndex]}</TableCell>
                    <TableCell>
                      <ContractStatusBadge status={contract.status} />
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
          </div>
        </>
      )}
    </div>
  );
}
