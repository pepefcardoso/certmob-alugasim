import { Card, CardContent } from '@/components/ui/card';

export function TrustSection() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-14">
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
              <div className="bg-primary text-primary-foreground font-heading flex size-11 shrink-0 items-center justify-center rounded-full font-medium">
                RE
              </div>
              <div>
                <p className="font-heading font-medium">Nota do fundador</p>
                <p className="text-muted-foreground text-xs">RentEasy</p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Estou construindo o RentEasy porque vi minha própria família perder reajuste atrás de
              reajuste numa planilha esquecida. Ainda somos recentes no mercado — por isso mostramos
              a matemática aberta, sem prometer nada que não fazemos hoje.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
