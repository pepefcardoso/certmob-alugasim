import { z } from 'zod';

export const contractSchema = z
  .object({
    propertyId: z.string().min(1, 'Selecione um imóvel'),
    tenantId: z.string().min(1, 'Selecione um locatário'),
    rentValue: z.coerce.number().positive('Valor deve ser maior que zero'),
    adjustmentIndex: z.enum(['IGPM', 'IPCA', 'INPC']),
    baseDate: z.date(),
    startDate: z.date(),
    endDate: z.date().optional(),
  })
  .refine((data) => !data.endDate || data.endDate > data.startDate, {
    message: 'Data de término deve ser depois da data de início',
    path: ['endDate'],
  });

export type ContractInput = z.infer<typeof contractSchema>;
