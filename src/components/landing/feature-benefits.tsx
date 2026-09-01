import { RefreshCw, LayoutGrid, BellRing, ListChecks } from 'lucide-react';

const FEATURES = [
  {
    icon: RefreshCw,
    feature: 'Cálculo automático de reajuste (IGP-M/IPCA/INPC)',
    benefit:
      'O sistema calcula o valor certo com a taxa oficial do Banco Central. Você revisa e aplica com um clique, sem montar a conta na mão.',
  },
  {
    icon: LayoutGrid,
    feature: 'Tudo num só painel',
    benefit:
      'Imóveis, inquilinos, contratos e pagamentos organizados num só lugar. Sem planilha, sem pasta de PDF perdida.',
  },
  {
    icon: BellRing,
    feature: 'Lembretes automáticos por e-mail',
    benefit:
      'Três dias antes do vencimento, seu inquilino recebe um lembrete. Sem você precisar mandar mensagem.',
  },
  {
    icon: ListChecks,
    feature: 'Controle de inadimplência',
    benefit: 'Veja quem está atrasado e há quantos dias, sem abrir planilha nenhuma.',
  },
];

export function FeatureBenefits() {
  return (
    <section className="bg-muted/40 py-14">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="text-heading-1 text-center">O que muda no seu dia a dia</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {FEATURES.map(({ icon: Icon, feature, benefit }) => (
            <div key={feature} className="bg-background flex gap-4 rounded-xl p-5 shadow-xs">
              <Icon className="text-primary size-5 shrink-0" />
              <div className="space-y-1">
                <p className="font-heading font-medium">{feature}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">{benefit}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
