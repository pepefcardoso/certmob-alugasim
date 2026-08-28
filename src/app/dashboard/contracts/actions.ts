'use server';

import { revalidatePath } from 'next/cache';
import { requireSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { contractSchema, type ContractInput } from '@/lib/validations/contract';

export async function createContract(input: ContractInput) {
  const session = await requireSession();
  const data = contractSchema.parse(input);

  const [property, tenant] = await Promise.all([
    prisma.property.findFirst({ where: { id: data.propertyId, ownerId: session.user.id } }),
    prisma.tenant.findFirst({ where: { id: data.tenantId, ownerId: session.user.id } }),
  ]);

  if (!property) throw new Error('Imóvel não encontrado');
  if (!tenant) throw new Error('Locatário não encontrado');

  await prisma.contract.create({
    data: {
      propertyId: data.propertyId,
      tenantId: data.tenantId,
      ownerId: session.user.id,
      rentValue: data.rentValue,
      adjustmentIndex: data.adjustmentIndex,
      baseDate: data.baseDate,
      startDate: data.startDate,
      endDate: data.endDate ?? null,
    },
  });

  revalidatePath('/dashboard/contracts');
}
