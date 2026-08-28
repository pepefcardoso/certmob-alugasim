import { z } from 'zod';

export const propertySchema = z.object({
  label: z.string().min(2, 'Nome muito curto'),
  addressStreet: z.string().min(2, 'Obrigatório'),
  addressNumber: z.string().min(1, 'Obrigatório'),
  addressComplement: z.string().optional(),
  addressNeighborhood: z.string().min(2, 'Obrigatório'),
  addressCity: z.string().min(2, 'Obrigatório'),
  addressState: z
    .string()
    .trim()
    .regex(/^[A-Za-z]{2}$/, 'UF inválida (ex: SC)'),
  addressZip: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido (formato 00000-000)'),
});

export type PropertyInput = z.infer<typeof propertySchema>;
