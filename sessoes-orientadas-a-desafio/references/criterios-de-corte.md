# Critérios de corte

Guia para decidir onde uma demanda deve ser dividida. Use junto com o passo 3 do `SKILL.md`.

## Regra de ouro

Cada sessão deve ser pequena o suficiente para caber no contexto do agente e grande o suficiente para entregar algo verificável. O alvo não é "o menor PR possível", é **um PR com um único propósito que alguém consegue revisar em uma sentada**.

## Heurísticas

### 1. Uma responsabilidade por sessão

Se o título precisa de "e" para descrever o que a sessão faz, provavelmente são duas sessões. O mesmo vale para o PR: "adiciona refresh token e cria tela de login" são dois propósitos.

Exceção: mudanças mecânicas inseparáveis (renomear um símbolo e atualizar todos os usos) contam como uma responsabilidade.

### 2. Prefira fatias verticais

Uma fatia vertical atravessa as camadas necessárias para entregar um comportamento observável: contrato, lógica, persistência e, quando fizer sentido, interface. Ela permite testar e demonstrar valor.

Fatias horizontais ("S01 backend", "S02 frontend", "S03 testes") tendem a produzir PRs que não entregam nada sozinhos, dependem de trabalho não integrado e escondem surpresas na integração. Use fatias horizontais apenas quando a camada for genuinamente independente e o contrato já estiver acordado.

### 3. Isole o que é arriscado

Estas categorias merecem sessão própria, mesmo que pareçam pequenas:

- **migração de dados** — schema, backfill, reconciliação, rollback;
- **mudança de contrato público** — API, evento, formato de arquivo, assinatura de função usada por outros times;
- **refatoração mecânica ampla** — renomear, mover, trocar biblioteca, formatar;
- **cutover e desligamento** — trocar tráfego, remover caminho antigo, apagar tabela;
- **observabilidade e auditoria** — quando exigem decisões próprias de retenção e privacidade.

Misturar qualquer uma delas com funcionalidade nova transforma o PR em uma revisão de duas coisas ao mesmo tempo, e fica impossível separar regressão de mudança de comportamento.

### 4. Respeite as dependências

Modele as sessões como um grafo acíclico. A ordem típica é:

```
contrato/modelo → núcleo da funcionalidade → integração → interface
→ migração/cutover → limpeza
```

Uma sessão só pode depender de sessões anteriores. Se duas sessões se dependem mutuamente, o corte está errado: extraia o contrato comum para uma sessão anterior.

PRs empilhados (*stacked PRs*) são aceitáveis, mas o briefing deve dizer em qual branch/PR a sessão se apoia. O critério de pronto continua sendo verificável de forma isolada.

### 5. Não quebre o sistema entre sessões

Se a sessão entrega apenas parte do comportamento, o sistema precisa continuar funcionando. Padrões úteis:

- **feature flag** desligada por padrão, ligada em uma sessão posterior;
- **expand/contract**: adicione o novo caminho, migre o uso, só então remova o antigo;
- **adaptador/anti-corruption layer**: o código antigo chama o novo por uma interface estável;
- **dark launch**: o novo caminho roda em paralelo sem ser fonte de verdade.

"O sistema fica quebrado até a S05" não é um plano aceitável.

### 6. Orçamento de contexto

O contexto de uma sessão inclui arquivos lidos, histórico relevante e decisões acumuladas. Sinais de que a fatia está grande:

- o briefing lista mais de ~10 arquivos para ler;
- a sessão toca mais de ~3 módulos/pacotes;
- seria necessário entender dois contratos públicos ao mesmo tempo;
- a descrição do PR precisaria explicar mais de um comportamento novo;
- o agente precisaria "relembrar" decisões de mais de uma sessão anterior.

Nesses casos, corte por comportamento ou por fronteira de módulo, não por camada.

### 7. Estime o tamanho (P/M/G)

As faixas abaixo são heurísticas para código de aplicação; ajuste ao repositório. O importante é o alerta, não o número exato.

| Tamanho | Diff aproximado | Arquivos | Revisão | Ação |
|---|---|---|---|---|
| **P** | até ~200 linhas | até 5 | < 30 min | ideal para sessões de contrato, configuração e limpeza |
| **M** | até ~500 linhas | até 10 | < 1 h | tamanho normal de uma fatia vertical |
| **G** | até ~1.000 linhas | até 20 | < 2 h | aceitável só com justificativa no briefing |
| **acima de G** | > ~1.000 linhas | > 20 | > 2 h | **divida**; não é um PR revisável |

Se a estimativa passar de G, divida antes de começar. Se for impossível dividir (por exemplo, renomeação mecânica em todo o repositório), divida por diretório/pacote ou negocie explicitamente com o usuário um PR excepcional, registrando o motivo no ADR.

