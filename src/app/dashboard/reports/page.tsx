import Link from 'next/link';
import { requireSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  computeMonthlyRevenue,
  computeDelinquencyRate,
  lastNMonthKeys,
  monthKey,
} from '@/lib/reports';

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

function formatMonthLabel(key: string): string {
  const [y, m] = key.split('-').map(Number);
  return new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(
    new Date(Date.UTC(y, m - 1, 1)),
  );
}

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const session = await requireSession();
  const { month } = await searchParams;

  const now = new Date();
  const revenueMonths = lastNMonthKeys(12, now);
  const delinquencyMonths = lastNMonthKeys(4, now);
  const earliestMonth = revenueMonths[0];
  const [earliestYear, earliestM] = earliestMonth.split('-').map(Number);
  const rangeStart = new Date(Date.UTC(earliestYear, earliestM - 1, 1));

  const payments = await prisma.payment.findMany({
    where: {
      contract: { ownerId: session.user.id },
      OR: [{ paidAt: { gte: rangeStart } }, { dueDate: { gte: rangeStart } }],
    },
    select: { status: true, paidAt: true, dueDate: true, amount: true },
  });

  const revenueRows = computeMonthlyRevenue(payments, revenueMonths);
  const delinquencyRows = computeDelinquencyRate(payments, delinquencyMonths);

  const exportMonth = month && /^\d{4}-\d{2}$/.test(month) ? month : monthKey(now);

  return (
    <div className="space-y-6">
      <h1 className="text-heading-1">Relatórios</h1>

      <Card>
        <CardHeader>
          <CardTitle>Receita mensal (últimos 12 meses)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="hidden overflow-x-auto lg:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mês</TableHead>
                  <TableHead className="text-right">Total recebido</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {revenueRows.map((row) => (
                  <TableRow key={row.month}>
                    <TableCell className="capitalize">{formatMonthLabel(row.month)}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {currency.format(row.total)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="divide-y lg:hidden">
            {revenueRows.map((row) => (
              <div key={row.month} className="flex items-center justify-between py-2 text-sm">
                <span className="text-neutral-700 capitalize">{formatMonthLabel(row.month)}</span>
                <span className="tabular-nums font-medium">{currency.format(row.total)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Taxa de inadimplência</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="hidden lg:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mês</TableHead>
                  <TableHead className="text-right">Atrasados / Total</TableHead>
                  <TableHead className="text-right">Taxa</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {delinquencyRows.map((row) => (
                  <TableRow key={row.month}>
                    <TableCell className="capitalize">{formatMonthLabel(row.month)}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {row.lateCount} / {row.totalDue}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {row.latePct.toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="divide-y lg:hidden">
            {delinquencyRows.map((row) => (
              <div key={row.month} className="space-y-0.5 py-2 text-sm">
                <p className="text-neutral-700 capitalize">{formatMonthLabel(row.month)}</p>
                <p className="tabular-nums">
                  {row.lateCount} / {row.totalDue} atrasados —{' '}
                  <span className="font-medium">{row.latePct.toFixed(1)}%</span>
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Exportar relatório mensal (CSV)</CardTitle>
        </CardHeader>
        <CardContent>
          <form action="/dashboard/reports" className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" htmlFor="month">
                Mês de referência
              </label>
              <Select name="month" defaultValue={exportMonth}>
                <SelectTrigger id="month" className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {revenueMonths
                    .slice()
                    .reverse()
                    .map((m) => (
                      <SelectItem key={m} value={m}>
                        {formatMonthLabel(m)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" variant="outline">
              Aplicar
            </Button>
            <Button asChild>
              <Link href={`/api/reports/income-export?month=${exportMonth}`}>Baixar CSV</Link>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
