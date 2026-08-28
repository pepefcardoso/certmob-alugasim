import { FileSignature, RefreshCw, Wallet } from 'lucide-react';

const STEPS = [
  {
    icon: FileSignature,
    title: 'Cadastre',
    description: 'Imóvel, inquilino, valor e índice de reajuste. Menos de 5 minutos.',
  },
  {
    icon: RefreshCw,
    title: 'Sistema calcula e cobra',
    description: 'Reajuste automático na data certa. Cobrança gerada e enviada sozinha.',
  },
  {
    icon: Wallet,
    title: 'Você recebe',
    description: 'Acompanhe pagamentos e atrasos num painel único, sem planilha.',
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-14">
      <h2 className="font-heading text-center text-2xl font-semibold tracking-tight sm:text-3xl">
        Simples assim
      </h2>
      <div className="mt-10 grid gap-8 sm:grid-cols-3">
        {STEPS.map(({ icon: Icon, title, description }, i) => (
          <div key={title} className="space-y-2 text-center">
            <div className="bg-primary text-primary-foreground mx-auto flex size-11 items-center justify-center rounded-full">
              <Icon className="size-5" />
            </div>
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Passo {i + 1}
            </p>
            <p className="font-heading font-medium">{title}</p>
            <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
