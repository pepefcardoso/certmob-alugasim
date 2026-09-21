'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';
import { resendReminder } from './actions';
import { Button } from '@/components/ui/button';

export function ResendReminderButton({ paymentId }: { paymentId: string }) {
  const [isPending, startTransition] = useTransition();

  function onClick() {
    startTransition(async () => {
      const result = await resendReminder(paymentId);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success('Lembrete enviado por e-mail');
    });
  }

  return (
    <Button size="sm" variant="ghost" onClick={onClick} disabled={isPending}>
      {isPending ? 'Enviando...' : 'Enviar lembrete'}
    </Button>
  );
}
