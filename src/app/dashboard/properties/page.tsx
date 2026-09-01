import Link from 'next/link';
import { requireSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { PropertyCard } from '@/components/domain/property-card';
import { EmptyState } from '@/components/domain/empty-state';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DeletePropertyButton } from './delete-property-button';
import { toStatusVariant, STATUS_LABEL_PT } from '@/lib/payment-status';
import { formatCurrency } from '@/lib/format';

export default async function PropertiesPage() {
  const session = await requireSession();

  const properties = await prisma.property.findMany({
    where: { ownerId: session.user.id },
    include: {
      contracts: {
        where: { status: 'ACTIVE' },
        include: { tenant: true, payments: { orderBy: { dueDate: 'asc' } } },
        take: 1,
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (properties.length === 0) {
    return (
      <EmptyState
        title="Seus imóveis começam aqui"
        description="Cadastre o primeiro imóvel para acompanhar contratos, recebimentos e cobranças."
        action={{ label: 'Cadastrar imóvel', href: '/dashboard/properties/new' }}
      />
    );
  }

  const rows = properties.map((property) => {
    const contract = property.contracts[0];
    const relevant = contract
      ? (contract.payments.find((p) => p.status !== 'PAID') ?? contract.payments.at(-1) ?? null)
      : null;
    return { property, contract, relevant, variant: toStatusVariant(relevant) };
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button asChild>
          <Link href="/dashboard/properties/new">Cadastrar imóvel</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
        {rows.map(({ property, contract, relevant, variant }) => (
          <PropertyCard
            key={property.id}
            href={`/dashboard/properties/${property.id}/edit`}
            label={property.label}
            address={`${property.addressCity}/${property.addressState}`}
            tenantName={contract?.tenant.name}
            rentValue={Number(relevant?.amount ?? contract?.rentValue ?? 0)}
            status={variant}
            statusLabel={STATUS_LABEL_PT[variant]}
          />
        ))}
      </div>

      <div className="hidden lg:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Imóvel</TableHead>
              <TableHead>Endereço</TableHead>
              <TableHead>Inquilino</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Situação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(({ property, contract, relevant, variant }) => (
              <TableRow key={property.id}>
                <TableCell>{property.label}</TableCell>
                <TableCell>
                  {property.addressStreet}, {property.addressNumber} - {property.addressCity}/
                  {property.addressState}
                </TableCell>
                <TableCell>{contract?.tenant.name ?? '—'}</TableCell>
                <TableCell className="tabular-nums">
                  {formatCurrency(Number(relevant?.amount ?? contract?.rentValue ?? 0))}
                </TableCell>
                <TableCell>{STATUS_LABEL_PT[variant]}</TableCell>
                <TableCell className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/properties/${property.id}/edit`}>Editar</Link>
                  </Button>
                  <DeletePropertyButton propertyId={property.id} label={property.label} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
