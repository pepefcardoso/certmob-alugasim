import type { PaymentStatusVariant } from '@/components/domain/status-badge';

const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

export function formatCurrency(value: number | string) {
  return currencyFormatter.format(Number(value));
}

export function formatDate(date: Date | string) {
  return dateFormatter.format(new Date(date));
}

export function relativeDueLabel(dueDate: Date, status: PaymentStatusVariant): string {
  const days = Math.round((dueDate.getTime() - Date.now()) / 86_400_000);

  if (status === 'received') return `Recebido em ${formatDate(dueDate)}`;
  if (status === 'overdue') {
    const late = Math.abs(days);
    return `Atrasado há ${late} ${late === 1 ? 'dia' : 'dias'}`;
  }
  if (days <= 0) return 'Vence hoje';
  if (days === 1) return 'Vence amanhã';
  if (days <= 7) return `Vence em ${days} dias`;
  return `Vencimento: ${formatDate(dueDate)}`;
}
