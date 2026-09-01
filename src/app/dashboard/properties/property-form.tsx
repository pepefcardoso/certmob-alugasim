'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { createProperty, updateProperty } from './actions';
import { propertySchema, type PropertyInput } from '@/lib/validations/property';
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

export function PropertyForm({
  propertyId,
  defaultValues,
}: {
  propertyId?: string;
  defaultValues?: PropertyInput;
}) {
  const router = useRouter();
  const form = useForm<PropertyInput>({
    resolver: zodResolver(propertySchema),
    defaultValues: defaultValues ?? {
      label: '',
      addressStreet: '',
      addressNumber: '',
      addressComplement: '',
      addressNeighborhood: '',
      addressCity: '',
      addressState: '',
      addressZip: '',
    },
  });

  async function onSubmit(values: PropertyInput) {
    try {
      if (propertyId) {
        await updateProperty(propertyId, values);
        toast.success('Imóvel atualizado');
      } else {
        await createProperty(values);
        toast.success('Imóvel cadastrado');
      }
      router.push('/dashboard/properties');
    } catch {
      toast.error(propertyId ? 'Erro ao atualizar imóvel' : 'Erro ao cadastrar imóvel');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do imóvel</FormLabel>
              <FormControl>
                <Input placeholder="Apartamento Centro" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="addressStreet"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Rua</FormLabel>
                <FormControl>
                  <Input placeholder="Rua das Flores" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="addressNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número</FormLabel>
                <FormControl>
                  <Input placeholder="123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="addressComplement"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Complemento</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="addressNeighborhood"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bairro</FormLabel>
              <FormControl>
                <Input placeholder="Centro" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="addressCity"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Cidade</FormLabel>
                <FormControl>
                  <Input placeholder="Florianópolis" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="addressState"
            render={({ field }) => (
              <FormItem>
                <FormLabel>UF</FormLabel>
                <FormControl>
                  <Input placeholder="SC" maxLength={2} className="uppercase" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="addressZip"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CEP</FormLabel>
              <FormControl>
                <Input placeholder="00000-000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" loading={form.formState.isSubmitting} size="lg">
            Salvar imóvel
          </Button>
        </div>
      </form>
    </Form>
  );
}
