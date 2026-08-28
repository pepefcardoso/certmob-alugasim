import { z } from 'zod';

export const tenantSchema = z.object({
  name: z.string().min(2, 'Nome muito curto'),
  document: z.string().optional(),
  email: z.email('E-mail inválido'),
  phone: z.string().optional(),
});

export type TenantInput = z.infer<typeof tenantSchema>;
