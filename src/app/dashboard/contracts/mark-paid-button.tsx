'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';
import { markPaymentPaid } from './actions';
import { Button } from '@/components/ui/button';

export function MarkPaidButton({ paymentId }: { paymentId: string }) {
  const [isPending, startTransition] = useTransition();

  function onClick() {
    startTransition(async () => {
      const result = await markPaymentPaid(paymentId);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success('Pagamento marcado como pago');
    });
  }

  return (
    <Button size="sm" variant="outline" onClick={onClick} disabled={isPending}>
      {isPending ? 'Marcando...' : 'Marcar como pago'}
    </Button>
  );
}
