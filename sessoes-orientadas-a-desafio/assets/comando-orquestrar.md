# Comando `/orquestrar`

Template do comando que dispara o fluxo de orquestração de sessões de um AMARRACAO existente. O contrato que ele aplica está em `references/orquestracao.md` e no SKILL.md ("Modo de execução").

## Instalação

Copie o bloco abaixo para um dos caminhos de comandos do OpenCode:

- por projeto: `.opencode/command/orquestrar.md` no repositório da demanda;
- global: `~/.config/opencode/command/orquestrar.md` (ou o equivalente em Windows: `%USERPROFILE%\.config\opencode\command\orquestrar.md`).

O comando assume que a skill `sessoes-orientadas-a-desafio` está instalada e acessível.

---

```markdown
---
description: Orquestrar a execução das sessões pendentes de um AMARRACAO (sequencial, subagents em paralelo ou worktrees)
agent: build
---

Você está orquestrando a execução de sessões de uma demanda já fatiada pela skill
`sessoes-orientadas-a-desafio`. Siga este fluxo na ordem. Argumentos do usuário: $ARGUMENTS

1. **Localize o AMARRACAO.** Procure `docs/sessoes/*/AMARRACAO.md` (ou o caminho registrado
   no próprio arquivo). Se houver mais de um e o usuário não indicou qual, pergunte antes
   de ler qualquer outra coisa.

2. **Leia o AMARRACAO** e liste as sessões pendentes cujas dependências já estão concluídas.
   Se nenhuma está pronta, informe o que falta e encerre.

3. **Classifique** as sessões prontas em independentes e acopladas, aplicando a regra dos
   três testes de `references/orquestracao.md`: dependência pendente, território em comum
   (mesmo arquivo/módulo no escopo), contrato compartilhado em mudança.

4. **Proponha o modo** — e só execute após aprovação explícita:
   - Sessões acopladas → sequencial no chat, na ordem do AMARRACAO.
   - Sessões independentes → paralelo com subagents (um por sessão, worktree próprio) ou
     bifurcação manual (worktrees + pacotes de contexto para o usuário conduzir).
   - Se o host não suportar subagents ou worktrees, declare e siga sequencial.

5. **Prepare os handoffs.** Cada subagent recebe o briefing `S0X.md` completo, os artefatos
   de contexto que o briefing lista e as instruções de encerramento (PR, desvios, dívidas,
   descobertas). Briefing incompleto não vai para spawn: complete-o primeiro e mostre.

6. **Execute** conforme o modo aprovado, seguindo o ciclo de vida de `references/orquestracao.md`
   (classificação → proposta → preparação → spawn → monitoramento → coleta → consolidação).

7. **Consolide:** atualize o AMARRACAO você mesmo, sessão por sessão — status, PR, desvios,
   dívidas, bloqueios e o próximo passo. Nenhum subagent escreve no AMARRACAO.

8. **Relate ao usuário** o lote concluído e o próximo passo, no formato do AMARRACAO.

Regras inegociáveis: nada executa sem a aprovação do passo 4; a regra de independência não
tem exceção; sessão falha não derruba o lote; toda atualização do AMARRACAO é feita por você,
coordenador.
```
