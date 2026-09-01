import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Landmark, ShieldCheck, BadgeCheck } from 'lucide-react';
import Image from 'next/image';

const TRUST_BADGES = [
  { icon: Landmark, label: 'Cálculo baseado em dados do Banco Central' },
  { icon: ShieldCheck, label: 'LGPD compliant' },
  // TODO: confirmar tempo/área real de experiência do fundador antes de publicar
  { icon: BadgeCheck, label: 'Fundador com 4 anos de experiência em finanças' },
];

export function TrustSection() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-14">
      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {TRUST_BADGES.map(({ icon: Icon, label }) => (
          <Badge key={label} variant="outline" className="h-auto gap-1.5 px-3 py-1.5 text-xs">
            <Icon className="size-3.5" />
            {label}
          </Badge>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="space-y-3">
            <p className="font-heading font-medium">Como calculamos</p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Novo aluguel = aluguel atual × (1 + índice acumulado em 12 meses). Os índices (IGP-M,
              IPCA, INPC) vêm direto do Sistema Gerenciador de Séries Temporais do Banco Central — a
              mesma fonte oficial usada em contratos de locação.
            </p>
            <p className="bg-muted/50 rounded-md p-3 font-mono text-sm">
              novo_aluguel = aluguel_atual × (1 + índice / 100)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <Image
                src="/img/founder.jpg"
                alt="Fundador do Alugasim"
                width={44}
                height={44}
                className="size-11 shrink-0 rounded-full object-cover"
              />
              <div>
                <p className="font-heading font-medium">Nota do fundador</p>
                <p className="text-muted-foreground text-xs">Alugasim</p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Estou construindo o Alugasim porque vi minha própria família perder reajuste atrás de
              reajuste numa planilha esquecida. Ainda somos recentes no mercado — por isso mostramos
              a matemática aberta, sem prometer nada que não fazemos hoje.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}