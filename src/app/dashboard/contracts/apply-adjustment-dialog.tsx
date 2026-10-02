'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { applyAdjustment, previewAdjustment } from './actions';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AdjustmentPreview } from '@/components/domain/adjustment-preview';

type Preview = Awaited<ReturnType<typeof previewAdjustment>>;

export function ApplyAdjustmentDialog({
  contractId,
  eligible,
}: {
  contractId: string;
  eligible: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [isPending, startTransition] = useTransition();

  function onOpenChange(next: boolean) {
    setOpen(next);
    if (!next) return;

    setPreview(null);
    startTransition(async () => {
      try {
        setPreview(await previewAdjustment(contractId));
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Erro ao calcular reajuste');
        setOpen(false);
      }
    });
  }

  function onConfirm() {
    startTransition(async () => {
      try {
        await applyAdjustment(contractId);
        toast.success('Reajuste aplicado');
        setOpen(false);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Erro ao aplicar reajuste');
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button disabled={!eligible}>Aplicar reajuste</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Aplicar reajuste</DialogTitle>
          <DialogDescription>Confira os valores antes de confirmar.</DialogDescription>
        </DialogHeader>
        {preview ? (
          <AdjustmentPreview {...preview} />
        ) : (
          <p className="text-muted-foreground text-sm">Calculando...</p>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={onConfirm} disabled={isPending || !preview}>
            {isPending ? 'Aplicando...' : 'Confirmar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
