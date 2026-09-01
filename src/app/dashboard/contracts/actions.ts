'use server';

import { revalidatePath } from 'next/cache';
import { requireSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { contractSchema, type ContractInput } from '@/lib/validations/contract';
import { contractUpdateSchema, type ContractUpdateInput } from '@/lib/validations/contract';
import Decimal from 'decimal.js';
import { isAdjustmentEligible } from '@/lib/adjustment-eligibility';
import { getAccumulated12MonthRate } from '@/lib/rent-index';
import { buildUpcomingPayments } from '@/lib/payment-generation';
import { paymentReminderHtml } from '@/lib/email-templates/payment-reminder';
import { sendEmail } from '@/lib/email';

export async function createContract(input: ContractInput) {
  const session = await requireSession();
  const data = contractSchema.parse(input);

  const [property, tenant] = await Promise.all([
    prisma.property.findFirst({ where: { id: data.propertyId, ownerId: session.user.id } }),
    prisma.tenant.findFirst({ where: { id: data.tenantId, ownerId: session.user.id } }),
  ]);

  if (!property) throw new Error('Imóvel não encontrado');
  if (!tenant) throw new Error('Locatário não encontrado');

  await prisma.$transaction(async (tx) => {
    const contract = await tx.contract.create({
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

    await tx.payment.createMany({
      data: buildUpcomingPayments({
        contractId: contract.id,
        startDate: contract.startDate,
        rentValue: data.rentValue,
        existingCount: 0,
      }),
      skipDuplicates: true,
    });
  });

  revalidatePath('/dashboard/contracts');
}

export async function updateContract(id: string, input: ContractUpdateInput) {
  const session = await requireSession();
  const data = contractUpdateSchema.parse(input);

  const [property, tenant] = await Promise.all([
    prisma.property.findFirst({ where: { id: data.propertyId, ownerId: session.user.id } }),
    prisma.tenant.findFirst({ where: { id: data.tenantId, ownerId: session.user.id } }),
  ]);

  if (!property) throw new Error('Imóvel não encontrado');
  if (!tenant) throw new Error('Locatário não encontrado');

  const result = await prisma.contract.updateMany({
    where: { id, ownerId: session.user.id },
    data: {
      propertyId: data.propertyId,
      tenantId: data.tenantId,
      adjustmentIndex: data.adjustmentIndex,
      baseDate: data.baseDate,
      startDate: data.startDate,
      endDate: data.endDate ?? null,
    },
  });

  if (result.count === 0) throw new Error('Contrato não encontrado');

  revalidatePath('/dashboard/contracts');
  revalidatePath(`/dashboard/contracts/${id}`);
}

export async function endContract(id: string) {
  const session = await requireSession();

  const result = await prisma.contract.updateMany({
    where: { id, ownerId: session.user.id, status: 'ACTIVE' },
    data: { status: 'ENDED', endDate: new Date() },
  });

  if (result.count === 0) {
    return { error: 'Contrato não encontrado ou já encerrado' };
  }

  revalidatePath('/dashboard/contracts');
  revalidatePath(`/dashboard/contracts/${id}`);

  return { success: true as const };
}

async function loadEligibleAdjustment(contractId: string, ownerId: string) {
  const contract = await prisma.contract.findFirst({
    where: { id: contractId, ownerId },
    include: { adjustments: { orderBy: { appliedAt: 'desc' }, take: 1 } },
  });
  if (!contract) throw new Error('Contrato não encontrado');
  if (contract.status !== 'ACTIVE') throw new Error('Contrato não está ativo');

  const lastAdjustmentAt = contract.adjustments[0]?.appliedAt ?? null;
  const eligible = isAdjustmentEligible({ baseDate: contract.baseDate, lastAdjustmentAt });
  if (!eligible) throw new Error('Contrato ainda não é elegível para reajuste');

  const referenceDate = new Date();
  const ratePercent = await getAccumulated12MonthRate(contract.adjustmentIndex, referenceDate);
  const previousValue = new Decimal(contract.rentValue.toString());
  const newValue = previousValue
    .mul(new Decimal(1).plus(new Decimal(ratePercent).div(100)))
    .toDecimalPlaces(2);

  return { contract, ratePercent, previousValue, newValue, referenceDate };
}

export async function previewAdjustment(contractId: string) {
  const session = await requireSession();
  const { contract, ratePercent, previousValue, newValue } = await loadEligibleAdjustment(
    contractId,
    session.user.id,
  );

  return {
    index: contract.adjustmentIndex,
    ratePercent,
    previousValue: previousValue.toNumber(),
    newValue: newValue.toNumber(),
  };
}

export async function applyAdjustment(contractId: string) {
  const session = await requireSession();
  const { contract, ratePercent, previousValue, newValue, referenceDate } =
    await loadEligibleAdjustment(contractId, session.user.id);

  await prisma.$transaction(async (tx) => {
    await tx.rentAdjustment.create({
      data: {
        contractId: contract.id,
        indexUsed: contract.adjustmentIndex,
        indexRatePercent: ratePercent,
        previousValue: previousValue.toNumber(),
        newValue: newValue.toNumber(),
        referenceDate,
      },
    });

    await tx.contract.update({
      where: { id: contract.id },
      data: { rentValue: newValue.toNumber() },
    });

    const existingCount = await tx.payment.count({ where: { contractId: contract.id } });

    await tx.payment.createMany({
      data: buildUpcomingPayments({
        contractId: contract.id,
        startDate: contract.startDate,
        rentValue: newValue.toNumber(),
        existingCount,
      }),
      skipDuplicates: true,
    });
  });

  revalidatePath('/dashboard/contracts');
  revalidatePath(`/dashboard/contracts/${contract.id}`);

  return { success: true as const };
}

export async function markPaymentPaid(paymentId: string) {
  const session = await requireSession();

  const result = await prisma.payment.updateMany({
    where: { id: paymentId, contract: { ownerId: session.user.id } },
    data: { status: 'PAID', paidAt: new Date() },
  });

  if (result.count === 0) {
    return { error: 'Pagamento não encontrado' };
  }

  const payment = await prisma.payment.findUniqueOrThrow({
    where: { id: paymentId },
    select: { contractId: true },
  });

  revalidatePath(`/dashboard/contracts/${payment.contractId}`);
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/payments');

  return { success: true as const };
}

export async function resendReminder(paymentId: string) {
  const session = await requireSession();

  const payment = await prisma.payment.findFirst({
    where: { id: paymentId, contract: { ownerId: session.user.id } },
    include: { contract: { include: { tenant: true, property: true } } },
  });

  if (!payment) return { error: 'Pagamento não encontrado' };

  const { tenant, property } = payment.contract;
  const propertyAddress = `${property.addressStreet}, ${property.addressNumber} - ${property.addressCity}/${property.addressState}`;

  await sendEmail({
    to: tenant.email,
    subject: 'Lembrete de pagamento — Alugasim',
    html: paymentReminderHtml({
      tenantName: tenant.name,
      propertyAddress,
      amount: payment.amount,
      dueDate: payment.dueDate,
    }),
  });

  await prisma.payment.update({
    where: { id: paymentId },
    data: { reminderSentAt: new Date() },
  });

  revalidatePath(`/dashboard/contracts/${payment.contractId}`);
  revalidatePath('/dashboard/payments');

  return { success: true as const };
}