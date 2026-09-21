# Revisão jurídica — box de resumo LGPD (/privacy)

Pesquisa feita em 01/09/2026. Fontes primárias/oficiais, checadas na data.

## O que foi implementado

Box de resumo em linguagem simples no topo de `/privacy`, antes do texto jurídico
completo — modelo de "notice em camadas" (resumo + política detalhada).

## Base legal

- **Art. 9º, caput, LGPD** — direito do titular a informação "de forma clara,
  adequada e ostensiva". [planalto.gov.br](http://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709compilado.htm)
- **Art. 6º, VI, LGPD** — princípio da transparência: "informações claras,
  precisas e facilmente acessíveis". Mesma fonte.
- Prática de mercado (notice em camadas) documentada em
  [Confidata, 2026](https://confidata.com.br/blog/politica-privacidade-2026-anpd-modelos).

## Correção sugerida (não aplicada sem revisão)

A página já existente cita "Art. 18, LGPD" para o prazo de resposta de 15 dias.
O prazo de 15 dias está no **Art. 19, II** (declaração completa mediante
requerimento). O Art. 18 lista os direitos do titular, mas não fixa esse prazo.
Troquei a citação no bloco de código acima — confirmar antes de publicar.

## Perguntas para o advogado

1. **Enquadramento como ATPP** (Resolução CD/ANPD nº 2/2022, agente de
   tratamento de pequeno porte — startups/ME/EPP): permite dispensar o DPO
   formal (bastando canal de contato) e dobra os prazos de resposta ao
   titular. Hoje o app trata `DPO_EMAIL` como obrigatório
   (`src/lib/env.ts`). Vale formalizar o enquadramento ou manter o DPO
   voluntariamente? [Texto da resolução](https://www.gov.br/anpd/pt-br/acesso-a-informacao/institucional/atos-normativos/regulamentacoes_anpd/resolucao-cd-anpd-no-2-de-27-de-janeiro-de-2022).
2. **Prazo de comunicação de incidente**: Resolução CD/ANPD nº 15/2024 é
   citada por múltiplas fontes secundárias como "3 dias úteis", mas não
   fetchei o texto integral da resolução — confirmar prazo exato e se o
   regime de pequeno porte (pergunta 1) o dobra.
3. **Retenção de 5 anos** (seção 5, já existente na página, não tocada
   aqui): confirmar se é obrigação legal específica (ex.: prescrição civil,
   Art. 206, CC) ou política interna — o texto atual não cita a base.

## Contexto institucional (não afeta o texto da página, FYI)

ANPD passou por reestruturação institucional em 2026 (Lei nº 15.352/2026,
alterando o Art. 55-A da LGPD) — ganhou órgãos típicos de agência reguladora
(Conselho Diretor, Procuradoria, Auditoria) dentro do Ministério da Justiça e
Segurança Pública. Não muda nada no texto da política, só contexto de
atualidade caso o advogado queira citar.
