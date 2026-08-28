import Link from 'next/link';
import { requireSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { PaymentStatus } from '@/generated/prisma/client';

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const dateFmt = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

type CardStatus = 'LATE' | 'UPCOMING' | 'PAID';

const STATUS_ORDER: Record<CardStatus, number> = { LATE: 0, UPCOMING: 1, PAID: 2 };

const STATUS_STYLE: Record<CardStatus, { label: string; badge: string; border: string }> = {
  LATE: {
    label: 'Atrasado',
    badge: 'bg-red-100 text-red-700',
    border: 'border-l-4 border-l-red-500',
  },
  UPCOMING: {
    label: 'A vencer',
    badge: 'bg-yellow-100 text-yellow-700',
    border: 'border-l-4 border-l-yellow-500',
  },
  PAID: {
    label: 'Pago',
    badge: 'bg-green-100 text-green-700',
    border: 'border-l-4 border-l-green-500',
  },
};

function deriveStatus(statuses: PaymentStatus[]): CardStatus {
  if (statuses.length === 0) return 'PAID';
  if (statuses.includes('LATE')) return 'LATE';
  if (statuses.includes('UPCOMING')) return 'UPCOMING';
  return 'PAID';
}

export default async function DashboardPage() {
  const session = await requireSession();

  const contracts = await prisma.contract.findMany({
    where: { ownerId: session.user.id, status: 'ACTIVE' },
    include: {
      property: true,
      tenant: true,
      payments: {
        select: { status: true, dueDate: true, amount: true },
        orderBy: { dueDate: 'asc' },
      },
    },
  });

  const cards = contracts
    .map((contract) => {
      const cardStatus = deriveStatus(contract.payments.map((p) => p.status));
      // representative payment: earliest non-PAID, else most recent PAID
      const relevant =
        contract.payments.find((p) => p.status !== 'PAID') ?? contract.payments.at(-1) ?? null;
      return { contract, cardStatus, relevant };
    })
    .sort((a, b) => STATUS_ORDER[a.cardStatus] - STATUS_ORDER[b.cardStatus]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {cards.length === 0 ? (
        <Card>
          <CardContent className="text-muted-foreground py-12 text-center">
            Nenhum contrato ativo.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(({ contract, cardStatus, relevant }) => {
            const style = STATUS_STYLE[cardStatus];
            return (
              <Link key={contract.id} href={`/dashboard/contracts/${contract.id}`}>
                <Card className={style.border}>
                  <CardHeader className="flex flex-row items-start justify-between">
                    <CardTitle className="text-base">{contract.property.label}</CardTitle>
                    <Badge className={style.badge}>{style.label}</Badge>
                  </CardHeader>
                  <CardContent className="space-y-1 text-sm">
                    <p className="text-muted-foreground">{contract.tenant.name}</p>
                    <p className="font-medium">
                      {currency.format(Number(relevant?.amount ?? contract.rentValue))}
                    </p>
                    {relevant && (
                      <p className="text-muted-foreground">
                        Vencimento: {dateFmt.format(relevant.dueDate)}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
