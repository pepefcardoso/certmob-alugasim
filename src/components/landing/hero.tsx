import { Badge } from '@/components/ui/badge';
import { RentAdjustmentCalculator } from '@/components/landing/rent-adjustment-calculator';

export function Hero() {
  return (
    <section className="mx-auto grid max-w-5xl gap-10 px-4 py-14 lg:grid-cols-2 lg:items-center lg:py-20">
      <div className="space-y-5">
        <Badge variant="secondary">Para donos de 4 a 10 imóveis</Badge>
        <h1 className="text-display">
          Reajuste de aluguel atrasado custa caro.{' '}
          <span className="text-warning-700">Em média, R$200 a R$500 por imóvel ao ano.</span>
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed sm:text-lg">
          Cadastre o contrato uma vez. O Alugasim calcula o reajuste certo na data certa e avisa
          você a tempo de aplicar, sem abrir planilha.
        </p>
      </div>
      <RentAdjustmentCalculator />
    </section>
  );
}
