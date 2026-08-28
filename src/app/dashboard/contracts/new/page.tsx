import { requireSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ContractForm } from '../contract-form';

export default async function NewContractPage() {
  const session = await requireSession();

  const [properties, tenants] = await Promise.all([
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

  return (
    <div className="max-w-md space-y-4">
      <h1 className="text-2xl font-semibold">Novo contrato</h1>
      <ContractForm
        properties={properties.map((p) => ({ value: p.id, label: p.label }))}
        tenants={tenants.map((t) => ({ value: t.id, label: t.name }))}
      />
    </div>
  );
}