### 8. Use um spike quando a incerteza for alta

Se não dá para definir o critério de pronto porque a abordagem é desconhecida, crie uma sessão de **spike** timeboxed: investigar, documentar a decisão e, se necessário, criar um ADR derivado. O spike não entrega produção; ele reduz a incerteza para as sessões seguintes.

### 9. Reconheça sinais de corte ruim

- "S01 — implementar autenticação" (grande demais, sem critério observável).
- "S01 — backend; S02 — frontend" (horizontal, não entrega valor isolado).
- "S01 — refatorar o módulo e adicionar a feature" (dois propósitos).
- "S02 — ajustes finais" (escopo indefinido, vira depósito).
- "Aproveitar para..." / "já que estamos aqui..." (scope creep).
- "Depende de S03, que ainda não foi planejada" (dependência não resolvida).
- Critério de pronto "código implementado" (não é verificável).

## Exemplos

### Exemplo 1 — Autenticação OAuth2 + refresh token + login + auditoria

**Ruim**

| ID | Sessão |
|---|---|
| S01 | Implementar autenticação completa |
| S02 | Ajustes e testes |

Problemas: S01 é G+ e mistura contrato, backend, interface e auditoria; S02 não tem escopo nem critério.

**Bom**

| ID | Sessão | Depende de | Tamanho |
|---|---|---|---|
| S01 | Configuração do provedor OAuth2 e modelo de identidade (flag desligada) | — | P |
| S02 | Fluxo de login e emissão de access token | S01 | M |
| S03 | Refresh token com rotação e revogação | S02 | M |
| S04 | Tela de login integrada ao fluxo | S02 | M |
| S05 | Auditoria de acessos (eventos, retenção e consulta) | S02 | M |
| S06 | Ligar a flag, remover caminho legado e limpar configuração | S03, S04, S05 | P |

Por que funciona: cada sessão tem um comportamento observável, S04 pode andar em paralelo com S03, a auditoria não contamina o fluxo de login, e o sistema permanece funcional porque a flag começa desligada.

### Exemplo 2 — Migrar pagamentos do monolito para um serviço

**Ruim**

| ID | Sessão |
|---|---|
| S01 | Mover o módulo de pagamentos para o novo serviço |
| S02 | Refatorar o que sobrou |

Problemas: S01 é uma migração big-bang, mistura contrato, dados e cutover; S02 é um depósito sem critério.

**Bom**

| ID | Sessão | Depende de | Tamanho |
|---|---|---|---|
| S01 | Contrato do serviço de pagamentos e anti-corruption layer no monolito | — | M |
| S02 | Extrair o domínio de pagamentos para o novo serviço (tráfego 0%) | S01 | G |
| S03 | Outbox e reconciliação entre monolito e serviço | S02 | M |
| S04 | Migração e backfill dos dados históricos | S03 | M |
| S05 | Cutover gradual por feature flag e percentual | S04 | M |
| S06 | Desligar o caminho antigo e remover código morto | S05 | P |

Por que funciona: contrato antes da extração, dados isolados, cutover separado da migração, e cada etapa pode ser revertida sem perder consistência.

## Anti-padrões

- **Fatiar por camada** quando a camada não entrega comportamento sozinha.
- **Misturar refatoração com funcionalidade** no mesmo PR.
- **Sessão sem critério de pronto verificável.**
- **Sessão "de ajustes"** sem lista fechada de itens.
- **Dependência circular** entre sessões.
- **Deixar o sistema quebrado** entre sessões.
- **Plano gigante** com 20 sessões: agrupe o que é trivial e só detalhe as próximas 3–5; o resto pode ser refinado depois, desde que o AMARRACAO registre a visão geral.
- **Fatiar demais**: sessões de 10 linhas que só fazem sentido juntas geram burocracia e PRs vazios.

## Tabela de decisão rápida

| Situação | Corte |
|---|---|
| Apareceu "e também" no escopo | Nova sessão |
| Precisa alterar schema ou migrar dados | Sessão própria, antes ou depois do código, nunca junto |
| Muda contrato usado por outro time | Sessão de contrato primeiro |
| Refatoração ampla + feature | Duas sessões; refatoração primeiro se desbloqueia a feature |
| Mais de ~10 arquivos ou ~3 módulos | Divida por comportamento ou fronteira de módulo |
| Não sei como fazer | Spike timeboxed antes |
| Entrega parcial quebraria o sistema | Feature flag / expand-contract |
| Só renomeação/mudança mecânica | Pode ser uma sessão única, mesmo grande, com justificativa |
