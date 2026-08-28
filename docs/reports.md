## Relatórios Financeiros e Contábeis Essenciais para Gestão de Repasses (RentEasy)

Este documento consolida os **relatórios financeiros e contábeis essenciais** para a gestão de repasses no **RentEasy**, incluindo modelos, indicadores, prazos e implicações fiscais.

---

## 1. Visão Geral: O que é Gestão de Repasses?

**Gestão de repasses** é o processo de:

1. **Receber aluguéis** dos inquilinos (via PIX, boleto, depósito).
2. **Reter taxas e despesas** (taxa de administração, condomínio, IPTU, reparos).
3. **Repassar o saldo** ao proprietário (locador).
4. **Prestar contas** com relatórios detalhados.

**Público-alvo do RentEasy**:

- **Locador PF** (1–10 imóveis) que gerencia diretamente (sem imobiliária).
- **Locador PJ** (holding patrimonial) que precisa de relatórios para contabilidade.
- **Pequenas administradoras** (10–100 imóveis) que usam o RentEasy como sistema de gestão.

[terraresidential](https://www.terraresidential.com/blog/what-your-property-management-financial-reports-reveal-about-your-manager)

---

## 2. Relatórios Essenciais para Gestão de Repasses

### 2.1. Relatório de Repasses ao Proprietário (Owner Statement)

**Finalidade**: prestar contas ao proprietário sobre tudo que entrou, saiu e foi repassado no período.

**Periodicidade**: **mensal** (até 5 dias úteis após o fechamento do mês).

**Estrutura mínima**:

| Campo                        | Descrição                       | Exemplo                                 |
| ---------------------------- | ------------------------------- | --------------------------------------- |
| **Proprietário**             | Nome, CPF/CNPJ                  | João Silva, CPF 123.456.789-00          |
| **Imóvel**                   | Endereço, matrícula             | Rua X, nº 123, Apt 45 – Matrícula 98765 |
| **Período**                  | Mês/ano de referência           | Agosto/2026                             |
| **Saldo anterior**           | Valor pendente do mês anterior  | R$ 0,00                                 |
| **Entradas**                 |                                 |                                         |
| – Aluguel recebido           | Valor bruto do aluguel          | R$ 3.000,00                             |
| – Multa/juros                | Atrasos pagos pelo inquilino    | R$ 90,00                                |
| – Outros (caução, reembolso) | Valores adicionais              | R$ 0,00                                 |
| **Total de entradas**        | Soma de todas as entradas       | **R$ 3.090,00**                         |
| **Saídas/Descontos**         |                                 |                                         |
| – Taxa de administração      | % sobre aluguel (se houver)     | R$ 300,00 (10%)                         |
| – Condomínio                 | Despesa paga pelo proprietário  | R$ 450,00                               |
| – IPTU (parcela)             | Despesa paga pelo proprietário  | R$ 150,00                               |
| – Reparos/manutenção         | Consertos autorizados           | R$ 200,00                               |
| – Seguro imobiliário         | Prêmio do seguro                | R$ 50,00                                |
| – Outros descontos           | Limpeza, vistoria, etc.         | R$ 0,00                                 |
| **Total de saídas**          | Soma de todas as saídas         | **R$ 1.150,00**                         |
| **Saldo para repasse**       | Entradas – Saídas               | **R$ 1.940,00**                         |
| **Data do repasse**          | Quando o valor foi transferido  | 05/09/2026                              |
| **Forma de repasse**         | PIX, boleto, depósito           | PIX (chave CPF)                         |
| **Saldo pendente**           | Valor a repassar no próximo mês | R$ 0,00                                 |

[terraresidential](https://www.terraresidential.com/blog/what-your-property-management-financial-reports-reveal-about-your-manager)

**O que o RentEasy deve fazer**:

- Gerar **PDF automático** com todos os campos acima.
- Incluir **link para download** no dashboard do proprietário.
- Enviar **e-mail automático** com o relatório em anexo (até 5 dias úteis após fechamento).
- Permitir **exportação em Excel/CSV** (para contador).

[imobisoft.com](https://imobisoft.com.br/blog/planilha-controle-de-aluguel)

---

### 2.2. Relatório de Conciliação Bancária

**Finalidade**: garantir que todos os pagamentos recebidos dos inquilinos foram corretamente registrados e repassados.

**Periodicidade**: **diária** (para administradoras) ou **semanal** (para pequenos proprietários).

**Estrutura mínima**:

| Campo                 | Descrição                        | Exemplo               |
| --------------------- | -------------------------------- | --------------------- |
| **Data**              | Data da transação                | 01/08/2026            |
| **Inquilino**         | Nome do pagador                  | Maria Santos          |
| **Imóvel**            | Endereço do imóvel               | Rua X, nº 123, Apt 45 |
| **Tipo de pagamento** | PIX, boleto, depósito            | PIX                   |
| **Valor pago**        | Valor creditado na conta         | R$ 3.000,00           |
| **Referência**        | Mês de referência do pagamento   | Agosto/2026           |
| **Status**            | Conciliado, pendente, divergente | Conciliado            |
| **Observações**       | Divergências, taxas bancárias    | Taxa PIX: R$ 0,50     |

[grandcondo.com](https://www.grandcondo.com.br/biblioteca/doc/kit-checklist-de-gestao-da-inadimplencia)

**O que o RentEasy deve fazer**:

- Integrar com **API bancária** (Open Finance) ou **gateway de pagamento** (Asaas, Juno, Pagar.me).
- Importar **extrato bancário automaticamente** (OFX, CSV, API).
- **Conciliar automaticamente** pagamentos com contratos (match por valor, data, inquilino).
- Sinalizar **divergências** (valor diferente, pagamento em conta errada).
- Gerar **relatório de conciliação** (PDF/Excel) para auditoria.

[grandcondo.com](https://www.grandcondo.com.br/biblioteca/doc/kit-checklist-de-gestao-da-inadimplencia)

---

### 2.3. Relatório de Inadimplência (Delinquency Report)

**Finalidade**: identificar inquilinos em atraso e priorizar ações de cobrança.

**Periodicidade**: **diária** (dashboard) e **mensal** (relatório consolidado).

**Estrutura mínima**:

| Campo                   | Descrição                       | Exemplo                   |
| ----------------------- | ------------------------------- | ------------------------- |
| **Inquilino**           | Nome do devedor                 | Carlos Oliveira           |
| **Imóvel**              | Endereço do imóvel              | Rua Y, nº 456, Casa 2     |
| **Vencimento original** | Data original de vencimento     | 01/08/2026                |
| **Dias em atraso**      | Quantos dias vencido            | 25 dias                   |
| **Valor original**      | Aluguel sem encargos            | R$ 2.500,00               |
| **Multa (2%)**          | Multa por atraso                | R$ 50,00                  |
| **Juros (1%/mês)**      | Juros proporcionais aos dias    | R$ 20,83                  |
| **Correção monetária**  | IPCA/IGP-M proporcional         | R$ 10,00                  |
| **Total devido**        | Valor atualizado                | **R$ 2.580,83**           |
| **Última cobrança**     | Data da última notificação      | 15/08/2026                |
| **Status**              | Em cobrança, acordado, judicial | Em cobrança               |
| **Ação recomendada**    | Próximo passo                   | Notificação extrajudicial |

[abornpowerspm](https://abornpowerspm.com/top-landlord-financial-reporting-practices/)

**Indicadores-chave (KPIs)**:

- **Taxa de inadimplência**: (total inadimplente / total de contratos) × 100.
  - Meta: <5% (média do mercado: 3–5%). [infomoney.com](https://www.infomoney.com.br/minhas-financas/inadimplencia-do-aluguel-cai-ao-menor-nivel-em-3-anos-mas-melhora-e-desigual/)
- **DSO (Days Sales Outstanding)**: média de dias para receber após vencimento.
  - Fórmula: (contas a receber / receita diária média).
  - Meta: <10 dias.
- **Aging de inadimplência**:
  - 1–30 dias: cobrança amigável (e-mail/WhatsApp).
  - 31–60 dias: notificação extrajudicial.
  - 61–90 dias: ação judicial (despejo).
  - > 90 dias: provisionamento para perda (PDD).

[neofin.com](https://www.neofin.com.br/blog/dashboard-financeiro)

**O que o RentEasy deve fazer**:

- Dashboard em tempo real com **cards de inadimplência** (vermelho = crítico).
- Lista de inquilinos em atraso, ordenada por **dias em atraso** e **valor devido**.
- **Cálculo automático** de multa (2%), juros (1%/mês) e correção (IPCA/IGP-M).
- **Notificações automáticas** (e-mail/WhatsApp) para inquilinos em atraso.
- **Relatório de aging** (faixas de atraso: 1–30, 31–60, 61–90, >90 dias).
- **Exportação para Excel/CSV** (para contador ou advogado).

[abornpowerspm](https://abornpowerspm.com/top-landlord-financial-reporting-practices/)

---

### 2.4. Demonstração de Resultados (DRE – Relatório de Receitas e Despesas)

**Finalidade**: mostrar se o imóvel está gerando lucro ou prejuízo no período.

**Periodicidade**: **mensal** e **anual** (para IRPF/IRPJ).

**Estrutura mínima**:

| Conta                              | Descrição                                | Valor (exemplo)     |
| ---------------------------------- | ---------------------------------------- | ------------------- |
| **Receitas**                       |                                          |                     |
| – Aluguéis                         | Aluguéis recebidos                       | R$ 9.000,00         |
| – Multas/juros                     | Atrasos pagos                            | R$ 270,00           |
| – Outros                           | Caução, reembolsos                       | R$ 0,00             |
| **Total de receitas**              |                                          | **R$ 9.270,00**     |
| **Despesas Operacionais**          |                                          |                     |
| – Taxa de administração            | 10% sobre aluguéis                       | R$ 900,00           |
| – Condomínio                       | Despesa mensal                           | R$ 1.350,00         |
| – IPTU (parcela)                   | Imposto predial                          | R$ 450,00           |
| – Reparos/manutenção               | Consertos                                | R$ 600,00           |
| – Seguro imobiliário               | Prêmio anual/12                          | R$ 150,00           |
| – Limpeza/vistoria                 | Serviços terceirizados                   | R$ 200,00           |
| – Taxas bancárias                  | PIX, boleto                              | R$ 30,00            |
| **Total de despesas operacionais** |                                          | **R$ 3.680,00**     |
| **Lucro operacional**              | Receitas – Despesas operacionais         | **R$ 5.590,00**     |
| **Despesas Financeiras**           |                                          |                     |
| – Juros de financiamento           | Se houver                                | R$ 1.200,00         |
| **Lucro antes do IR**              | Lucro operacional – Despesas financeiras | **R$ 4.390,00**     |
| **IR/CSLL (se PJ)**                | Tributos sobre lucro                     | R$ 1.097,50 (27,5%) |
| **Lucro líquido**                  | Lucro antes do IR – IR                   | **R$ 3.292,50**     |

[terraresidential](https://www.terraresidential.com/blog/what-your-property-management-financial-reports-reveal-about-your-manager)

**O que o RentEasy deve fazer**:

- Gerar **DRE por imóvel** e **consolidado por proprietário**.
- Permitir **filtrar por período** (mês, trimestre, ano).
- Incluir **gráficos de evolução** (receitas vs. despesas ao longo do tempo).
- Exportar para **Excel/CSV** (para contador).
- Para **PJ**: incluir cálculo de **IRPJ, CSLL, PIS, COFINS** (ou IBS/CBS a partir de 2027).

[terraresidential](https://www.terraresidential.com/blog/what-your-property-management-financial-reports-reveal-about-your-manager)

---

### 2.5. Fluxo de Caixa (Cash Flow Statement)

**Finalidade**: prever entradas e saídas futuras para evitar falta de caixa.

**Periodicidade**: **mensal** (realizado) e **projeção 3–6 meses** (previsto).

**Estrutura mínima**:

| Mês                          | Entradas        | Saídas          | Saldo do mês    | Saldo acumulado |
| ---------------------------- | --------------- | --------------- | --------------- | --------------- |
| **Agosto/2026 (realizado)**  |                 |                 |                 |                 |
| – Aluguéis                   | R$ 9.000,00     |                 |                 |                 |
| – Multas/juros               | R$ 270,00       |                 |                 |                 |
| – Outros                     | R$ 0,00         |                 |                 |                 |
| **Total de entradas**        | **R$ 9.270,00** |                 |                 |                 |
| – Taxa de administração      |                 | R$ 900,00       |                 |                 |
| – Condomínio                 |                 | R$ 1.350,00     |                 |                 |
| – IPTU                       |                 | R$ 450,00       |                 |                 |
| – Reparos                    |                 | R$ 600,00       |                 |                 |
| – Seguro                     |                 | R$ 150,00       |                 |                 |
| – Taxas bancárias            |                 | R$ 30,00        |                 |                 |
| – Repasses a proprietários   |                 | R$ 5.590,00     |                 |                 |
| **Total de saídas**          |                 | **R$ 9.070,00** |                 |                 |
| **Saldo do mês**             |                 |                 | **R$ 200,00**   | **R$ 200,00**   |
| **Setembro/2026 (previsto)** |                 |                 |                 |                 |
| – Aluguéis (previsto)        | R$ 9.000,00     |                 |                 |                 |
| – Condomínio (previsto)      |                 | R$ 1.350,00     |                 |                 |
| – IPTU (previsto)            |                 | R$ 450,00       |                 |                 |
| – Repasses (previsto)        |                 | R$ 5.590,00     |                 |                 |
| **Saldo previsto do mês**    |                 |                 | **R$ 1.610,00** | **R$ 1.810,00** |

[terraresidential](https://www.terraresidential.com/blog/what-your-property-management-financial-reports-reveal-about-your-manager)

**Indicadores-chave**:

- **Saldo atual**: quanto há em conta agora.
- **Entradas previstas (7/30 dias)**: aluguéis a vencer nos próximos 7 e 30 dias.
- **Saídas previstas (7/30 dias)**: despesas e repasses a vencer.
- **Projeção de caixa**: cenário realista, otimista e conservador.

[neofin.com](https://www.neofin.com.br/blog/dashboard-financeiro)

**O que o RentEasy deve fazer**:

- Dashboard com **cards de topo** (saldo atual, entradas previstas, saídas previstas).
- **Gráfico de linha** com projeção de caixa (realizado x previsto x cenário conservador).
- **Alertas de caixa negativo** (quando saldo projetado ficar <0).
- **Exportação para Excel/CSV** (para planejamento financeiro).

[neofin.com](https://www.neofin.com.br/blog/dashboard-financeiro)

---

### 2.6. Relatório de Receitas por Imóvel (Rent Roll)

**Finalidade**: listar todos os imóveis, inquilinos, valores de aluguel e status de pagamento.

**Periodicidade**: **mensal** (fechamento) e **sob demanda** (consulta rápida).

**Estrutura mínima**:

| Imóvel                 | Inquilino       | Aluguel     | Vencimento | Status   | Dias em atraso | Total devido |
| ---------------------- | --------------- | ----------- | ---------- | -------- | -------------- | ------------ |
| Rua X, nº 123, Apt 45  | Maria Santos    | R$ 3.000,00 | 01/08/2026 | Pago     | 0              | R$ 0,00      |
| Rua Y, nº 456, Casa 2  | Carlos Oliveira | R$ 2.500,00 | 01/08/2026 | Atrasado | 25             | R$ 2.580,83  |
| Rua Z, nº 789, Sala 10 | Ana Costa       | R$ 4.000,00 | 05/08/2026 | Pendente | 0              | R$ 4.000,00  |

[terraresidential](https://www.terraresidential.com/blog/what-your-property-management-financial-reports-reveal-about-your-manager)

**O que o RentEasy deve fazer**:

- Listar **todos os imóveis** do proprietário em uma única tela.
- **Filtros**: por status (pago, pendente, atrasado), por inquilino, por valor.
- **Ordenação**: por dias em atraso, por valor devido.
- **Exportação para Excel/CSV** (para análise ou contador).

[terraresidential](https://www.terraresidential.com/blog/what-your-property-management-financial-reports-reveal-about-your-manager)

---

### 2.7. Relatório Fiscal para IRPF (Carnê-Leão)

**Finalidade**: fornecer dados para declaração mensal de **carnê-leão** (PF) ou **IRPJ/CSLL** (PJ).

**Periodicidade**: **mensal** (para carnê-leão) e **anual** (para IRPF/IRPJ).

**Estrutura mínima (PF – Carnê-Leão)**:

| Campo                         | Descrição                                               | Exemplo                        |
| ----------------------------- | ------------------------------------------------------- | ------------------------------ |
| **Proprietário**              | Nome, CPF                                               | João Silva, CPF 123.456.789-00 |
| **Mês/ano**                   | Período de referência                                   | Agosto/2026                    |
| **Receita bruta de aluguéis** | Total recebido de aluguéis                              | R$ 9.000,00                    |
| **Despesas dedutíveis**       |                                                         |                                |
| – Condomínio                  | R$ 1.350,00                                             |                                |
| – IPTU                        | R$ 450,00                                               |                                |
| – Reparos                     | R$ 600,00                                               |                                |
| – Seguro                      | R$ 150,00                                               |                                |
| – Taxa de administração       | R$ 900,00                                               |                                |
| **Total de despesas**         | Soma das despesas dedutíveis                            | **R$ 3.450,00**                |
| **Base de cálculo**           | Receita bruta – Despesas                                | **R$ 5.550,00**                |
| **Alíquota IRPF**             | Tabela progressiva (2026)                               | 22,5%                          |
| **IR devido**                 | Base × alíquota – dedução                               | **R$ 1.248,75**                |
| **DARF**                      | Código 0190, vencimento último dia útil do mês seguinte | 30/09/2026                     |

**O que o RentEasy deve fazer**:

- Gerar **relatório mensal** com receitas e despesas dedutíveis.
- Calcular **base de cálculo** e **IR devido** (opcional, para facilitar).
- Exportar para **Excel/CSV** (para importação no programa da Receita Federal).
- Gerar **relatório anual consolidado** (para declaração de IRPF).

---

### 2.8. Relatório Fiscal para DIMOB (PJ/Imobiliárias)

**Finalidade**: fornecer dados para declaração anual de **DIMOB** (obrigatória para PJ e imobiliárias).

**Periodicidade**: **anual** (fevereiro, referente ao ano anterior).

**Estrutura mínima**:

| Campo                     | Descrição                       | Exemplo               |
| ------------------------- | ------------------------------- | --------------------- |
| **CNPJ da imobiliária**   | Identificação da declarante     | 12.345.678/0001-90    |
| **CPF/CNPJ do locador**   | Identificação do proprietário   | 123.456.789-00        |
| **CPF/CNPJ do locatário** | Identificação do inquilino      | 987.654.321-00        |
| **Endereço do imóvel**    | Logradouro, número, complemento | Rua X, nº 123, Apt 45 |
| **Matrícula do imóvel**   | Registro no cartório            | 98765                 |
| **Valor total recebido**  | Aluguéis + multas + juros       | R$ 36.000,00          |
| **Valor de despesas**     | Condomínio, IPTU, reparos       | R$ 12.000,00          |
| **Saldo repassado**       | Valor líquido ao locador        | R$ 24.000,00          |

**O que o RentEasy deve fazer**:

- Gerar **relatório anual consolidado** com todos os contratos.
- Exportar para **Excel/CSV** (para importação no programa da DIMOB).
- **Atenção**: RentEasy não entrega DIMOB (obrigação do contador), mas fornece **dados para o contador**.

---

### 2.9. Relatório Fiscal para NFS-e (IBS/CBS)

**Finalidade**: fornecer dados para emissão de **NFS-e** (obrigatória para PJ e PF contribuinte de IBS/CBS a partir de 01/12/2026).

**Periodicidade**: **mensal** (para emissão de NFS-e).

**Estrutura mínima**:

| Campo                   | Descrição                            | Exemplo                          |
| ----------------------- | ------------------------------------ | -------------------------------- |
| **Prestador (locador)** | Nome, CPF/CNPJ                       | João Silva, CPF 123.456.789-00   |
| **Tomador (inquilino)** | Nome, CPF/CNPJ                       | Maria Santos, CPF 987.654.321-00 |
| **Endereço do imóvel**  | Local da locação                     | Rua X, nº 123, Apt 45            |
| **Valor do aluguel**    | Base de cálculo                      | R$ 3.000,00                      |
| **Redutor de 70%**      | Base reduzida (30% do valor)         | R$ 900,00                        |
| **CBS (8,8%)**          | Tributo federal                      | R$ 79,20                         |
| **IBS (17,7%)**         | Tributo estadual/municipal           | R$ 159,30                        |
| **Total de IBS/CBS**    | Soma dos tributos                    | **R$ 238,50**                    |
| **Redutor social**      | Dedução de R$ 600/mês (se aplicável) | R$ 0,00                          |
| **Valor líquido**       | Aluguel – IBS/CBS                    | **R$ 2.761,50**                  |

**O que o RentEasy deve fazer**:

- **Calcular IBS/CBS automaticamente** (com redutores).
- Integrar com **emissor de NFS-e** (eNotas, NFe.io, Portal Nacional).
- Gerar **relatório mensal** com todos os aluguéis e tributos.
- Exportar para **Excel/CSV** (para contador).

---

## 3. Dashboard Financeiro (Visão Geral)

**Finalidade**: visão consolidada e em tempo real de todos os indicadores financeiros.

**Estrutura sugerida**:

### Cards de Topo (KPIs)

| Indicador                        | Descrição                              | Exemplo      |
| -------------------------------- | -------------------------------------- | ------------ |
| **Saldo atual**                  | Quanto há em conta agora               | R$ 12.500,00 |
| **Entradas previstas (7 dias)**  | Aluguéis a vencer nos próximos 7 dias  | R$ 8.000,00  |
| **Entradas previstas (30 dias)** | Aluguéis a vencer nos próximos 30 dias | R$ 28.000,00 |
| **Saídas previstas (7 dias)**    | Despesas e repasses a vencer           | R$ 5.000,00  |
| **Saídas previstas (30 dias)**   | Despesas e repasses a vencer           | R$ 18.000,00 |
| **Taxa de inadimplência**        | % de inquilinos em atraso (>60 dias)   | 3,5%         |
| **DSO**                          | Média de dias para receber             | 8 dias       |

[neofin.com](https://www.neofin.com.br/blog/dashboard-financeiro)

### Gráficos

- **Evolução de receitas e despesas** (linha, últimos 12 meses).
- **Inadimplência por faixa de atraso** (pizza ou barra: 1–30, 31–60, 61–90, >90 dias).
- **Receitas por imóvel** (barra, ranking de imóveis mais rentáveis).
- **Projeção de caixa** (linha: realizado x previsto x cenário conservador).

[neofin.com](https://www.neofin.com.br/blog/dashboard-financeiro)

### Lista de Alertas

- **Inquilinos em atraso crítico** (>60 dias).
- **Repasse pendente** (proprietário ainda não recebeu).
- **Saldo projetado negativo** (próximos 30 dias).

[neofin.com](https://www.neofin.com.br/blog/dashboard-financeiro)

**O que o RentEasy deve fazer**:

- Dashboard **único e consolidado** (visão geral de todos os imóveis).
- **Filtros**: por proprietário, por imóvel, por período.
- **Atualização em tempo real** (ou pelo menos diária).
- **Exportação de gráficos** (PDF, PNG) para apresentações.

[neofin.com](https://www.neofin.com.br/blog/dashboard-financeiro)

---

## 4. Checklist de Implementação (MVP, V1, V2)

### MVP (2–3 meses)

- [ ] **Relatório de repasses ao proprietário** (PDF, mensal).
- [ ] **Relatório de inadimplência** (lista de inquilinos em atraso).
- [ ] **Relatório de receitas por imóvel (Rent Roll)**.
- [ ] **Dashboard financeiro** (cards de topo: saldo, entradas, saídas, inadimplência).
- [ ] **Exportação para Excel/CSV** (todos os relatórios).

[terraresidential](https://www.terraresidential.com/blog/what-your-property-management-financial-reports-reveal-about-your-manager)

### V1 (4–6 meses)

- [ ] **Conciliação bancária automática** (integração com API bancária/gateway).
- [ ] **Cálculo automático de multa, juros e correção** (inadimplência).
- [ ] **Relatório de fluxo de caixa** (realizado + projeção 3–6 meses).
- [ ] **Relatório fiscal para carnê-leão** (mensal, PF).
- [ ] **Notificações automáticas** (e-mail/WhatsApp para inquilinos em atraso).

[neofin.com](https://www.neofin.com.br/blog/dashboard-financeiro)

### V2 (8–12 meses)

- [ ] **DRE (Demonstração de Resultados)** por imóvel e consolidado.
- [ ] **Relatório fiscal para DIMOB** (anual, PJ/imobiliárias).
- [ ] **Relatório fiscal para NFS-e** (IBS/CBS, mensal, PJ e PF contribuinte).
- [ ] **Integração com emissor de NFS-e** (eNotas, NFe.io, Portal Nacional).
- [ ] **Dashboard avançado** (gráficos de evolução, projeção de caixa, alertas).
- [ ] **Relatórios para SPED, DCTF** (PJ, contabilidade completa).

[terraresidential](https://www.terraresidential.com/blog/what-your-property-management-financial-reports-reveal-about-your-manager)

---

## 5. Riscos de Não Ter Relatórios Adequados

| Risco                                  | Consequência                                        | Mitigação                                                    |
| -------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------ |
| **Não prestar contas ao proprietário** | Processo judicial, perda de contrato                | Relatório de repasses mensal (PDF)                           |
| **Não conciliar pagamentos**           | Repasses em duplicidade ou faltantes                | Conciliação bancária automática                              |
| **Não controlar inadimplência**        | Perda de receita, ação judicial tardia              | Relatório de inadimplência diário + notificações automáticas |
| **Não ter DRE**                        | Não saber se imóvel dá lucro ou prejuízo            | DRE mensal por imóvel                                        |
| **Não ter fluxo de caixa**             | Falta de caixa para repasses                        | Projeção de caixa 3–6 meses                                  |
| **Não ter relatório fiscal**           | Multa da Receita Federal (carnê-leão, DIMOB, NFS-e) | Relatórios fiscais mensais/anuais                            |

[abornpowerspm](https://abornpowerspm.com/top-landlord-financial-reporting-practices/)

---

## Conclusão

Os **relatórios financeiros e contábeis essenciais** para gestão de repasses no RentEasy são:

1. **Relatório de repasses ao proprietário** (Owner Statement) – mensal.
2. **Conciliação bancária** – diária/semanal.
3. **Relatório de inadimplência** – diário/mensal.
4. **DRE (Receitas e Despesas)** – mensal/anual.
5. **Fluxo de caixa** – mensal + projeção 3–6 meses.
6. **Rent Roll (Receitas por imóvel)** – mensal/sob demanda.
7. **Relatório fiscal para carnê-leão** – mensal (PF).
8. **Relatório fiscal para DIMOB** – anual (PJ/imobiliárias).
9. **Relatório fiscal para NFS-e (IBS/CBS)** – mensal (PJ e PF contribuinte).

**Implementação**: começar com MVP (relatórios básicos) e evoluir para V1/V2 (conciliação automática, DRE, fluxo de caixa, relatórios fiscais completos).

**Benefício**: além de evitar multas e processos, relatórios claros são **diferencial competitivo** (ex.: "RentEasy: o único SaaS de aluguel com relatórios fiscais completos e conciliação automática").
