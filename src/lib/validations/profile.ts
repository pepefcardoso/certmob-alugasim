import { z } from 'zod';

export const profileSchema = z.object({
  name: z.string().min(2, 'Nome muito curto'),
  personType: z.enum(['PF', 'PJ']),
  document: z.string().min(11, 'Documento inválido'),
});

export type ProfileInput = z.infer<typeof profileSchema>;
