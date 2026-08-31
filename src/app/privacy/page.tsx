// TODO(legal review): draft only, per AGENTS.md — replace [CNPJ]/[endereço]
// and have a lawyer sign off before shipping. Structure follows docs/lgpd.md §8.
import Link from 'next/link';
import { env } from '@/lib/env';

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 p-6">
      <h1 className="text-2xl font-semibold">Política de Privacidade</h1>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">1. Identidade do controlador</h2>
        <p>
          Alugasim Tecnologia Ltda. — CNPJ [CNPJ] — [endereço]. Encarregado de Proteção de Dados
          (DPO): <a href={`mailto:${env.DPO_EMAIL}`}>{env.DPO_EMAIL}</a>.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">2. Dados coletados</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Locador: nome, CPF/CNPJ, e-mail, telefone, dados bancários.</li>
          <li>Locatário: nome, CPF, e-mail, telefone.</li>
          <li>Imóvel: endereço e características cadastradas pelo locador.</li>
          <li>
            Contrato e pagamentos: valores, datas, índice de reajuste, histórico de pagamento.
          </li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">3. Finalidade e base legal</h2>
        <p>
          Os dados são tratados para formalização e gestão de contratos de locação, cobrança,
          repasses e emissão de relatórios, com base na <strong>execução de contrato</strong> (Art.
          7º, V, LGPD).
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">4. Compartilhamento</h2>
        <p>
          Dados podem ser compartilhados com provedores de hospedagem e de envio de e-mail
          estritamente necessários à operação do serviço, sempre como operadores sob instrução do
          Alugasim.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">5. Prazo de retenção</h2>
        <p>Dados de cadastro, contrato e pagamentos: 5 anos após o término do contrato.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">6. Direitos do titular</h2>
        <p>
          Acesso, correção, exclusão e portabilidade podem ser solicitados pela{' '}
          <Link href="/privacy/request" className="underline">
            Central de Privacidade
          </Link>
          . Prazo de resposta: 15 dias (Art. 18, LGPD).
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">7. Segurança</h2>
        <p>Criptografia em trânsito (HTTPS/TLS) e controle de acesso por conta autenticada.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">8. Alterações</h2>
        <p>Esta política pode ser atualizada; a versão vigente está sempre disponível aqui.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">9. Contato</h2>
        <p>
          DPO: <a href={`mailto:${env.DPO_EMAIL}`}>{env.DPO_EMAIL}</a> — ANPD:{' '}
          <a href="https://www.gov.br/anpd/pt-br" target="_blank" rel="noreferrer">
            gov.br/anpd
          </a>
        </p>
      </section>
    </div>
  );
}
