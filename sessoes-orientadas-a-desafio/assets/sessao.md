# S0X — <título curto da sessão>

- **Demanda:** `<slug>`
- **ADR:** [docs/adr/NNNN-<slug>.md](../../adr/NNNN-<slug>.md)
- **AMARRACAO:** [docs/sessoes/<slug>/AMARRACAO.md](AMARRACAO.md)
- **Depende de:** <S01, S02... ou "—">
- **Tamanho estimado:** P | M | G

## Objetivo

<Uma frase com um resultado observável. Exemplo: "Permitir que um usuário troque o refresh token sem reautenticar, com rotação e revogação do token anterior." Evite "implementar a parte de refresh".>

## Dentro do escopo

- <módulo/arquivo/comportamento que pode ser tocado>
- <...>

## Fora do escopo (não tocar)

- <o que parece relacionado mas pertence a outra sessão>
- <refatorações oportunistas, mudanças de contrato, migrações de dados>
- <...>

## Contexto mínimo para iniciar

Leia apenas:

- `caminho/arquivo.ts` — <por que é necessário>
- `caminho/outro.ts` — <por que é necessário>
- `docs/...` — <decisão ou contrato relevante>
- `tests/...` — <teste que define o comportamento atual>

**Não é necessário ler:** <diretórios/módulos que podem ser ignorados nesta sessão>

Se durante a execução surgir a necessidade de ler algo fora desta lista, pare e avalie: pode ser sinal de escopo grande demais ou de dependência não mapeada. Registre no AMARRACAO antes de expandir o contexto.

## Critério de pronto

- [ ] <teste automatizado que deve passar>
- [ ] <comportamento observável manual, se aplicável>
- [ ] <verificação de compatibilidade/regressão, se aplicável>
- [ ] <documentação/observabilidade exigida pela demanda>

## Plano de execução

1. <passo>
2. <passo>
3. <passo>

## Skills de domínio previstas

- <skill de TDD, framework, banco ou PR> — <o que ela decide nesta sessão; "nenhuma" se não houver>

## Riscos e pontos de atenção

- <risco> → <mitigação>

## O que o revisor deve olhar com atenção

- <decisão de design que merece revisão>
- <trecho sensível: segurança, concorrência, migração, contrato público>
- <o que não precisa ser revisado porque já era assim antes>

## Notas para o PR

<Base para `assets/pr.md`: tipo de mudança, escopo, como testar e o que ficou de fora de propósito.>
