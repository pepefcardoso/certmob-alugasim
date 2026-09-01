'use client';

import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import { deleteProperty } from './actions';
import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/domain/confirmation-dialog';

export function DeletePropertyButton({ propertyId, label }: { propertyId: string; label: string }) {
  async function handleConfirm() {
    const result = await deleteProperty(propertyId);
    if (result?.error) {
      toast.error(result.error);
      return false;
    }
    toast.success('Imóvel excluído');
  }

  return (
    <ConfirmationDialog
      trigger={
        <Button variant="ghost" size="sm">
          <Trash2 className="size-4" aria-hidden="true" />
          Excluir
        </Button>
      }
      title="Excluir imóvel"
      description={`Excluir "${label}"? Essa ação não poderá ser desfeita.`}
      confirmLabel="Excluir"
      confirmingLabel="Excluindo..."
      onConfirm={handleConfirm}
    />
  );
}
