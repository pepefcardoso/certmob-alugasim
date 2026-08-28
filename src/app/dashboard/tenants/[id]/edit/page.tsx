import { notFound } from 'next/navigation';
import { requireSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { TenantForm } from '../../tenant-form';

export default async function EditTenantPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireSession();
  const { id } = await params;

  const tenant = await prisma.tenant.findFirst({
    where: { id, ownerId: session.user.id },
  });

  if (!tenant) notFound();

  return (
    <div className="max-w-md space-y-4">
      <h1 className="text-2xl font-semibold">Editar locatário</h1>
      <TenantForm
        tenantId={tenant.id}
        defaultValues={{
          name: tenant.name,
          document: tenant.document ?? '',
          email: tenant.email,
          phone: tenant.phone ?? '',
        }}
      />
    </div>
  );
}
