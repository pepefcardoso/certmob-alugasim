'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarCheck2, Users } from 'lucide-react';
import { captureLead } from '@/components/landing/actions';
import { leadSchema, type LeadInput } from '@/lib/validations/lead';
import { Card, CardContent } from '@/components/ui/card';
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
import { FOUNDER_SPOTS_REMAINING } from './constants';
import { useRouter } from 'next/router';

const URGENCY = [
  {
    icon: Users,
    text: 'Vagas limitadas nesta turma de onboarding: atendimento pessoal por vídeo para configurar seus contratos.',
  },
  {
    icon: CalendarCheck2,
    text: 'Reajustes de IGP-M/IPCA/INPC são anuais, no aniversário do contrato. Cada mês de atraso é dinheiro perdido.',
  },
];

export function LeadCaptureSection() {
  const router = useRouter();
  const form = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: { whatsapp: '', propertyCount: '1' },
  });

  async function onSubmit(values: LeadInput) {
    try {
      await captureLead(values, 'landing_final_cta');
      router.push('/obrigado');
    } catch {
      form.setError('root', { message: 'Não deu pra enviar agora — tenta de novo em instantes.' });
    }
  }

  return (
    <section id="lead-magnet" className="mx-auto max-w-2xl px-4 py-14">
      <div className="space-y-2 text-center">
        <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
          Restam {FOUNDER_SPOTS_REMAINING} vagas do preço de fundador — R$50/mês para sempre
        </h2>
        <p className="text-muted-foreground">Depois desse lote, o preço sobe para R$79/mês.</p>
      </div>

      <ul className="mt-6 space-y-2">
        {URGENCY.map(({ icon: Icon, text }) => (
          <li key={text} className="text-muted-foreground flex items-start gap-2 text-sm">
            <Icon className="mt-0.5 size-4 shrink-0" />
            {text}
          </li>
        ))}
      </ul>

      <Card className="mt-8">
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp</FormLabel>
                    <FormControl>
                      <Input placeholder="(47) 99999-8888" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="propertyCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantos imóveis você aluga?</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.formState.errors.root && (
                <p className="text-destructive text-sm">{form.formState.errors.root.message}</p>
              )}
              <Button
                type="submit"
                size="lg"
                className="w-full"
                loading={form.formState.isSubmitting}
              >
                Calcular meu reajuste grátis
              </Button>
              <p className="text-muted-foreground text-center text-xs">
                Sem spam. Seus dados estão protegidos pela LGPD.
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
}
