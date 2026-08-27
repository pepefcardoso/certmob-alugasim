'use server';

import { revalidatePath } from 'next/cache';
import { requireSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { profileSchema, type ProfileInput } from '@/lib/validations/profile';

export async function updateProfile(input: ProfileInput) {
  const session = await requireSession();
  const data = profileSchema.parse(input);

  await prisma.user.update({
    where: { id: session.user.id },
    data,
  });

  revalidatePath('/dashboard/profile');
}
