import { RefreshCw, QrCode, BellRing, ListChecks } from 'lucide-react';

const FEATURES = [
  {
    icon: RefreshCw,
    feature: 'Reajuste automático IGP-M/IPCA/INPC',
    benefit:
      'Nunca mais perca um reajuste — o sistema aplica o índice certo na data certa e gera a nova cobrança sozinho.',
  },
  {
    icon: QrCode,
    feature: 'Cobrança automática',
    benefit: 'O boleto ou Pix sai sozinho todo mês — você só confere se caiu na conta.',
  },
  {
    icon: BellRing,
    feature: 'Lembretes automáticos',
    benefit:
      'Três dias antes do vencimento, seu inquilino já foi avisado — sem você precisar mandar mensagem.',
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
        <h2 className="font-heading text-center text-2xl font-semibold tracking-tight sm:text-3xl">
          O que muda no seu dia a dia
        </h2>
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
