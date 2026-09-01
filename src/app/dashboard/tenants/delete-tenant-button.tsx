'use client';

import { toast } from 'sonner';
import { deleteTenant } from './actions';
import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/domain/confirmation-dialog';

export function DeleteTenantButton({ tenantId, name }: { tenantId: string; name: string }) {
  async function handleConfirm() {
    const result = await deleteTenant(tenantId);
    if (result?.error) {
      toast.error(result.error);
      return false;
    }
    toast.success('Locatário excluído');
  }

  return (
    <ConfirmationDialog
      trigger={
        <Button variant="ghost" size="sm">
          Excluir
        </Button>
      }
      title="Excluir locatário"
      description={`Excluir "${name}"? Essa ação não poderá ser desfeita.`}
      confirmLabel="Excluir"
      confirmingLabel="Excluindo..."
      onConfirm={handleConfirm}
    />
  );
}
