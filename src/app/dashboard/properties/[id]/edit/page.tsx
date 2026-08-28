import { notFound } from 'next/navigation';
import { requireSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PropertyForm } from '../../property-form';

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireSession();
  const { id } = await params;

  const property = await prisma.property.findFirst({
    where: { id, ownerId: session.user.id },
  });

  if (!property) notFound();

  return (
    <div className="max-w-md space-y-4">
      <h1 className="text-2xl font-semibold">Editar imóvel</h1>
      <PropertyForm
        propertyId={property.id}
        defaultValues={{
          label: property.label,
          addressStreet: property.addressStreet,
          addressNumber: property.addressNumber,
          addressComplement: property.addressComplement ?? '',
          addressNeighborhood: property.addressNeighborhood,
          addressCity: property.addressCity,
          addressState: property.addressState,
          addressZip: property.addressZip,
        }}
      />
    </div>
  );
}
