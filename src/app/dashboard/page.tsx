import { requireSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Wallet, Clock3, AlertTriangle } from 'lucide-react';
import { FinancialSummaryCard } from '@/components/domain/financial-summary-card';
import { PropertyCard } from '@/components/domain/property-card';
import { EmptyState } from '@/components/domain/empty-state';
import { toStatusVariant, STATUS_LABEL_PT, STATUS_PRIORITY } from '@/lib/payment-status';

function greeting(hour: number) {
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

export default async function DashboardPage() {
  const session = await requireSession();

  const contracts = await prisma.contract.findMany({
    where: { ownerId: session.user.id, status: 'ACTIVE' },
    include: {
      property: true,
      tenant: true,
      payments: { orderBy: { dueDate: 'asc' } },
    },
  });

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const in3Days = new Date(now.getTime() + 3 * 86_400_000);

  const payments = contracts.flatMap((contract) => contract.payments);

  const receivedTotal = payments
    .filter(
      (p) => p.status === 'PAID' && p.paidAt && p.paidAt >= startOfMonth && p.paidAt < endOfMonth,
    )
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const pending = payments.filter((p) => p.status === 'UPCOMING');
  const pendingTotal = pending.reduce((sum, p) => sum + Number(p.amount), 0);

  const late = payments.filter((p) => p.status === 'LATE');
  const lateTotal = late.reduce((sum, p) => sum + Number(p.amount), 0);

  const dueSoonCount = pending.filter((p) => p.dueDate <= in3Days).length;
  const periodLabel = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(
    now,
  );

  const cards = contracts
    .map((contract) => {
      const relevant =
        contract.payments.find((p) => p.status !== 'PAID') ?? contract.payments.at(-1) ?? null;
      return { contract, relevant, variant: toStatusVariant(relevant) };
    })
    .sort((a, b) => STATUS_PRIORITY[a.variant] - STATUS_PRIORITY[b.variant]);

  return (
    <div className="space-y-6">
      <h1 className="text-heading-1">
        {greeting(now.getHours())}, {session.user.name?.split(' ')[0] ?? ''}
      </h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <FinancialSummaryCard
          label="Recebido"
          value={receivedTotal}
          period={periodLabel}
          icon={Wallet}
          tone="success"
        />
        <FinancialSummaryCard
          label="Pendente"
          value={pendingTotal}
          period={periodLabel}
          icon={Clock3}
          tone="warning"
        />
        <FinancialSummaryCard
          label="Em atraso"
          value={lateTotal}
          period={periodLabel}
          icon={AlertTriangle}
          tone="danger"
        />
      </div>

      {(late.length > 0 || dueSoonCount > 0) && (
        <div className="border-warning-100 bg-warning-100/60 space-y-1 rounded-xl border p-4">
          <p className="text-heading-3">Ações necessárias</p>
          {late.length > 0 && (
            <p className="text-body-sm text-neutral-700">
              {late.length}{' '}
              {late.length === 1 ? 'pagamento atrasado precisa' : 'pagamentos atrasados precisam'}{' '}
              de atenção
            </p>
          )}
          {dueSoonCount > 0 && (
            <p className="text-body-sm text-neutral-700">
              {dueSoonCount} {dueSoonCount === 1 ? 'recebimento vence' : 'recebimentos vencem'} nos
              próximos 3 dias
            </p>
          )}
        </div>
      )}

      {cards.length === 0 ? (
        <EmptyState
          title="Nenhum contrato ativo"
          description="Cadastre um imóvel e um contrato para começar a acompanhar recebimentos."
          action={{ label: 'Cadastrar imóvel', href: '/dashboard/properties/new' }}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map(({ contract, relevant, variant }) => (
            <PropertyCard
              key={contract.id}
              href={`/dashboard/contracts/${contract.id}`}
              label={contract.property.label}
              address={`${contract.property.addressCity}/${contract.property.addressState}`}
              tenantName={contract.tenant.name}
              rentValue={Number(relevant?.amount ?? contract.rentValue)}
              status={variant}
              statusLabel={STATUS_LABEL_PT[variant]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
