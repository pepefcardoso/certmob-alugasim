import { Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FOUNDER_SPOTS_REMAINING, LEAD_CTA_LABEL } from '@/components/landing/constants';

const INCLUDED = [
  'Imóveis, inquilinos e contratos ilimitados',
  'Reajuste automático (IGP-M/IPCA/INPC)',
  'Cobrança e lembretes automáticos',
  'Painel de inadimplência',
];

export function Pricing() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-14 text-center">
      <h2 className="text-heading-1">
        Perder um reajuste de 10% num aluguel de R$2.000 custa{' '}
        <span className="text-warning-700">R$200/ano</span>.
      </h2>
      <p className="text-muted-foreground mt-2">
        O Alugasim custa a partir de R$50/mês — e evita isso automaticamente, em todos os seus
        imóveis.
      </p>

      <Card className="mx-auto mt-8 max-w-sm text-left">
        <CardContent className="space-y-4">
          <Badge variant="secondary">Preço de fundador</Badge>
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-4xl font-semibold tracking-tight">R$50</span>
            <span className="text-muted-foreground text-sm">/mês, para sempre</span>
          </div>
          <p className="text-muted-foreground text-sm line-through">R$79/mês depois</p>
          <ul className="space-y-2">
            {INCLUDED.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <Check className="text-primary mt-0.5 size-4 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <Button asChild size="lg" className="w-full">
            <a href="#lead-magnet">{LEAD_CTA_LABEL}</a>
          </Button>
          <p className="text-muted-foreground text-center text-xs">
            Restam {FOUNDER_SPOTS_REMAINING} vagas do preço de fundador.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
