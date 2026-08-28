## Obrigações Legais do RentEasy: Resumo Completo

Este documento consolida todas as obrigações legais que o **RentEasy** precisa atender para operar em conformidade com a legislação brasileira, incluindo a **Lei do Inquilinato (Lei 8.245/91)**, **LGPD**, regras de **assinatura eletrônica** e obrigações fiscais.

---

## 1. Lei do Inquilinato (Lei 8.245/91)

### Pontos principais que impactam o software

| Artigo           | Obrigação                                                                | Impacto no RentEasy                                                                          |
| ---------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| **Art. 18**      | Reajuste anual permitido (uma vez a cada 12 meses)                       | Sistema deve **bloquear reajustes antes de 12 meses** e alertar no aniversário do contrato   |
| **Art. 19**      | Revisão judicial após 3 anos (ação revisional)                           | Sistema deve **alertar locador** quando contrato completar 3 anos (possibilidade de revisão) |
| **Art. 22, I**   | Locador deve garantir uso pacífico do imóvel                             | Registro de ocorrências e manutenções no sistema                                             |
| **Art. 22, V**   | Locador deve fornecer descrição minuciosa do estado do imóvel (vistoria) | **Módulo de vistoria obrigatório**: checklist + fotos com data/hora                          |
| **Art. 22, X**   | Locador paga despesas extraordinárias de condomínio                      | Sistema deve **separar despesas ordinárias vs. extraordinárias**                             |
| **Art. 23, III** | Inquilino devolve imóvel no mesmo estado (exceto desgaste natural)       | Vistoria de saída comparativa com vistoria de entrada                                        |
| **Art. 23, IX**  | Inquilino permite vistoria com dia/hora combinados                       | Sistema deve **registrar agendamento de vistorias** com confirmação do inquilino             |
| **Art. 85**      | Liberdade de preço, periodicidade e indexador do reajuste                | Sistema deve permitir **escolha do índice** (IGP-M, IPCA, INPC, etc.) no contrato            |

