# ADR NNNN — <título da demanda>

- **Data:** AAAA-MM-DD
- **Status:** Proposto | Aceito | Substituído por ADR-XXXX | Descontinuado
- **Demanda:** `<slug>`
- **AMARRACAO:** [docs/sessoes/<slug>/AMARRACAO.md](../sessoes/<slug>/AMARRACAO.md)

## Contexto

<Situação atual, restrições do sistema, do time e do prazo. O que existe hoje e por que a demanda apareceu. Fatos, não opiniões.>

## Problema

<A pergunta que este ADR responde. Em uma ou duas frases: o que precisa ser entregue e qual é a principal tensão (prazo, risco, acoplamento, contexto do agente, tamanho do PR).>

## Opções consideradas

### Opção A — <nome>

- **Descrição:** <como a demanda seria dividida/entregue>
- **Prós:** <...>
- **Contras:** <...>

### Opção B — <nome>

- **Descrição:** <outra forma de dividir, inclusive a opção de fazer tudo em uma sessão ou em fatias horizontais>
- **Prós:** <...>
- **Contras:** <...>

### Opção C — <nome>

- **Descrição:** <...>
- **Prós:** <...>
- **Contras:** <...>

> Inclua sempre a alternativa "uma sessão única" e pelo menos uma forma alternativa de fatiar. O valor do ADR está em mostrar por que a divisão escolhida é melhor, não apenas descrevê-la.

## Decisão

<Opção escolhida e justificativa. Explique o critério de corte: por que essas fronteiras, por que essa ordem, o que ficou de fora e por quê. Aponte o que tornaria esta decisão errada.>

## Consequências

### Positivas

- <...>

### Negativas

- <...>

### Riscos e mitigações

- <risco> → <mitigação>

## Sessões resultantes

| ID | Título | Depende de | Tamanho |
|---|---|---|---|
| S01 | <...> | — | P |
| S02 | <...> | S01 | M |

## Links

- **PRs:** <link do PR de cada sessão, preenchido ao longo da execução>
- **ADRs derivados:** <ADR-XXXX — decisão surgida durante a execução>
- **Documentos relacionados:** <...>

## Histórico

| Data | Mudança | Autor |
|---|---|---|
| AAAA-MM-DD | Criação | <nome> |
