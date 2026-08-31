import { Badge } from '@/components/ui/badge';
import { RentAdjustmentCalculator } from '@/components/landing/rent-adjustment-calculator';

export function Hero() {
  return (
    <section className="mx-auto grid max-w-5xl gap-10 px-4 py-14 lg:grid-cols-2 lg:items-center lg:py-20">
      <div className="space-y-5">
        <Badge variant="secondary">Para donos de 1 a 10 imóveis</Badge>
        <h1 className="font-heading text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
          Você provavelmente esqueceu de reajustar o aluguel este ano.{' '}
          <span className="text-warning-foreground">Isso custa ~R$200–500 por imóvel.</span>
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed sm:text-lg">
          Cadastre o contrato uma vez. O Alugasim calcula o reajuste certo na data certa, gera a
          nova cobrança e cobra o inquilino sozinho.
        </p>
        <p className="text-muted-foreground text-sm">
          Alugo ajuda a registrar contrato. Alugasim avisa quando você está perdendo dinheiro — e
          resolve sozinho.
        </p>
      </div>
      <RentAdjustmentCalculator />
    </section>
  );
}
