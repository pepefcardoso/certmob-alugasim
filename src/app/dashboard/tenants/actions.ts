'use server';

import { revalidatePath } from 'next/cache';
import { requireSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { tenantSchema, type TenantInput } from '@/lib/validations/tenant';

function normalize(data: TenantInput) {
  return {
    ...data,
    document: data.document || null,
    phone: data.phone || null,
  };
}

export async function createTenant(input: TenantInput) {
  const session = await requireSession();
  const data = normalize(tenantSchema.parse(input));

  await prisma.tenant.create({
    data: { ...data, ownerId: session.user.id },
  });

  revalidatePath('/dashboard/tenants');
}

export async function updateTenant(id: string, input: TenantInput) {
  const session = await requireSession();
  const data = normalize(tenantSchema.parse(input));

  const result = await prisma.tenant.updateMany({
    where: { id, ownerId: session.user.id },
    data,
  });

  if (result.count === 0) {
    throw new Error('Locatário não encontrado');
  }

  revalidatePath('/dashboard/tenants');
}

export async function deleteTenant(id: string) {
  const session = await requireSession();

  const tenant = await prisma.tenant.findFirst({
    where: { id, ownerId: session.user.id },
    include: { _count: { select: { contracts: true } } },
  });

  if (!tenant) {
    return { error: 'Locatário não encontrado' };
  }

  if (tenant._count.contracts > 0) {
    return { error: 'Não é possível excluir: há contratos vinculados a este locatário.' };
  }

  await prisma.tenant.delete({ where: { id } });
  revalidatePath('/dashboard/tenants');

  return { success: true as const };
}
