import type { AdjustmentIndex } from '@/generated/prisma/client';

export const LEAD_CTA_LABEL = 'Calcular meu reajuste grátis';

export const FALLBACK_RATES: Record<AdjustmentIndex, number> = {
  IGPM: 3.2,
  IPCA: 4.5,
  INPC: 4.7,
};

export const INDEX_LABELS: Record<AdjustmentIndex, string> = {
  IGPM: 'IGP-M',
  IPCA: 'IPCA',
  INPC: 'INPC',
};
