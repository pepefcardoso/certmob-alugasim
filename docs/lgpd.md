## Implementação da LGPD no RentEasy: Guia Prático

Este documento apresenta um **guia passo a passo** para implementar os requisitos da **Lei Geral de Proteção de Dados (LGPD – Lei 13.709/2018)** no **RentEasy**, incluindo políticas, controles técnicos, processos e documentação necessária para conformidade.

***

## 1. Contexto: Por que a LGPD é Crítica para o RentEasy?

### Cenário de Fiscalização em 2026

- **ANPD (Autoridade Nacional de Proteção de Dados)** está em **fiscalização intensificada** em 2026:
  - **19 novos processos sancionadores** abertos apenas em junho/2026. [ciberlatam](https://ciberlatam.com/en/news/brazil-s-anpd-tightens-lgpd)
  - **81 processos de fiscalização** instaurados em 2025. [turivius](https://turivius.com/portal/anpd-2026-fiscalizacao-lgpd/?amp=1)
  - **Multa recorde**: TikTok multado em **R$ 153,7 milhões** em agosto/2026 por violações da LGPD. [gov](https://www.gov.br/anpd/pt-br/assuntos/noticias/anpd-multa-tiktok-em-r-153-7-milhoes-por-falhas-na-protecao-de-dados-de-criancas-e-adolescentes)
  - **Quase 1 comunicação de incidente por dia** em 2025. [blogacritica.blogspot](https://blogacritica.blogspot.com/2026/08/anpd-recebeu-quase-uma-comunicacao-de.html)

- **Sanções previstas (Art. 52, LGPD)**:
  - **Multa simples**: até **2% do faturamento** no Brasil (limitado a **R$ 50 milhões** por infração).
  - **Multa diária**: até **R$ 50 mil/dia** (limite total: R$ 50 milhões).
  - **Publicização da infração**: dano reputacional pode superar a multa.
  - **Bloqueio ou eliminação dos dados**: paralisa operações que dependem do dado.
  - **Suspensão do tratamento**: até 6 meses (prorrogáveis). [turivius](https://turivius.com/portal/anpd-2026-fiscalizacao-lgpd/?amp=1)

**Conclusão**: A LGPD não é "burocracia" — é **risco financeiro e operacional real**. O RentEasy precisa de conformidade desde o MVP.

***

## 2. Dados Pessoais Tratados pelo RentEasy

### Mapeamento de Dados (ROPA – Registro de Operações de Dados)

| Categoria | Dados Coletados | Finalidade | Base Legal | Prazo de Retenção |
| ----------- | ----------------- | ------------ | ------------ | ------------------- |
| **Locador (proprietário)** | Nome, CPF/CNPJ, e-mail, telefone, endereço, dados bancários | Cadastro, autenticação, cobrança, repasses | Execução de contrato (Art. 7º, V) | 5 anos após término do contrato |
| **Inquilino (locatário)** | Nome, CPF, RG, e-mail, telefone, endereço, dados bancários, profissão, renda | Cadastro, contrato, cobrança, vistoria | Execução de contrato (Art. 7º, V) | 5 anos após devolução do imóvel |
| **Imóvel** | Endereço, matrícula, IPTU, fotos, características | Gestão do contrato, vistoria | Execução de contrato (Art. 7º, V) | 5 anos após término do contrato |
| **Contrato** | Valor do aluguel, índice de reajuste, datas, assinaturas digitais | Formalização do contrato, reajustes, cobranças | Execução de contrato (Art. 7º, V) | 5 anos após término do contrato |
| **Pagamentos** | Histórico de pagamentos, boletos, PIX, inadimplência | Controle financeiro, relatórios | Execução de contrato (Art. 7º, V) | 5 anos após término do contrato |
| **Comunicação** | E-mails, WhatsApp, ligações registradas | Atendimento, notificações, cobranças | Execução de contrato (Art. 7º, V) | 2 anos após término do contrato |
| **Vistoria** | Fotos, checklist, observações | Comprovar estado do imóvel na entrada/saída | Execução de contrato (Art. 7º, V) | 5 anos após devolução do imóvel |
| **Dados sensíveis (opcional)** | Foto do inquilino (reconhecimento facial), biometria | Autenticação, vistoria | Consentimento (Art. 7º, I) ou Execução de contrato | 2 anos após término do contrato |

 [portaltelemedicina.com](https://portaltelemedicina.com.br/lgpd-e-a-emissao-de-laudos-medicos)

### Princípios da LGPD a Observar (Art. 6º)

1. **Finalidade**: coletar dados apenas para propósitos específicos e legítimos.
2. **Adequação**: dados devem ser compatíveis com a finalidade declarada.
3. **Necessidade**: limitar ao mínimo necessário (minimização).
4. **Livre acesso**: titular pode consultar dados gratuitamente.
5. **Qualidade dos dados**: garantir exatidão, clareza e atualização.
6. **Transparência**: informar titular sobre tratamento de forma clara.
7. **Segurança**: proteger dados com medidas técnicas e administrativas.
8. **Prevenção**: evitar danos aos titulares.
9. **Não discriminação**: não usar dados para fins discriminatórios.
10. **Responsabilização e prestação de contas**: demonstrar conformidade.

***

## 3. Bases Legais para Tratamento de Dados

### Base Legal Primária: Execução de Contrato (Art. 7º, V)

Para a maioria dos dados do RentEasy, a base legal é **execução de contrato**:

- **Cadastro de locador e inquilino**: necessário para formalizar contrato de locação.
- **Dados bancários**: necessário para pagamentos e repasses.
- **Histórico de pagamentos**: necessário para controle financeiro e inadimplência.
- **Vistoria com fotos**: necessário para comprovar estado do imóvel.

**Não é necessário consentimento** para esses dados, pois o tratamento é **necessário para execução do contrato**. [opservices.com](https://www.opservices.com.br/lei-geral-de-protecao-de-dados/)

### Base Legal Secundária: Consentimento (Art. 7º, I)

Usar **consentimento** apenas para:

- **Dados sensíveis**: foto do inquilino (se não for essencial para vistoria).
- **Finalidades secundárias**: envio de newsletter, ofertas de parceiros, pesquisa de satisfação.
- **Compartilhamento com terceiros**: bureaus de crédito (consulta de score), seguradoras.

**Requisitos do consentimento válido (Art. 8º)**:

- **Livre**: sem coação.
- **Informado**: titular sabe o que está concordando.
- **Inequívoco**: ação clara (checkbox, botão "Aceito").
- **Específico**: para cada finalidade.
- **Revogável**: titular pode retirar consentimento a qualquer momento.

 [opservices.com](https://www.opservices.com.br/lei-geral-de-protecao-de-dados/)

### Outras Bases Legais Aplicáveis

- **Cumprimento de obrigação legal (Art. 7º, II)**: emissão de NFS-e, DIMOB, IRRF.
- **Legítimo interesse (Art. 7º, IX)**: prevenção à fraude, segurança do sistema (requer teste de balanceamento – LIA).
- **Exercício regular de direitos (Art. 7º, VI)**: defesa em processos judiciais ou administrativos.

 [opservices.com](https://www.opservices.com.br/lei-geral-de-protecao-de-dados/)

***

## 4. Implementação Prática: Passo a Passo

### Passo 1: Nomear Encarregado de Dados (DPO) – Art. 41

**Obrigação**: todo controlador de dados deve indicar **Encarregado de Proteção de Dados (DPO)**. [opservices.com](https://www.opservices.com.br/lei-geral-de-protecao-de-dados/)

**Funções do DPO**:

- Receber reclamações e solicitações dos titulares.
- Interagir com a ANPD.
- Orientar equipes internas sobre LGPD.
- Manter registro de operações de dados (ROPA).

**Como implementar no RentEasy**:

- Nomear uma pessoa (pode ser o fundador ou um funcionário) como DPO.
- Publicar e-mail de contato no site (ex.: **<privacidade@renteasy.com.br>** ou **<dpo@renteasy.com.br>**).
- Criar página "Privacidade" com informações do DPO.

**Custo**: pode ser interno (sem custo adicional) ou terceirizado (R$ 1.000–R$ 5.000/mês para DPO compartilhado).

 [opservices.com](https://www.opservices.com.br/lei-geral-de-protecao-de-dados/)

***

### Passo 2: Criar Política de Privacidade e Termos de Uso

**Política de Privacidade** (obrigatória – Art. 9º):

Deve incluir:

1. **Identidade do controlador**: nome, CNPJ, endereço, contato do DPO.
2. **Finalidades do tratamento**: para que cada dado é usado.
3. **Compartilhamento**: com quem os dados são compartilhados (gateways de pagamento, e-signature, etc.).
4. **Direitos dos titulares**: como solicitar acesso, correção, exclusão, portabilidade.
5. **Prazos de retenção**: por quanto tempo cada dado é armazenado.
6. **Medidas de segurança**: criptografia, controle de acesso, etc.
7. **Transferência internacional**: se dados são transferidos para fora do Brasil (ex.: AWS, Google Cloud).

**Termos de Uso**:

- Definir responsabilidades do locador e inquilino.
- Informar que o RentEasy é **operador** (não controlador) dos dados dos inquilinos.
- Estabelecer que o **locador é controlador** dos dados dos inquilinos.

**Onde publicar**:

- Página dedicada no site (ex.: **renteasy.com.br/privacidade**).
- Link visível no rodapé do site e do app.
- Checkbox "Li e concordo com a Política de Privacidade" no cadastro.

 [opservices.com](https://www.opservices.com.br/lei-geral-de-protecao-de-dados/)

***

### Passo 3: Implementar Controles Técnicos de Segurança

#### 3.1. Criptografia

- **Dados em trânsito**: usar **HTTPS/TLS 1.3** para todas as comunicações.
- **Dados em repouso**: criptografar banco de dados com **AES-256**.
- **Backups**: criptografar backups e armazenar em local seguro.

 [portaltelemedicina.com](https://portaltelemedicina.com.br/lgpd-e-a-emissao-de-laudos-medicos)

#### 3.2. Controle de Acesso

- **Autenticação multifator (MFA)**: obrigatória para administradores e funcionários.
- **Controle de acesso por função (RBAC)**:
  - Locador: acessa apenas seus imóveis e inquilinos.
  - Inquilino: acessa apenas seu contrato e pagamentos.
  - Administrador: acessa tudo (com auditoria).
- **Princípio do privilégio mínimo**: cada usuário acessa apenas o necessário.
- **Revogação imediata**: remover acessos quando usuário sair da empresa ou mudar de função.

 [adentro.com](https://adentro.com.br/lgpd-cloud/)

#### 3.3. Logs de Auditoria

- Registrar **todos os acessos** a dados pessoais:
  - Quem acessou (usuário, IP).
  - O que acessou (tabela, registro).
  - Quando acessou (data/hora).
  - O que fez (leitura, alteração, exclusão, exportação).
- Manter logs por **pelo menos 2 anos** (prazo para fiscalização da ANPD).
- Logs devem ser **imutáveis** (WORM: write once, read many).

 [adentro.com](https://adentro.com.br/lgpd-cloud/)

#### 3.4. Segurança da Infraestrutura

- **Hospedagem**: usar provedor com certificações (ISO 27001, SOC 2) – ex.: AWS, Google Cloud, Azure.
- **Firewall e WAF**: proteger contra ataques DDoS, SQL injection, XSS.
- **Monitoramento contínuo**: detectar acessos anômalos, tentativas de invasão.
- **Testes de penetração**: realizar pentest anual ou semestral.
- **Seguro cibernético**: cobrir multas da ANPD, custos de resposta a incidentes.

 [nextguardinsurance](https://www.nextguardinsurance.com/florida-insurance-blog/regulacao-lgpd-seguro-cibernetico-brasil)

***

### Passo 4: Criar Processo para Direitos dos Titulares (Art. 18)

**Direitos dos titulares**:

1. **Confirmação da existência de tratamento**.
2. **Acesso aos dados** (gratuito).
3. **Correção de dados incompletos, inexatos ou desatualizados**.
4. **Anonimização, bloqueio ou eliminação** de dados desnecessários ou excessivos.
5. **Portabilidade** (exportar dados em formato estruturado).
6. **Eliminação dos dados tratados com consentimento** (quando titular revoga).
7. **Informação sobre compartilhamentos**.
8. **Informação sobre possibilidade de não fornecer consentimento**.
9. **Revogação do consentimento**.

 [businessandscience.com](https://businessandscience.com.br/privacidade)

**Como implementar no RentEasy**:

- Criar **Central de Privacidade** (página no site/app):
  - Formulário para solicitações de titulares.
  - Prazo de resposta: **15 dias** (prazo legal da LGPD).
  - Canal de contato: e-mail (<privacidade@renteasy.com.br>) ou formulário online.
- Criar **fluxo interno** para atender solicitações:
  - Receber solicitação → validar identidade do titular → buscar dados → responder em 15 dias.
- Criar **funcionalidade de exportação de dados** (portabilidade):
  - Botão "Baixar meus dados" (PDF ou JSON) para locador e inquilino.
- Criar **funcionalidade de exclusão de conta**:
  - Botão "Excluir minha conta" (com confirmação e aviso sobre consequências).

 [opservices.com](https://www.opservices.com.br/lei-geral-de-protecao-de-dados/)

***

### Passo 5: Definir Prazos de Retenção e Eliminação de Dados

**Prazos recomendados**:

| Dado | Prazo de Retenção | Justificativa |
| ------ | ------------------- | --------------- |
| **Cadastro de locador/inquilino** | 5 anos após término do contrato | Prazo prescricional de ações locatícias (Art. 205, Código Civil) |
| **Contrato e aditivos** | 5 anos após término do contrato | Prazo prescricional de ações contratuais |
| **Histórico de pagamentos** | 5 anos após término do contrato | Prazo fiscal e prescricional |
| **Vistoria (fotos, checklist)** | 5 anos após devolução do imóvel | Prazo para disputas sobre danos |
| **Comunicação (e-mails, WhatsApp)** | 2 anos após término do contrato | Prazo para disputas sobre cobranças |
| **Logs de acesso** | 2 anos | Prazo para fiscalização da ANPD |
| **Dados sensíveis (foto, biometria)** | 2 anos após término do contrato | Minimização (dados sensíveis devem ser retidos pelo menor tempo possível) |

 [opservices.com](https://www.opservices.com.br/lei-geral-de-protecao-de-dados/)

**Como implementar**:

- Criar **política de retenção** documentada.
- Automatizar **exclusão de dados** após prazo de retenção:
  - Job diário/semanal que identifica dados expirados e os exclui (ou anonimiza).
- Manter **registro de exclusões** (log de eliminação de dados).

 [opservices.com](https://www.opservices.com.br/lei-geral-de-protecao-de-dados/)

***

### Passo 6: Criar Processo de Resposta a Incidentes

**Obrigação**: notificar **ANPD e titulares afetados** em até **3 dias úteis** após incidente (vazamento, acesso não autorizado). [blogacritica.blogspot](https://blogacritica.blogspot.com/2026/08/anpd-recebeu-quase-uma-comunicacao-de.html)

**Plano de Resposta a Incidentes**:

1. **Detecção**: identificar incidente (monitoramento, denúncia de titular, alerta de segurança).
2. **Contenção**: isolar sistema afetado, revogar acessos comprometidos.
3. **Avaliação**: determinar escopo (quais dados, quantos titulares afetados).
4. **Notificação**:
   - **ANPD**: formulário online em até 3 dias úteis.
   - **Titulares**: e-mail ou notificação no app, informando:
     - Natureza do incidente.
     - Dados afetados.
     - Medidas tomadas.
     - Orientações para se proteger (ex.: trocar senha, monitorar conta bancária).
5. **Correção**: corrigir vulnerabilidade, reforçar segurança.
6. **Documentação**: registrar incidente, ações tomadas, lições aprendidas.

 [blogacritica.blogspot](https://blogacritica.blogspot.com/2026/08/anpd-recebeu-quase-uma-comunicacao-de.html)

**Como implementar no RentEasy**:

- Criar **documento interno** "Plano de Resposta a Incidentes".
- Designar **equipe de resposta** (DPO, TI, Jurídico).
- Realizar **simulado anual** de incidente.
- Contratar **seguro cibernético** (cobre multas, custos de notificação, defesa administrativa).

 [nextguardinsurance](https://www.nextguardinsurance.com/florida-insurance-blog/regulacao-lgpd-seguro-cibernetico-brasil)

***

### Passo 7: Revisar Contratos com Fornecedores (Operadores)

**Fornecedores que tratam dados pessoais**:

- **Hospedagem**: AWS, Google Cloud, Azure.
- **Gateway de pagamento**: Asaas, Juno, Pagar.me, Stripe.
- **E-signature**: ClickSign, DocuSign, Zapsign.
- **E-mail/WhatsApp**: SendGrid, Twilio, Z-API.
- **Backup**: Backblaze, AWS S3.

**Obrigação**: contratos devem incluir **cláusulas de proteção de dados** (Art. 37–40, LGPD):

- Fornecedor é **operador** (não controlador) dos dados.
- Fornecedor deve seguir instruções do controlador (RentEasy).
- Fornecedor deve implementar medidas de segurança adequadas.
- Fornecedor deve notificar RentEasy em caso de incidente.
- Fornecedor não pode compartilhar dados com terceiros sem autorização.

 [opservices.com](https://www.opservices.com.br/lei-geral-de-protecao-de-dados/)

**Como implementar**:

- Revisar contratos com todos os fornecedores.
- Adicionar **Termo Aditivo de Proteção de Dados** (DPA – Data Processing Agreement).
- Manter **registro de fornecedores** (nome, dados tratados, medidas de segurança).

 [opservices.com](https://www.opservices.com.br/lei-geral-de-protecao-de-dados/)

***

### Passo 8: Criar Evidências de Conformidade (Accountability)

**O que a ANPD exige em fiscalização**:

1. **Política de Privacidade** publicada.
2. **Termos de Uso** publicados.
3. **ROPA** (Registro de Operações de Dados).
4. **Contratos com fornecedores** (com cláusulas LGPD).
5. **Matriz de perfis de acesso** (quem acessa o quê).
6. **Logs de auditoria** (acessos a dados pessoais).
7. **Plano de Resposta a Incidentes**.
8. **Registro de solicitações de titulares** e respostas.
9. **Registro de exclusões de dados** (após prazo de retenção).
10. **Comprovante de nomeação do DPO** (e-mail publicado no site).

 [opservices.com](https://www.opservices.com.br/lei-geral-de-protecao-de-dados/)

**Como implementar**:

- Criar **pasta de conformidade LGPD** (Google Drive, Notion, etc.).
- Manter todos os documentos atualizados.
- Realizar **auditoria interna anual** (ou contratar consultoria).

 [opservices.com](https://www.opservices.com.br/lei-geral-de-protecao-de-dados/)

***

## 5. Checklist de Implementação (MVP, V1, V2)

### MVP (2–3 meses)

- [ ] **Nomear DPO** e publicar e-mail no site (<privacidade@renteasy.com.br>).
- [ ] **Criar Política de Privacidade** (página no site).
- [ ] **Criar Termos de Uso** (página no site).
- [ ] **Implementar HTTPS/TLS** em todo o site/app.
- [ ] **Criptografar banco de dados** (AES-256).
- [ ] **Implementar autenticação multifator (MFA)** para administradores.
- [ ] **Criar Central de Privacidade** (formulário para solicitações de titulares).
- [ ] **Criar ROPA** (Registro de Operações de Dados).
- [ ] **Revisar contratos com fornecedores** (adicionar cláusulas LGPD).

 [opservices.com](https://www.opservices.com.br/lei-geral-de-protecao-de-dados/)

### V1 (4–6 meses)

- [ ] **Implementar controle de acesso por função (RBAC)**.
- [ ] **Implementar logs de auditoria** (quem acessou o quê, quando).
- [ ] **Criar funcionalidade de exportação de dados** (portabilidade).
- [ ] **Criar funcionalidade de exclusão de conta**.
- [ ] **Criar política de retenção** e automatizar exclusão de dados expirados.
- [ ] **Criar Plano de Resposta a Incidentes** (documento interno).
- [ ] **Contratar seguro cibernético** (opcional, recomendado).

 [opservices.com](https://www.opservices.com.br/lei-geral-de-protecao-de-dados/)

### V2 (8–12 meses)

- [ ] **Realizar auditoria interna de LGPD** (ou contratar consultoria).
- [ ] **Implementar monitoramento contínuo** (detecção de acessos anômalos).
- [ ] **Realizar teste de penetração (pentest)** anual.
- [ ] **Criar relatório de conformidade LGPD** (para investidores, clientes corporativos).
- [ ] **Implementar anonimização de dados** para relatórios e analytics.

 [opservices.com](https://www.opservices.com.br/lei-geral-de-protecao-de-dados/)

***

## 6. Riscos de Não Conformidade

| Risco | Consequência | Mitigação |
| ------- | -------------- | ----------- |
| **Não nomear DPO** | Multa de até R$ 50 milhões (2% do faturamento) | Nomear DPO e publicar e-mail no site |
| **Não ter Política de Privacidade** | Multa + publicização da infração | Criar política clara e publicar no site |
| **Vazamento de dados** | Multa + dano reputacional + custos de notificação | Criptografia, MFA, logs, plano de resposta a incidentes |
| **Não atender solicitações de titulares** | Multa + bloqueio de dados | Criar Central de Privacidade e fluxo interno |
| **Reter dados além do prazo** | Multa + eliminação obrigatória | Automatizar exclusão de dados expirados |
| **Contratos sem cláusulas LGPD** | Responsabilidade solidária por vazamento | Revisar contratos com fornecedores |

 [turivius](https://turivius.com/portal/anpd-2026-fiscalizacao-lgpd/?amp=1)

***

## 7. Custos Estimados de Implementação

| Item | Custo Estimado |
| ------ | ---------------- |
| **DPO interno** | R$ 0 (fundador ou funcionário) |
| **DPO terceirizado** | R$ 1.000–R$ 5.000/mês |
| **Política de Privacidade + Termos de Uso** | R$ 2.000–R$ 10.000 (advogado especializado) |
| **Criptografia + MFA + Logs** | R$ 0–R$ 5.000 (já incluso em provedores de cloud) |
| **Central de Privacidade** | R$ 0–R$ 5.000 (desenvolvimento interno) |
| **Auditoria interna** | R$ 0 (interno) ou R$ 10.000–R$ 50.000 (consultoria) |
| **Seguro cibernético** | R$ 5.000–R$ 20.000/ano |
| **Total (MVP)** | **R$ 7.000–R$ 45.000** (one-time) + R$ 1.000–R$ 5.000/mês (DPO terceirizado, se aplicável) |

 [nextguardinsurance](https://www.nextguardinsurance.com/florida-insurance-blog/regulacao-lgpd-seguro-cibernetico-brasil)

***

## 8. Modelo de Política de Privacidade (Estrutura)

```markdown
# Política de Privacidade – RentEasy

## 1. Identidade do Controlador
- **Nome**: RentEasy Tecnologia Ltda.
- **CNPJ**: XX.XXX.XXX/0001-XX
- **Endereço**: Rua X, nº Y, Cidade/UF
- **DPO**: privacidade@renteasy.com.br

## 2. Dados Coletados
- **Locador**: nome, CPF/CNPJ, e-mail, telefone, endereço, dados bancários.
- **Inquilino**: nome, CPF, RG, e-mail, telefone, endereço, dados bancários, profissão, renda.
- **Imóvel**: endereço, matrícula, IPTU, fotos, características.
- **Contrato**: valor do aluguel, índice de reajuste, datas, assinaturas digitais.
- **Pagamentos**: histórico de pagamentos, boletos, PIX, inadimplência.
- **Comunicação**: e-mails, WhatsApp, ligações registradas.
- **Vistoria**: fotos, checklist, observações.

## 3. Finalidades
- Cadastro e autenticação de usuários.
- Formalização e gestão de contratos de locação.
- Cobrança e repasses de aluguéis.
- Vistoria de entrada e saída.
- Notificações de reajuste, vencimento e inadimplência.
- Relatórios financeiros e fiscais.

## 4. Base Legal
- Execução de contrato (Art. 7º, V, LGPD).
- Consentimento (Art. 7º, I, LGPD) para finalidades secundárias.
- Cumprimento de obrigação legal (Art. 7º, II, LGPD) para emissão de NFS-e, DIMOB, IRRF.

## 5. Compartilhamento
- **Gateways de pagamento**: Asaas, Juno, Pagar.me (para processar pagamentos).
- **E-signature**: ClickSign, DocuSign, Zapsign (para assinaturas digitais).
- **E-mail/WhatsApp**: SendGrid, Twilio, Z-API (para notificações).
- **Hospedagem**: AWS, Google Cloud, Azure (para armazenar dados).
- **Contadores**: exportação de relatórios fiscais (se usuário autorizar).

## 6. Prazos de Retenção
- **Cadastro, contrato, pagamentos, vistoria**: 5 anos após término do contrato.
- **Comunicação**: 2 anos após término do contrato.
- **Logs de acesso**: 2 anos.
- **Dados sensíveis**: 2 anos após término do contrato.

## 7. Direitos dos Titulares
- Acesso, correção, exclusão, portabilidade, revogação de consentimento.
- Como solicitar: privacidade@renteasy.com.br ou formulário na Central de Privacidade.
- Prazo de resposta: 15 dias.

## 8. Medidas de Segurança
- Criptografia em trânsito (HTTPS/TLS 1.3) e em repouso (AES-256).
- Autenticação multifator (MFA) para administradores.
- Controle de acesso por função (RBAC).
- Logs de auditoria de todos os acessos.
- Monitoramento contínuo e resposta a incidentes.

## 9. Transferência Internacional
- Dados são armazenados em servidores da AWS/Google Cloud (EUA, Brasil).
- Provedores possuem certificações de segurança (ISO 27001, SOC 2).

## 10. Alterações nesta Política
- Esta política pode ser atualizada. A versão mais recente estará sempre disponível em renteasy.com.br/privacidade.

## 11. Contato
- DPO: privacidade@renteasy.com.br
- ANPD: https://www.gov.br/anpd/pt-br
```

***

## Conclusão

A **LGPD não é opcional** — é **obrigação legal** com **multas reais** (até R$ 50 milhões por infração). O RentEasy precisa implementar conformidade desde o MVP, com:

1. **DPO nomeado** e e-mail publicado.
2. **Política de Privacidade e Termos de Uso** claros.
3. **Controles técnicos** (criptografia, MFA, logs, RBAC).
4. **Processo para direitos dos titulares** (Central de Privacidade).
5. **Prazos de retenção** e eliminação automática.
6. **Plano de resposta a incidentes** (notificação em 3 dias úteis).
7. **Contratos com fornecedores** com cláusulas LGPD.
8. **Evidências de conformidade** (ROPA, auditorias, logs).

**Custo estimado**: R$ 7.000–R$ 45.000 (one-time) + R$ 1.000–R$ 5.000/mês (DPO terceirizado, se aplicável).

**Benefício**: além de evitar multas, a conformidade LGPD é **diferencial competitivo** (ex.: "RentEasy: o único SaaS de aluguel 100% conforme a LGPD").
