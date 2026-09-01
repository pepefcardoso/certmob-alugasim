import { Check, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const FOR_YOU = ['Donos de 4 a 10 imóveis', 'Quem usa planilha ou caderno', 'Quer automatizar reajustes'];

const NOT_FOR_YOU = [
  'Grandes imobiliárias',
  'Quem já usa software completo',
  'Quem não cobra aluguel',
];

export function FitSection() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-14">
      <h2 className="text-heading-1 text-center">Pra quem é (e pra quem não é)</h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="space-y-3">
            <p className="font-heading font-medium">Pra quem é</p>
            <ul className="space-y-2">
              {FOR_YOU.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <Check className="text-success-700 mt-0.5 size-4 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3">
            <p className="font-heading font-medium">Pra quem não é</p>
            <ul className="space-y-2">
              {NOT_FOR_YOU.map((item) => (
                <li key={item} className="text-muted-foreground flex items-start gap-2 text-sm">
                  <X className="mt-0.5 size-4 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}