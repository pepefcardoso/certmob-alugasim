import { z } from 'zod';

export const leadSchema = z.object({
  whatsapp: z.string().trim().min(10, 'DDD + número (ex: 47999998888)'),
  propertyCount: z
    .string()
    .trim()
    .regex(/^\d+$/, 'Use apenas números')
    .refine((value) => Number(value) >= 1 && Number(value) <= 999, 'Informe entre 1 e 999 imóveis'),
});

export type LeadInput = z.infer<typeof leadSchema>;
