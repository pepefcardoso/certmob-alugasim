'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const FAQS = [
  {
    q: 'Isso não é só uma planilha melhorada?',
    a: 'Uma planilha só calcula. O Alugasim calcula com a taxa oficial, avisa quando é hora de aplicar o reajuste e manda o lembrete de vencimento sozinho — você não precisa lembrar de abrir nada.',
  },
  {
    q: 'Preciso entender de IGP-M, IPCA e INPC?',
    a: 'Não. Você escolhe o índice do contrato uma vez e o sistema busca a taxa oficial do Banco Central na data certa.',
  },
  {
    q: 'Já tenho contratos ativos, dá pra migrar?',
    a: 'Sim. O cadastro de um contrato existente leva poucos minutos: imóvel, inquilino, valor e data de início.',
  },
  {
    q: 'Meus dados ficam seguros?',
    a: 'Sim, seguimos a LGPD. Você pode solicitar acesso, correção ou exclusão dos seus dados a qualquer momento.',
  },
  {
    q: 'Posso cancelar quando quiser?',
    a: 'Sim, sem fidelidade e sem multa.',
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-2xl px-4 py-14">
      <h2 className="text-heading-1 text-center">Perguntas frequentes</h2>
      <div className="mt-8 divide-y">
        {FAQS.map((item, i) => (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
              className="flex w-full items-center justify-between gap-4 py-4 text-left"
            >
              <span className="font-heading font-medium">{item.q}</span>
              <ChevronDown
                className={cn(
                  'text-muted-foreground size-4 shrink-0 transition-transform',
                  open === i && 'rotate-180',
                )}
              />
            </button>
            {open === i && (
              <p className="text-muted-foreground pb-4 text-sm leading-relaxed">{item.a}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
