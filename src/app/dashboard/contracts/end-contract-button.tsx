'use client';

import { toast } from 'sonner';
import { endContract } from './actions';
import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/domain/confirmation-dialog';

export function EndContractButton({ contractId }: { contractId: string }) {
  async function handleConfirm() {
    const result = await endContract(contractId);
    if (result?.error) {
      toast.error(result.error);
      return false;
    }
    toast.success('Contrato encerrado');
  }

  return (
    <ConfirmationDialog
      trigger={<Button variant="destructive">Encerrar contrato</Button>}
      title="Encerrar contrato"
      description="Tem certeza que deseja encerrar este contrato? A data de término será definida como hoje."
      confirmLabel="Encerrar"
      confirmingLabel="Encerrando..."
      onConfirm={handleConfirm}
    />
  );
}
