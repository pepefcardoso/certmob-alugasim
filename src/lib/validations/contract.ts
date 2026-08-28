import { z } from 'zod';

const contractBaseFields = {
  propertyId: z.string().min(1, 'Selecione um imóvel'),
  tenantId: z.string().min(1, 'Selecione um locatário'),
  adjustmentIndex: z.enum(['IGPM', 'IPCA', 'INPC']),
  baseDate: z.date(),
  startDate: z.date(),
  endDate: z.date().optional(),
};

function endDateAfterStart(data: { startDate: Date; endDate?: Date }) {
  return !data.endDate || data.endDate > data.startDate;
}
const endDateRefinement = { message: 'Data de término deve ser depois da data de início', path: ['endDate'] };

export const contractSchema = z
  .object({ ...contractBaseFields, rentValue: z.coerce.number().positive('Valor deve ser maior que zero') })
  .refine(endDateAfterStart, endDateRefinement);

export const contractUpdateSchema = z.object(contractBaseFields).refine(endDateAfterStart, endDateRefinement);

export type ContractInput = z.infer<typeof contractSchema>;
export type ContractUpdateInput = z.infer<typeof contractUpdateSchema>;