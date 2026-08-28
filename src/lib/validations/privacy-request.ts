import { z } from 'zod';

export const privacyRequestSchema = z.object({
  type: z.enum(['ACCESS', 'CORRECTION', 'DELETION', 'PORTABILITY']),
  details: z.string().max(2000).optional(),
});

export type PrivacyRequestInput = z.infer<typeof privacyRequestSchema>;
