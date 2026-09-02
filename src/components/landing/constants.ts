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

export const FOUNDER_SPOTS_TOTAL = 100;
export const FOUNDER_SPOTS_TAKEN = 53;
export const FOUNDER_SPOTS_REMAINING = FOUNDER_SPOTS_TOTAL - FOUNDER_SPOTS_TAKEN;

export const CALCOM_LINK = process.env.NEXT_PUBLIC_CALCOM_LINK ?? 'alugasim/demo';

export const WHATSAPP_BUSINESS_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER ?? '';