// TODO(legal review): draft only, per AGENTS.md — have a lawyer sign off before shipping.
export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 p-6">
      <h1 className="text-2xl font-semibold">Termos de Uso</h1>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">1. Objeto</h2>
        <p>
          O RentEasy é uma plataforma de gestão de locações residenciais para locadores PF/PJ,
          cobrindo cadastro de imóveis, locatários, contratos, reajustes e pagamentos.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">2. Papéis quanto a dados pessoais</h2>
        <p>
          O RentEasy atua como <strong>operador</strong> dos dados de locatários inseridos pelo
          locador; o <strong>locador é controlador</strong> desses dados e responsável por sua
          exatidão e pela base legal para tratá-los.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">3. Cadastro e conta</h2>
        <p>
          O usuário é responsável por manter suas credenciais em sigilo e pela veracidade dos dados
          informados no cadastro.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">4. Responsabilidades do locador</h2>
        <p>
          Cumprir a Lei do Inquilinato (Lei 8.245/91), incluindo periodicidade de reajuste, vistoria
          e demais obrigações contratuais junto ao locatário.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">5. Limitação de responsabilidade</h2>
        <p>
          O RentEasy fornece ferramentas de gestão e cálculo, mas não é parte no contrato de locação
          nem garante o cumprimento das obrigações entre locador e locatário.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">6. Alterações</h2>
        <p>Estes termos podem ser atualizados; a versão vigente está sempre disponível aqui.</p>
      </section>
    </div>
  );
}
