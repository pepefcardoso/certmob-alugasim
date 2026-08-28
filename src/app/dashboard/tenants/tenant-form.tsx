'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { createTenant, updateTenant } from './actions';
import { tenantSchema, type TenantInput } from '@/lib/validations/tenant';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

export function TenantForm({
  tenantId,
  defaultValues,
}: {
  tenantId?: string;
  defaultValues?: TenantInput;
}) {
  const router = useRouter();
  const form = useForm<TenantInput>({
    resolver: zodResolver(tenantSchema),
    defaultValues: defaultValues ?? { name: '', document: '', email: '', phone: '' },
  });

  async function onSubmit(values: TenantInput) {
    try {
      if (tenantId) {
        await updateTenant(tenantId, values);
        toast.success('Locatário atualizado');
      } else {
        await createTenant(values);
        toast.success('Locatário cadastrado');
      }
      router.push('/dashboard/tenants');
    } catch {
      toast.error(tenantId ? 'Erro ao atualizar locatário' : 'Erro ao cadastrar locatário');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="document"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          Salvar
        </Button>
      </form>
    </Form>
  );
}
