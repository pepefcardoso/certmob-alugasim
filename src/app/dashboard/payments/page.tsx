import { requireSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { PaymentStatus } from '@/generated/prisma/client';
import { PaymentCard } from '@/components/domain/payment-card';
import { EmptyState } from '@/components/domain/empty-state';
import { toStatusVariant } from '@/lib/payment-status';
import { PaymentFilters } from './filters';
import { MarkPaidButton } from '../contracts/mark-paid-button';
import { ResendReminderButton } from '../contracts/resend-reminder-button';

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; propertyId?: string; tenantId?: string; period?: string }>;
}) {
  const session = await requireSession();
  const { status, propertyId, tenantId, period } = await searchParams;

  const statusFilter =
    status === 'UPCOMING' || status === 'LATE' || status === 'PAID'
      ? (status as PaymentStatus)
      : undefined;

  const periodMonths = period === '3' || period === '12' ? Number(period) : period === 'all' ? null : 6;
  const periodStart = periodMonths
    ? new Date(new Date().setMonth(new Date().getMonth() - periodMonths))
    : undefined;

  const contracts = await prisma.contract.findMany({
    where: {
      ownerId: session.user.id,
      ...(propertyId && { propertyId }),
      ...(tenantId && { tenantId }),
    },
    include: {
      property: true,
      tenant: true,
      payments: {
        where: { ...(periodStart && { dueDate: { gte: periodStart } }), ...(statusFilter && { status: statusFilter }) },
        orderBy: { dueDate: 'asc' },
      },
    },
  });

  const payments = contracts
    .flatMap((contract) =>
      contract.payments.map((payment) => ({
        payment,
        property: contract.property,
        tenant: contract.tenant,
      })),
    )
    .sort((a, b) => a.payment.dueDate.getTime() - b.payment.dueDate.getTime());

  const [properties, tenants] = await Promise.all([
    prisma.property.findMany({
      where: { ownerId: session.user.id },
      select: { id: true, label: true },
    }),
    prisma.tenant.findMany({
      where: { ownerId: session.user.id },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <div className="space-y-4">
      <h1 className="text-heading-1">Recebimentos</h1>

      <PaymentFilters
        properties={properties.map((p) => ({ value: p.id, label: p.label }))}
        tenants={tenants.map((t) => ({ value: t.id, label: t.name }))}
      />

      {payments.length === 0 ? (
        <EmptyState
          title="Nenhum recebimento encontrado"
          description="Ajuste os filtros ou cadastre um contrato para começar a acompanhar recebimentos."
        />
      ) : (
        <div className="space-y-3">
          {payments.map(({ payment, property, tenant }) => {
            const status = toStatusVariant(payment);
            return (
              <PaymentCard
                key={payment.id}
                propertyLabel={property.label}
                tenantName={tenant.name}
                amount={Number(payment.amount)}
                dueDate={payment.dueDate}
                status={status}
                actions={
                  status !== 'received' ? (
                    <div className="flex gap-1 pt-1">
                      <MarkPaidButton paymentId={payment.id} />
                      <ResendReminderButton paymentId={payment.id} />
                    </div>
                  ) : undefined
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
