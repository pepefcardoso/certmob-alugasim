'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { createPrivacyRequest } from './actions';
import { privacyRequestSchema, type PrivacyRequestInput } from '@/lib/validations/privacy-request';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const typeOptions = [
  { value: 'ACCESS', label: 'Acesso aos meus dados' },
  { value: 'CORRECTION', label: 'Correção de dados' },
  { value: 'DELETION', label: 'Exclusão de dados' },
  { value: 'PORTABILITY', label: 'Portabilidade de dados' },
] as const;

export function PrivacyRequestForm() {
  const form = useForm<PrivacyRequestInput>({
    resolver: zodResolver(privacyRequestSchema),
    defaultValues: { type: 'ACCESS', details: '' },
  });

  async function onSubmit(values: PrivacyRequestInput) {
    try {
      await createPrivacyRequest(values);
      toast.success('Solicitação enviada. Responderemos em até 15 dias.');
      form.reset();
    } catch {
      toast.error('Erro ao enviar solicitação');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de solicitação</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {typeOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="details"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Detalhes (opcional)</FormLabel>
              <FormControl>
                <Textarea rows={5} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          Enviar solicitação
        </Button>
      </form>
    </Form>
  );
}
