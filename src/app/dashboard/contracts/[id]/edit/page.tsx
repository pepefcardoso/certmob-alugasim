import { notFound } from 'next/navigation';
import { requireSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ContractEditForm } from '../../contract-edit-form';

export default async function EditContractPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireSession();
  const { id } = await params;

  const [contract, properties, tenants] = await Promise.all([
    prisma.contract.findFirst({ where: { id, ownerId: session.user.id } }),
    prisma.property.findMany({
      where: { ownerId: session.user.id },
      select: { id: true, label: true },
      orderBy: { label: 'asc' },
    }),
    prisma.tenant.findMany({
      where: { ownerId: session.user.id },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
  ]);

  if (!contract) notFound();

  return (
    <div className="max-w-md space-y-4">
      <h1 className="text-2xl font-semibold">Editar contrato</h1>
      <ContractEditForm
        contractId={contract.id}
        properties={properties.map((p) => ({ value: p.id, label: p.label }))}
        tenants={tenants.map((t) => ({ value: t.id, label: t.name }))}
        defaultValues={{
          propertyId: contract.propertyId,
          tenantId: contract.tenantId,
          adjustmentIndex: contract.adjustmentIndex,
          baseDate: contract.baseDate,
          startDate: contract.startDate,
          endDate: contract.endDate ?? undefined,
        }}
      />
    </div>
  );
}
