import { formatCurrency } from '@/lib/format';

const percent = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const INDEX_LABEL = { IGPM: 'IGP-M', IPCA: 'IPCA', INPC: 'INPC' } as const;

export type AdjustmentPreviewData = {
  index: keyof typeof INDEX_LABEL;
  ratePercent: number;
  previousValue: number;
  newValue: number;
};

export function AdjustmentPreview({
  index,
  ratePercent,
  previousValue,
  newValue,
}: AdjustmentPreviewData) {
  return (
    <div className="space-y-1 text-sm">
      <p>Aluguel atual: {formatCurrency(previousValue)}</p>
      <p>Índice: {INDEX_LABEL[index]}</p>
      <p>Taxa acumulada (12 meses): {percent.format(ratePercent)}%</p>
      <p className="text-muted-foreground">
        {formatCurrency(previousValue)} × (1 + {percent.format(ratePercent)}%) ={' '}
        {formatCurrency(newValue)}
      </p>
      <p className="font-medium">Novo aluguel: {formatCurrency(newValue)}</p>
    </div>
  );
}
