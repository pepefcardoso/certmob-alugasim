import { Card, CardContent } from '@/components/ui/card';
import { CalendarClock, MessageCircleWarning, FolderX } from 'lucide-react';

const PAINS = [
  {
    icon: CalendarClock,
    title: 'Esqueceu o reajuste',
    cost: 'R$200–500/ano perdidos por imóvel',
    description: 'A inflação acumulada some no seu bolso, um contrato de cada vez.',
  },
  {
    icon: MessageCircleWarning,
    title: 'Inquilino atrasa e você não cobra',
    cost: 'Constrangimento vira inadimplência',
    description: 'Cobrar por WhatsApp é sem graça — então muita gente simplesmente não cobra.',
  },
  {
    icon: FolderX,
    title: 'Contrato sumiu numa pasta',
    cost: 'Sem histórico, sem prova em disputa',
    description: 'PDF perdido no e-mail ou papel amarelado na gaveta.',
  },
];

export function PainCards() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-14">
      <div className="grid gap-4 sm:grid-cols-3">
        {PAINS.map(({ icon: Icon, title, cost, description }) => (
          <Card key={title}>
            <CardContent className="space-y-2">
              <Icon className="text-muted-foreground size-5" />
              <p className="font-heading font-medium">{title}</p>
              <p className="text-warning-700 text-sm font-medium">{cost}</p>
              <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