[leijuris.com](https://leijuris.com.br/lei/lei-do-inquilinato-lei-no-8-245/linquilin-art-23-caput)

### Atualizações recentes (2024/2025)

- **Lei 14.063/2020 + MP 2.200-2/2001**: contratos de locação podem ser **100% digitais** com assinatura eletrônica (válida juridicamente). [firma](https://firma.dev/pt/legitimidade-da-assinatura-electr%C3%B3nica/brasil)
- **STJ (novembro/2024)**: assinatura eletrônica **avançada fora da ICP-Brasil** é válida quando as partes concordam com o método. [portal.loft.com](https://portal.loft.com.br/o-aluguel-digital-no-brasil-ja-e-possivel-o-problema-e-saber-quando-ele-e-de-verdade/)
- **Atualização da Lei do Inquilinato (2025)**: **formalização obrigatória dos contratos por escrito**, agora permitida em **formato eletrônico** com assinatura digital. [portal.loft.com](https://portal.loft.com.br/o-aluguel-digital-no-brasil-ja-e-possivel-o-problema-e-saber-quando-ele-e-de-verdade/)
- **Reforma Tributária (LC 214/2026)**: locação entra no campo de incidência de **IBS/CBS** (novos tributos sobre consumo). [portal.loft.com](https://portal.loft.com.br/o-que-realmente-significa-um-processo-de-aluguel-totalmente-digital-no-brasil/)

### O que mudou com as novas regras?

| Mudança                                                | Implicação para o RentEasy                                                       |
| ------------------------------------------------------ | -------------------------------------------------------------------------------- |
| **Contrato escrito obrigatório (2025)**                | Sistema deve **gerar contrato formal** (PDF) com todas as cláusulas obrigatórias |
| **Assinatura digital válida (ICP-Brasil ou avançada)** | Integração com provedores de e-signature (ClickSign, DocuSign, etc.)             |
| **Vistoria detalhada obrigatória (Art. 22, V)**        | Módulo de vistoria com **checklist + fotos georreferenciadas** com data/hora     |
| **Notificação de reajuste (30 dias de antecedência)**  | Sistema deve **enviar notificação automática** 30 dias antes do reajuste         |

[blog.saladeestarimoveis.com](https://blog.saladeestarimoveis.com.br/vistoria-de-imovel-alugado-checklist-entrada-saida/)

---

## 2. Reajuste de Aluguel

### Índices permitidos por lei

A Lei do Inquilinato **não define índice obrigatório**. As partes escolhem livremente no contrato:

- **IGP-M** (Índice Geral de Preços – Mercado)
- **IPCA** (Índice Nacional de Preços ao Consumidor Amplo)
- **INPC** (Índice Nacional de Preços ao Consumidor)
- **IVAR** (Índice de Variação de Aluguéis Residenciais – FGV)
- **Outros índices oficiais** (desde que previstos no contrato)

[saluimoveis.com](https://www.saluimoveis.com.br/blog/reajuste-aluguel-de-quanto-em-quanto-tempo-pode-aumentar)

### Periodicidade e cálculo

- **Periodicidade**: reajuste permitido **uma vez a cada 12 meses**, no aniversário do contrato (Lei 8.245/91, Art. 18 + Lei do Plano Real). [saluimoveis.com](https://www.saluimoveis.com.br/blog/reajuste-aluguel-de-quanto-em-quanto-tempo-pode-aumentar)
- **Cálculo**: `novo aluguel = aluguel atual × (1 + índice acumulado em 12 meses)`
  - Exemplo: aluguel R$ 2.000, IPCA 4,44% → R$ 2.000 × 1,0444 = **R$ 2.088,80**
- **Índices atuais (agosto/2026)**:
  - IGP-M: **2,76%** (12 meses)
  - IPCA: **4,44%** (12 meses)

### Notificação de reajuste

- **Obrigatoriedade**: embora a lei não exija notificação formal, a **praxe jurídica e jurisprudência** recomendam notificar o inquilino com **30 dias de antecedência**. [calculandia](https://calculandia.com/en/brazil-rent-increase-calculator)
- **Forma**: e-mail, WhatsApp, carta ou notificação dentro do sistema (com confirmação de leitura).
- **RentEasy**: deve **enviar notificação automática** 30 dias antes do reajuste, com:
  - Índice aplicado
  - Cálculo visível
  - Novo valor
  - Data de vigência

[calculandia](https://calculandia.com/en/brazil-rent-increase-calculator)

---

## 3. Obrigações Legais do Locador

### Deveres do proprietário (Lei 8.245/91, Art. 22)

| Dever                                      | Descrição                                       | Como o RentEasy ajuda                                |
| ------------------------------------------ | ----------------------------------------------- | ---------------------------------------------------- |
| **Entregar imóvel em condições de uso**    | Imóvel deve estar habitável na entrega          | Checklist de vistoria de entrada com fotos           |
| **Garantir uso pacífico**                  | Assegurar posse ao inquilino durante o contrato | Registro de ocorrências e manutenções                |
| **Pagar despesas extraordinárias**         | Obras estruturais, fachada, fundo de reserva    | Separação de despesas ordinárias vs. extraordinárias |
| **Fornecer descrição do estado do imóvel** | Vistoria detalhada com defeitos existentes      | Módulo de vistoria com checklist + fotos             |
| **Responder por vícios anteriores**        | Defeitos estruturais pré-existentes             | Registro de vistoria de entrada como prova           |
| **Reparos estruturais**                    | Telhado, fundações, tubulações, elétrica        | Log de manutenções com fotos e orçamentos            |

[soaresmartinsadv](https://soaresmartinsadv.com/blog/responsabilidade-por-reparos-no-imovel-alugado-locador-inquilino/)

### O que o sistema precisa ajudar o locador a cumprir?

1. **Contrato formal escrito** (obrigatório desde 2025) com todas as cláusulas legais.
2. **Vistoria de entrada e saída** com checklist e fotos georreferenciadas.
3. **Registro de manutenções** (reparos estruturais vs. ordinários).
4. **Notificação de reajuste** 30 dias antes do aniversário.
5. **Comprovantes de pagamento** (recibos, boletos, PIX) para comprovar quitação.
6. **Comunicação com inquilino** (e-mails, WhatsApp) registrada no sistema.

[blog.saladeestarimoveis.com](https://blog.saladeestarimoveis.com.br/vistoria-de-imovel-alugado-checklist-entrada-saida/)

---

## 4. Proteção de Dados (LGPD – Lei 13.709/2018)

### Dados pessoais coletados pelo RentEasy

| Categoria                      | Exemplos                                  | Finalidade                                      |
| ------------------------------ | ----------------------------------------- | ----------------------------------------------- |
| **Dados de identificação**     | Nome, CPF, RG, data de nascimento         | Identificar locador e inquilino                 |
| **Dados de contato**           | E-mail, telefone, WhatsApp                | Comunicação sobre aluguel, reajustes, cobranças |
| **Dados bancários**            | Chave PIX, conta bancária                 | Pagamentos e repasses                           |
| **Dados do imóvel**            | Endereço, matrícula, IPTU                 | Gestão do contrato                              |
| **Dados financeiros**          | Valor do aluguel, histórico de pagamentos | Controle financeiro e relatórios                |
| **Dados sensíveis (opcional)** | Foto do inquilino (vistoria)              | Identificação e vistoria                        |

[arenadodinheiro.com](https://arenadodinheiro.com.br/noticias/aluguel-reajuste-por-ipca-ou-igp-m-qual-escolher/)

### Obrigações da LGPD para SaaS

| Obrigação               | Descrição                                  | Como implementar no RentEasy                                                                 |
| ----------------------- | ------------------------------------------ | -------------------------------------------------------------------------------------------- |
| **Base legal**          | Execução de contrato (Art. 7º, V, LGPD)    | Informar no termo de privacidade que dados são tratados para execução do contrato de locação |
| **Minimização**         | Coletar apenas dados necessários           | Não pedir dados desnecessários (ex.: estado civil, religião)                                 |
| **Transparência**       | Política de privacidade clara              | Criar página "Privacidade" com finalidades, retenção, direitos do titular                    |
| **Segurança**           | Criptografia, controle de acesso, logs     | Criptografar dados em trânsito (HTTPS) e em repouso; logs de acesso                          |
| **Direitos do titular** | Acesso, correção, exclusão, portabilidade  | Criar área "Meus Dados" para inquilino/locador solicitar exclusão/correção                   |
| **Encarregado (DPO)**   | Indicar encarregado e divulgar contato     | Nomear DPO e publicar e-mail de contato (ex.: <privacidade@renteasy.com.br>)                 |
| **ROPA**                | Registro de Operações de Dados             | Manter inventário interno de quais dados são coletados, por quê, por quanto tempo            |
| **Incidentes**          | Notificar ANPD e titulares em 3 dias úteis | Criar processo de resposta a incidentes (vazamento, acesso não autorizado)                   |
| **Retenção**            | Manter dados apenas pelo necessário        | Excluir dados de inquilinos após 5 anos (prazo prescricional de ações locatícias)            |

[arenadodinheiro.com](https://arenadodinheiro.com.br/noticias/aluguel-reajuste-por-ipca-ou-igp-m-qual-escolher/)

### Termo de consentimento: é necessário?

- **Não é obrigatório** para dados tratados com base em **execução de contrato** (Art. 7º, V, LGPD). [arenadodinheiro.com](https://arenadodinheiro.com.br/noticias/aluguel-reajuste-por-ipca-ou-igp-m-qual-escolher/)
- **Quando usar consentimento**:
  - Dados **sensíveis** (ex.: foto do inquilino, se não for essencial)
  - Finalidades **secundárias** (ex.: enviar newsletter, ofertas de parceiros)
- **Requisitos do termo válido** (Art. 5º, XII + Art. 8º, LGPD):
  - **Livre**: sem coação
  - **Informado**: titular sabe o que está concordando
  - **Inequívoco**: ação clara (checkbox, botão "Aceito")
  - **Específico**: para cada finalidade
  - **Revogável**: titular pode retirar consentimento a qualquer momento

[arenadodinheiro.com](https://arenadodinheiro.com.br/noticias/aluguel-reajuste-por-ipca-ou-igp-m-qual-escolher/)

**Recomendação para RentEasy**:

- Usar **base legal "execução de contrato"** para dados essenciais (nome, CPF, e-mail, telefone, dados bancários).
- Usar **consentimento** apenas para:
  - Envio de comunicações de marketing
  - Compartilhamento com terceiros (ex.: bureaus de crédito)
- Criar **termo de privacidade** claro (não termo de consentimento genérico).

---

## 5. Contratos Digitais e Assinatura Eletrônica

### Contrato de aluguel por escrito é obrigatório?

- **Sim, desde 2025**: atualização da Lei do Inquilinato tornou **obrigatória a formalização por escrito** dos contratos de locação. [portal.loft.com](https://portal.loft.com.br/o-aluguel-digital-no-brasil-ja-e-possivel-o-problema-e-saber-quando-ele-e-de-verdade/)
- **Formato eletrônico é válido**: contrato digital (PDF) tem a mesma validade que contrato físico. [firma](https://firma.dev/pt/legitimidade-da-assinatura-electr%C3%B3nica/brasil)

### Assinatura digital tem validade jurídica?

- **Sim**, regulamentada por:
  - **MP 2.200-2/2001**: criou a **ICP-Brasil** (Infraestrutura de Chaves Públicas). Documentos assinados com certificado ICP-Brasil (e-CPF, e-CNPJ) têm **presunção de autenticidade plena**. [firma](https://firma.dev/pt/legitimidade-da-assinatura-electr%C3%B3nica/brasil)
  - **Lei 14.063/2020**: regulamentou assinaturas eletrônicas de forma mais ampla, permitindo **assinaturas avançadas fora da ICP-Brasil** (ex.: ClickSign, DocuSign, Zapsign). [firma](https://firma.dev/pt/legitimidade-da-assinatura-electr%C3%B3nica/brasil)
  - **STJ (novembro/2024)**: assinatura eletrônica avançada **fora da ICP-Brasil** é válida quando as partes concordam com o método. [portal.loft.com](https://portal.loft.com.br/o-aluguel-digital-no-brasil-ja-e-possivel-o-problema-e-saber-quando-ele-e-de-verdade/)

### Níveis de assinatura

| Tipo                    | Descrição                                                                                    | Validade                                                                    |
| ----------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| **ICP-Brasil**          | Certificado digital emitido por autoridade credenciada (e-CPF, e-CNPJ)                       | Presunção plena de autenticidade (equivale a firma reconhecida em cartório) |
| **Assinatura avançada** | Plataformas como ClickSign, DocuSign, Zapsign (comprovam autoria por e-mail, SMS, biometria) | Válida se as partes concordarem (Lei 14.063/2020 + STJ 2024)                |
| **Assinatura simples**  | Checkbox "Aceito os termos", digitar nome no final do PDF                                    | Válida, mas sem presunção de autenticidade (pode ser contestada)            |

[firma](https://firma.dev/pt/legitimidade-da-assinatura-electr%C3%B3nica/brasil)

**Recomendação para RentEasy**:

- Integrar com provedor de **assinatura avançada** (ClickSign, DocuSign, Zapsign) para MVP/V1.
- Oferecer **ICP-Brasil** como opção premium (para locadores que querem máxima segurança jurídica).
- Registrar **IP, data/hora, e-mail de confirmação** de cada assinatura (prova de autoria).

---

## 6. Outras Obrigações

### Documentos fiscais e relatórios obrigatórios

| Documento                           | Quem emite                                                         | Periodicidade                        | RentEasy deve gerar?                                                  |
| ----------------------------------- | ------------------------------------------------------------------ | ------------------------------------ | --------------------------------------------------------------------- |
| **Carnê-Leão (IRPF)**               | Locador PF                                                         | Mensal (se houver retenção) ou anual | **Sim**: gerar relatório de rendimentos mensais para declaração anual |
| **DIMOB**                           | Imobiliárias/PJ (não PF)                                           | Anual (fevereiro)                    | **Não** (a menos que RentEasy seja PJ intermediária)                  |
| **NFS-e (Nota Fiscal de Serviços)** | Locador PJ (desde 01/12/2026) e PF contribuinte (desde 01/01/2027) | Mensal                               | **Sim** (integração com prefeitura para emissão de NFS-e)             |
| **IBS/CBS**                         | Locador PF/PJ contribuinte                                         | Mensal                               | **Sim** (cálculo automático e emissão de guia)                        |
| **IRRF (retenção na fonte)**        | Locador PJ (se houver retenção)                                    | Mensal                               | **Sim** (cálculo e emissão de DARF)                                   |

[portal.loft.com](https://portal.loft.com.br/o-que-realmente-significa-um-processo-de-aluguel-totalmente-digital-no-brasil/)

**Reforma Tributária (2026/2027)**:

- **Locador PJ**: deve emitir **NFS-e** a partir de **01/12/2026**.
- **Locador PF contribuinte** (>3 imóveis distintos + >R$ 240 mil/ano): deve emitir **NFS-e** a partir de **01/01/2027** e obter **CNPJ**. [portal.loft.com](https://portal.loft.com.br/o-que-realmente-significa-um-processo-de-aluguel-totalmente-digital-no-brasil/)
- **RentEasy**: deve integrar com sistemas de **emissão de NFS-e** (ex.: eNotas, NFe.io) para V2.

### Regras para cobrança (boleto, PIX) e inadimplência

| Regra                      | Descrição                                                        | Implicação para RentEasy                                                          |
| -------------------------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| **Cobrança de aluguel**    | Pode ser por boleto, PIX, depósito, dinheiro (com recibo)        | Sistema deve gerar **boleto registrado** e **PIX com QR Code**                    |
| **Juros e multa**          | Máximo 2% de multa + 1% de juros ao mês (Art. 406, Código Civil) | Sistema deve **calcular automaticamente** juros e multa dentro dos limites legais |
| **Protesto**               | Inadimplência >30 dias pode ser protestada em cartório           | Sistema deve **gerar notificação de protesto** (opcional)                         |
| **Ação de despejo**        | Inadimplência >3 meses permite ação de despejo                   | Sistema deve **gerar notificação extrajudicial** (30 dias antes de ação judicial) |
| **Cobrança extrajudicial** | Permitida, mas sem constrangimento ou ameaça                     | Sistema deve **evitar linguagem abusiva** em notificações automáticas             |

[calculandia](https://calculandia.com/en/brazil-rent-increase-calculator)

**Recomendações para RentEasy**:

- **Boleto**: integrar com gateway (Asaas, Juno, Pagar.me) para geração de boletos registrados.
- **PIX**: gerar PIX com QR Code e notificação automática de pagamento.
- **Notificações de inadimplência**:
  - 1 dia após vencimento: lembrete amigável (e-mail/WhatsApp)
  - 5 dias após vencimento: notificação com juros/multa
  - 30 dias após vencimento: notificação de possível protesto/ação judicial

---

## 7. Resumo: Checklist de Conformidade para o RentEasy

### Lei do Inquilinato

- [ ] **Bloquear reajustes antes de 12 meses** (Art. 18)
- [ ] **Alertar revisão judicial após 3 anos** (Art. 19)
- [ ] **Módulo de vistoria com checklist + fotos** (Art. 22, V)
- [ ] **Separar despesas ordinárias vs. extraordinárias** (Art. 22, X)
- [ ] **Vistoria de saída comparativa** (Art. 23, III)
- [ ] **Agendamento de vistorias com confirmação** (Art. 23, IX)
- [ ] **Permitir escolha de índice de reajuste** (Art. 85)
- [ ] **Notificar reajuste 30 dias antes** (praxe jurídica)

### LGPD

- [ ] **Política de privacidade clara** (finalidades, retenção, direitos)
- [ ] **Base legal: execução de contrato** (Art. 7º, V)
- [ ] **Minimização de dados** (não coletar dados desnecessários)
- [ ] **Criptografia em trânsito e repouso**
- [ ] **Área "Meus Dados"** para titular solicitar acesso/correção/exclusão
- [ ] **Nomear DPO** e publicar e-mail de contato
- [ ] **ROPA interno** (inventário de operações de dados)
- [ ] **Processo de resposta a incidentes** (notificar ANPD em 3 dias)
- [ ] **Excluir dados após 5 anos** (prazo prescricional)

### Contratos e Assinatura

- [ ] **Gerar contrato formal em PDF** com cláusulas obrigatórias
- [ ] **Integrar com e-signature** (ClickSign, DocuSign, Zapsign)
- [ ] **Registrar IP, data/hora, e-mail** de cada assinatura
- [ ] **Oferecer ICP-Brasil** como opção premium

### Fiscal e Tributário

- [ ] **Gerar relatório de rendimentos mensais** (para carnê-leão/IRPF)
- [ ] **Integrar com NFS-e** (para PJ e PF contribuinte, a partir de 2027)
- [ ] **Calcular IBS/CBS automaticamente** (para contribuintes)
- [ ] **Calcular IRRF** (se houver retenção)

### Cobrança e Inadimplência

- [ ] **Gerar boleto registrado e PIX com QR Code**
- [ ] **Calcular juros (1%/mês) e multa (2%) dentro dos limites legais**
- [ ] **Notificações automáticas** (1 dia, 5 dias, 30 dias após vencimento)
- [ ] **Evitar linguagem abusiva** em cobranças

---

## 8. Implicações Práticas para o Desenvolvimento

### MVP (2–3 meses)

- **Contrato formal em PDF** (com cláusulas obrigatórias)
- **Calculadora de reajuste** (IGP-M, IPCA, INPC) com notificação 30 dias antes
- **Dashboard de pagamentos** (pago, próximo, atrasado)
- **Política de privacidade** e termo de uso (LGPD)
- **Relatório de rendimentos mensais** (para IRPF)

### V1 (4–6 meses)

- **Módulo de vistoria** (checklist + fotos com data/hora)
- **Integração com e-signature** (ClickSign, DocuSign)
- **Geração de boleto e PIX** (gateway de pagamento)
- **Notificações automáticas de inadimplência** (e-mail/WhatsApp)
- **Separação de despesas ordinárias vs. extraordinárias**

### V2 (8–12 meses)

- **Integração com NFS-e** (emissão de nota fiscal)
- **Cálculo automático de IBS/CBS** (Reforma Tributária)
- **Relatórios fiscais avançados** (DIMOB, IRRF)
- **Integração com bureaus de crédito** (consulta de score do inquilino)
- **Apps nativos** com notificações push

---

## 9. Riscos de Não Conformidade

| Risco                              | Consequência                                        | Mitigação                                       |
| ---------------------------------- | --------------------------------------------------- | ----------------------------------------------- |
| **Reajuste antes de 12 meses**     | Nulidade do reajuste + multa                        | Bloquear reajustes no sistema                   |
| **Vistoria inadequada**            | Disputa na devolução do imóvel                      | Checklist + fotos georreferenciadas             |
| **Vazamento de dados (LGPD)**      | Multa de até 2% do faturamento (máx. R$ 50 milhões) | Criptografia, DPO, ROPA, processo de incidentes |
| **Contrato sem assinatura válida** | Contrato pode ser contestado judicialmente          | E-signature com ICP-Brasil ou avançada          |
| **Não emissão de NFS-e (2027)**    | Multa da prefeitura + imposição de tributos         | Integração com emissor de NFS-e                 |
| **Cobrança abusiva**               | Ação judicial por danos morais                      | Evitar linguagem ameaçadora em notificações     |

[arenadodinheiro.com](https://arenadodinheiro.com.br/noticias/aluguel-reajuste-por-ipca-ou-igp-m-qual-escolher/)

---

## Conclusão

O **RentEasy** precisa ser desenhado desde o MVP com **conformidade legal embutida**, não como um "add-on" posterior. As principais obrigações são:

1. **Lei do Inquilinato**: reajuste anual, vistoria detalhada, contrato escrito.
2. **LGPD**: política de privacidade, segurança de dados, DPO, ROPA.
3. **Assinatura eletrônica**: integração com e-signature (ICP-Brasil ou avançada).
4. **Fiscal**: relatório de rendimentos (IRPF), futura emissão de NFS-e (2027).
5. **Cobrança**: boleto/PIX dentro dos limites legais de juros/multa.

A boa notícia: **todas essas obrigações são automatizáveis** e podem ser **diferenciais competitivos** (ex.: "RentEasy: o único SaaS 100% conforme a Lei do Inquilinato e LGPD").
