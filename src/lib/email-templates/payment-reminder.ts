import type { Prisma } from '@/generated/prisma/client';

type PaymentReminderInput = {
  tenantName: string;
  propertyAddress: string;
  amount: Prisma.Decimal | number | string;
  dueDate: Date;
};

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const dateFmt = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

export function paymentReminderHtml({
  tenantName,
  propertyAddress,
  amount,
  dueDate,
}: PaymentReminderInput): string {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #1a1a1a;">
      <h2 style="margin-bottom: 8px;">Lembrete de pagamento</h2>
      <p>Olá, ${tenantName},</p>
      <p>Este é um lembrete de que o pagamento do aluguel do imóvel abaixo está próximo do vencimento:</p>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <tr>
          <td style="padding: 4px 0; color: #666;">Imóvel</td>
          <td style="padding: 4px 0; text-align: right;">${propertyAddress}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #666;">Valor</td>
          <td style="padding: 4px 0; text-align: right; font-weight: bold;">${currency.format(Number(amount))}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #666;">Vencimento</td>
          <td style="padding: 4px 0; text-align: right;">${dateFmt.format(dueDate)}</td>
        </tr>
      </table>
      <p>Por favor, efetue o pagamento até a data indicada para evitar atrasos.</p>
      <p style="color: #999; font-size: 12px; margin-top: 24px;">RentEasy</p>
    </div>
  `;
}
