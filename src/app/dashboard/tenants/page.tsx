import Link from 'next/link';
import { requireSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/domain/empty-state';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DeleteTenantButton } from './delete-tenant-button';

export default async function TenantsPage() {
  const session = await requireSession();

  const tenants = await prisma.tenant.findMany({
    where: { ownerId: session.user.id },
    include: { _count: { select: { contracts: true } } },
    orderBy: { createdAt: 'desc' },
  });

  if (tenants.length === 0) {
    return (
      <EmptyState
        title="Nenhum locatário cadastrado"
        description="Cadastre um locatário para poder vinculá-lo a um contrato."
        action={{ label: 'Cadastrar locatário', href: '/dashboard/tenants/new' }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button asChild>
          <Link href="/dashboard/tenants/new">Novo locatário</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
        {tenants.map((tenant) => (
          <Card key={tenant.id} className="shadow-card">
            <CardContent className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-heading-3">{tenant.name}</p>
                  <p className="text-body-sm text-neutral-700">{tenant.email}</p>
                  <p className="text-body-sm text-neutral-500">{tenant.phone ?? 'Sem telefone'}</p>
                </div>
                <span className="text-caption text-neutral-500">
                  {tenant._count.contracts}{' '}
                  {tenant._count.contracts === 1 ? 'contrato' : 'contratos'}
                </span>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/dashboard/tenants/${tenant.id}/edit`}>Editar</Link>
                </Button>
                <DeleteTenantButton tenantId={tenant.id} name={tenant.name} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="hidden lg:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Contratos</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tenants.map((tenant) => (
              <TableRow key={tenant.id}>
                <TableCell>{tenant.name}</TableCell>
                <TableCell>{tenant.email}</TableCell>
                <TableCell>{tenant.phone ?? '-'}</TableCell>
                <TableCell>{tenant._count.contracts}</TableCell>
                <TableCell className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/tenants/${tenant.id}/edit`}>Editar</Link>
                  </Button>
                  <DeleteTenantButton tenantId={tenant.id} name={tenant.name} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
