import Link from 'next/link';
import { requireSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <p className="text-muted-foreground">Nenhum locatário cadastrado ainda.</p>
          <Button asChild>
            <Link href="/dashboard/tenants/new">Cadastrar locatário</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button asChild>
          <Link href="/dashboard/tenants/new">Novo locatário</Link>
        </Button>
      </div>
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
              <TableCell>{tenant.phone ?? '—'}</TableCell>
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
  );
}
