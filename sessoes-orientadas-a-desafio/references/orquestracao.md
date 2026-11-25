# Contrato de orquestração

Este documento detalha o contrato do **Modo de execução** (seção do SKILL.md). Ele vale quando sessões de um mesmo AMARRACAO são executadas por mais de um agente — subagents em paralelo ou bifurcação em worktrees.

## Requisitos do host

- **Subagents em paralelo** exige que o host suporte spawn de agentes filhos (ex.: OpenCode, com `subagent` e `worktree_create`).
- **Bifurcação** exige suporte a worktrees git. Sem esses recursos, o modo é **sequencial no chat** — declare a limitação ao usuário; não improvável um meio-termo.
- Se a disponibilidade de recursos não estiver clara, teste uma vez (spawn trivial ou `worktree_list`) antes de propor o modo.

## Divisão de autoridade

| Papel | Manda em | Não manda em |
|---|---|---|
| **Coordenador** (a conversa principal) | ordem, escopo, handoff, coleta de resultados, AMARRACAO | como implementar dentro de cada sessão |
| **Subagent** | como implementar, dentro do briefing da sessão | replanejar a demanda, tocar sessões vizinhas, atualizar o AMARRACAO, expandir escopo |

Regras derivadas:

- O subagent recebe **um briefing, um escopo, um critério de pronto**. Se ele propuser mudanças que escapam do briefing, o coordenador decide: aceita (e registra o desvio no AMARRACAO) ou recusa (e reemite o handoff).
- O subagent **nunca escreve** em `AMARRACAO.md`. Resultados voltam ao coordenador, que consolida e atualiza o arquivo — isso evita escrita concorrente no mesmo documento.
- O subagent pode invocar skills de domínio (o "como"), seguindo o contrato de composição do SKILL.md.

## Handoff — o briefing é o prompt

O handoff de um subagent não usa a conversa. Ele é montado a partir de:

1. `docs/sessoes/<slug>/S0X.md` — o briefing completo da sessão (objetivo, escopo, critério de pronto, contexto mínimo, riscos);
2. `docs/sessoes/<slug>/AMARRACAO.md` e `docs/adr/NNNN-<slug>.md` — apenas se o briefing os listar como contexto mínimo;
3. Instruções de encerramento: "ao terminar, reporte: link do PR, o que foi entregue, desvios do plano, dívidas técnicas, itens descobertos no meio do caminho".

O que **não** vai no handoff: histórico do chat, tópicos fechados na conversa, decisões que já estão registradas nos artefatos. Se uma decisão relevante não está em nenhum artefato, registre-a no briefing antes do spawn — handoff que depende de memória do chat quebra a retomada.

## Independência — a regra dos arquivos em comum

Duas sessões são independentes só quando as três condições valem:

1. **Sem dependência direta ou transitiva pendente** entre elas na tabela do AMARRACAO;
2. **Sem território em comum**: nenhum arquivo ou módulo aparece no "dentro do escopo" das duas;
3. **Sem contrato compartilhado em mudança**: nenhuma das duas altera uma interface que a outra consome (API, schema, evento, tipo público).

Qualquer falha → as sessões são acopladas → sequencial, mesmo que pareçam paralelizáveis. Duas sessões G no mesmo domínio também merecem desconfiança: territorial overlap aparece na execução, não no título.

## Worktrees

- **Um worktree por sessão paralela**, criado pelo coordenador antes do spawn (ex.: `tools.opencode.worktree_create({ name: "<slug>-s03" })`).
- O subagent recebe o caminho do worktree e trabalha **exclusivamente** nele.
- Ao concluir, o coordenador coleta o resultado (branch, PR, testes) e decide: mergear, abrir PR ou deixar para revisão — conforme a convenção do repositório.
- Worktree sem sessão concluída no fim do dia é bloqueio: registre no AMARRACAO antes de removê-lo. Não remova worktree com mudanças não coletadas sem confirmar com o usuário.

## Bifurcação manual

Quando o usuário escolhe conduzir as sessões em janelas separadas:

1. Crie um worktree por sessão;
2. Para cada uma, entregue um **pacote de contexto**: o caminho do briefing `S0X.md`, o worktree e a instrução "siga o briefing; ao terminar, atualize o AMARRACAO";
3. Registre no AMARRACAO que as sessões estão **em andamento e com dono** (status `🔄`), para que a retomada saiba que não pode executá-las;
4. Ao voltar à conversa principal, valide a consistência do AMARRACAO (mesma checagem do Fluxo B) antes de executar qualquer outra coisa.

## Ciclo de vida do modo paralelo

1. **Classificação:** liste as sessões prontas, marque independentes × acopladas (regra acima).
2. **Proposta:** apresente grupos e modo por grupo; espere aprovação.
3. **Preparação:** confira se cada briefing está completo (sete campos do SKILL.md). Briefing incompleto não vai para spawn — complete-o primeiro.
4. **Spawn:** um subagent por sessão independente, cada um no seu worktree, em paralelo.
5. **Monitoramento:** aguarde os resultados; não interfira no "como" de cada um.
6. **Coleta:** por subagent — PR, entregue, desvios, dívidas, descobertas.
7. **Consolidação:** coordenador atualiza o AMARRACAO (status `✅`, PR, desvios, dívidas, próximo passo), uma sessão por vez.
8. **Relatório:** resuma ao usuário o lote concluído e o próximo passo.

## Falhas e exceções

- **Subagent travado ou falho:** não derruba os outros. Colete o que houver, marque a sessão como `🔄` ou `⏳` no AMARRACAO com o motivo, e registre o bloqueio. A sessão falha volta para execução sequencial.
- **Subagent fora do escopo:** se o resultado inclui mudanças fora do briefing, não mergeie em silêncio. Apresente ao usuário: aceita como desvio registrado, ou reverte.
- **Conflito de merge entre worktrees:** sinal de independência mal avaliada. Resolva sequencialmente, registre no AMARRACAO e ajuste a regra de classificação para o próximo lote.
- **Descoberta de nova dependência** (sessão A precisava de B concluída): interrompa o lote, atualize o AMARRACAO, reapresente o plano de execução ao usuário.

## Matriz de conflito com a composição

| Situação | Quem decide | Registro |
|---|---|---|
| Skill de domínio dentro de um subagent | O subagent (é o "como" da sessão dele) | Nada além do briefing, se respeitar escopo |
| Skill de domínio quer tocar outra sessão | Coordenador recusa; vira pendência no AMARRACAO | Pendência ou fora do escopo, com motivo |
| Usuário pede modo de execução diferente do sugerido | Usuário; coordenador obedece | Aprovação registrada no AMARRACAO |
| Host sem subagents/worktrees | Coordenador declara e segue sequencial | Limitação registrada no AMARRACAO |
| Dois subagents reivindicam o mesmo arquivo | Coordenador: não deveria ter acontecido; serializa | Bloqueio + ajuste da regra de independência |
