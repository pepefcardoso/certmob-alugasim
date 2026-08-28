'use server';

import { revalidatePath } from 'next/cache';
import { requireSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { propertySchema, type PropertyInput } from '@/lib/validations/property';

function normalize(data: PropertyInput) {
  return {
    ...data,
    addressComplement: data.addressComplement || null,
    addressState: data.addressState.toUpperCase(),
    addressZip: data.addressZip.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, '$1-$2'),
  };
}

export async function createProperty(input: PropertyInput) {
  const session = await requireSession();
  const data = normalize(propertySchema.parse(input));

  await prisma.property.create({
    data: { ...data, ownerId: session.user.id },
  });

  revalidatePath('/dashboard/properties');
}

export async function updateProperty(id: string, input: PropertyInput) {
  const session = await requireSession();
  const data = normalize(propertySchema.parse(input));

  const result = await prisma.property.updateMany({
    where: { id, ownerId: session.user.id },
    data,
  });

  if (result.count === 0) {
    throw new Error('Imóvel não encontrado');
  }

  revalidatePath('/dashboard/properties');
}

export async function deleteProperty(id: string) {
  const session = await requireSession();

  const property = await prisma.property.findFirst({
    where: { id, ownerId: session.user.id },
    include: { _count: { select: { contracts: true } } },
  });

  if (!property) {
    return { error: 'Imóvel não encontrado' };
  }

  if (property._count.contracts > 0) {
    return { error: 'Não é possível excluir: há contratos vinculados a este imóvel.' };
  }

  await prisma.property.delete({ where: { id } });
  revalidatePath('/dashboard/properties');

  return { success: true as const };
}
