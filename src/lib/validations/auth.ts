import { z } from 'zod';

export const signUpSchema = z.object({
  name: z.string().min(2, 'Nome muito curto'),
  email: z.email('E-mail inválido'),
  password: z.string().min(8, 'Mínimo de 8 caracteres'),
  personType: z.enum(['PF', 'PJ']),
  document: z.string().min(11, 'Documento inválido'),
});

export type SignUpInput = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z.email('E-mail inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
});

export type SignInInput = z.infer<typeof signInSchema>;
