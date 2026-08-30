'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { updateContract } from './actions';
import { contractUpdateSchema, type ContractUpdateInput } from '@/lib/validations/contract';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Combobox, type ComboboxOption } from '@/components/ui/combobox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const ADJUSTMENT_INDEX_OPTIONS = [
  { value: 'IGPM', label: 'IGP-M' },
  { value: 'IPCA', label: 'IPCA' },
  { value: 'INPC', label: 'INPC' },
] as const;

export function ContractEditForm({
  contractId,
  properties,
  tenants,
  defaultValues,
}: {
  contractId: string;
  properties: ComboboxOption[];
  tenants: ComboboxOption[];
  defaultValues: ContractUpdateInput;
}) {
  const router = useRouter();
  const form = useForm<ContractUpdateInput>({
    resolver: zodResolver(contractUpdateSchema),
    defaultValues,
  });

  async function onSubmit(values: ContractUpdateInput) {
    try {
      await updateContract(contractId, values);
      toast.success('Contrato atualizado');
      router.push(`/dashboard/contracts/${contractId}`);
    } catch {
      toast.error('Erro ao atualizar contrato');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="propertyId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imóvel</FormLabel>
              <FormControl>
                <Combobox
                  options={properties}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Selecione um imóvel"
                  searchPlaceholder="Buscar imóvel..."
                  emptyText="Nenhum imóvel encontrado."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tenantId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Locatário</FormLabel>
              <FormControl>
                <Combobox
                  options={tenants}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Selecione um locatário"
                  searchPlaceholder="Buscar locatário..."
                  emptyText="Nenhum locatário encontrado."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="adjustmentIndex"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Índice de reajuste</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ADJUSTMENT_INDEX_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="baseDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data base</FormLabel>
                <FormControl>
                  <DatePicker value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de início</FormLabel>
                <FormControl>
                  <DatePicker value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de término</FormLabel>
                <FormControl>
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Opcional"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          Salvar
        </Button>
      </form>
    </Form>
  );
}
