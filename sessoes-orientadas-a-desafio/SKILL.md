---
name: sessoes-orientadas-a-desafio
description: Fatie demandas grandes em sessões de trabalho independentes, cada uma com contexto mínimo e um único PR revisável, antes de escrever qualquer código. Atue como camada de coordenação: defina o quê, a ordem e o contexto, e deixe o como para as skills de domínio. Use SEMPRE que o usuário descrever uma funcionalidade, épico, refatoração ou migração com várias partes; pedir para planejar, quebrar, fatiar ou dividir em etapas/PRs/tarefas; colar um prompt longo com múltiplos requisitos; disser "continuar de onde paramos" ou citar um AMARRACAO.md; ou demonstrar preocupação com contexto do agente, tamanho de PR ou code review. Também use ao retomar uma demanda já fatiada. Não use para correções pontuais de uma linha ou perguntas conceituais.
---

# Sessões orientadas a desafio

## Por que fatiar

Uma demanda grande em uma única sessão degrada de três formas: o agente acumula arquivos e decisões até perder precisão, o PR mistura assuntos e fica impossível de revisar, e a próxima sessão não consegue retomar sem reconstruir toda a conversa. Fatiar antes de codar resolve os três problemas de uma vez: cada sessão tem escopo e contexto pequenos, cada PR tem um único propósito, e o estado fica registrado em arquivos versionados em vez de na memória do chat.

O custo é um passo de planejamento no início. Ele se paga na primeira revisão e na primeira retomada.

## Princípios

- **Uma sessão = uma responsabilidade = um PR.** Se o título do PR precisa de "e", provavelmente são duas sessões.
- **Contexto mínimo.** Cada sessão lista os arquivos e documentos que devem ser lidos. O resto do repositório fica de fora.
- **Nenhum código antes do plano aprovado.** Planejar é barato; refazer um PR grande não é.
- **O sistema continua funcionando entre sessões.** Use feature flag, expand/contract ou adaptador quando a entrega for parcial.
- **Tudo em português do Brasil**, incluindo ADR, AMARRACAO, briefings e descrição de PR.

## Papel e composição

Esta skill é uma **camada de coordenação**, não uma implementadora. Ela decide o quê entra em cada sessão, em que ordem, com qual contexto e qual é o limite do PR. O **como** — padrões de código, framework, estilo de teste, segurança, formato de commit — pertence às skills de domínio e às convenções do repositório.

Ela foi feita para conviver com outras skills. O contrato é:

- **Divisão de autoridade.** Esta skill manda em escopo, sequência, dependências, critério de pronto e tamanho do PR. A skill de domínio manda em como implementar. Convenções do repositório e instruções explícitas do usuário vêm antes das duas.
- **Handoff, não substituição.** Ao usar outra skill dentro de uma sessão, passe o objetivo, o dentro/fora do escopo e o critério de pronto. Não peça para ela replanejar a demanda inteira.
- **Sem fontes de verdade duplicadas.** Se já existe plano, ADR, tracker ou template de PR, use e referencie; não crie um paralelo.
- **Conflito real se resolve com o usuário.** Se duas instruções incompatíveis apontarem para resultados diferentes, pare e apresente o conflito com opções. Não escolha em silêncio nem ignore uma das skills.
- **O escopo aprovado continua valendo.** Outra skill pode propor mudanças; se aceitas, atualize o briefing e o AMARRACAO antes de continuar.

Detalhes, matriz de conflitos comuns e exemplos: `references/composicao-com-outras-skills.md`.

## Passo 0 — Identificar o modo

Antes de qualquer coisa, procure um arquivo de amarração existente:

```
docs/sessoes/*/AMARRACAO.md
```

Se o repositório usar outro caminho (veja "Artefatos e caminhos"), procure lá.

- **Existe e o pedido é retomada** ("continuar de onde paramos", cita o arquivo, pergunta o que falta) → siga o **Fluxo B**.
- **Não existe, ou o pedido é uma demanda nova** → siga o **Fluxo A**.
- **Existe mas o pedido é uma demanda diferente** → Fluxo A, criando um novo slug; não misture demandas no mesmo AMARRACAO.

Se houver mais de um AMARRACAO e o usuário não disser qual, pergunte antes de ler qualquer outra coisa.

Se o repositório já tiver plano, spec, tracker ou ADR para a demanda, use-os como base e registre o vínculo no AMARRACAO em vez de criar artefatos paralelos.

## Fluxo A — Demanda nova

### 1. Entender

Releia o prompt e produza, internamente ou em rascunho:

- requisitos **explícitos** (o que foi pedido);
- requisitos **implícitos** (o que o pedido assume: testes, migração, compatibilidade, observabilidade);
- **ambiguidades** que mudam o fatiamento.

Faça no máximo **3 perguntas** e agrupe-as em uma única mensagem. Se a resposta não mudar o plano, assuma o padrão mais conservador, registre a suposição no ADR e siga. Não transforme a etapa de entendimento em interrogatório.

### 2. Mapear o terreno

Descubra o suficiente para estimar, sem carregar o repositório inteiro:

- estrutura de pastas, README, manifesto de dependências e scripts de teste;
- módulos e arquivos que a demanda toca, usando busca por nome e conteúdo;
- contratos existentes (API, banco, eventos) e testes que os protegem;
- o que já existe e pode ser reutilizado.

Registre os arquivos-chave por sessão. Se precisar ler mais de ~10 arquivos para entender uma única sessão, esse é um sinal de que a fatia está grande.

### 3. Fatiar em sessões

Proponha **N sessões ordenadas**. Cada uma precisa dos sete campos abaixo; sem eles a sessão não está pronta para ser executada:

| Campo | O que deve conter |
|---|---|
| **ID e título** | `S01 — <título curto>`; o título deve caber em uma linha de PR |
| **Objetivo** | uma frase com um resultado observável |
| **Dentro do escopo** | arquivos, módulos e comportamentos que podem ser tocados |
| **Fora do escopo** | o que não pode ser tocado nesta sessão, mesmo que pareça relacionado |
| **Dependências** | IDs de sessões que precisam estar concluídas antes |
| **Critério de pronto** | teste, comando ou comportamento verificável — nunca "implementar X" |
| **Tamanho e contexto** | P/M/G com alerta acima de G; lista dos arquivos e documentos a ler |

Ordem esperada: contrato/modelo → backend → integração → interface → migração/cutover → limpeza. Ajuste conforme o domínio, mas mantenha dependências acíclicas.

Consulte `references/criterios-de-corte.md` para as heurísticas, definições de P/M/G e exemplos de fatiamento bom e ruim.

### 4. Validar o plano

Apresente a tabela de sessões ao usuário com objetivo, dependências, critério de pronto e tamanho. Peça aprovação explícita. Se o host já tiver um modo de plano/aprovação, use-o como checkpoint em vez de criar um segundo.

- Aprovado → siga para o ADR e os artefatos.
- Ajustes → refaça o fatiamento e apresente de novo.
- Nunca comece a implementar "só a primeira parte" enquanto o plano não estiver aprovado.

### 5. Registrar o ADR

Crie `docs/adr/NNNN-<slug>.md` a partir de `assets/adr.md`. Use o próximo número livre. O ADR registra a demanda, as opções de divisão consideradas, a decisão e as consequências. Se já existir um ADR para esta demanda, atualize-o ou referencie-o; não crie um duplicado. Decisões arquiteturais relevantes que surgirem durante as sessões viram **novos ADRs**, que referenciam o original — não reescreva o ADR da demanda para esconder mudanças de rumo.

### 6. Criar o AMARRACAO e os briefings

- `docs/sessoes/<slug>/AMARRACAO.md` a partir de `assets/amarracao.md`, com todas as sessões e o prompt original preservado na íntegra no anexo.
- `docs/sessoes/<slug>/S0X.md` para cada sessão, a partir de `assets/sessao.md`.

O briefing é a fonte de verdade da sessão: ele deve bastar para uma sessão nova começar sem reler a conversa anterior.

### 7. Encerrar cada sessão

Antes de escrever o resumo final ou considerar a sessão terminada:

- [ ] Atualize o status da sessão no AMARRACAO (`🔄` → `✅`).
- [ ] Registre o link do PR, o que foi entregue, os desvios do plano e as dívidas criadas.
- [ ] Mova itens descobertos no meio do caminho para **pendentes** ou **fora do escopo** — nunca os inclua na sessão atual.
- [ ] Atualize bloqueios e o **próximo passo**.
- [ ] Gere a descrição do PR a partir de `assets/pr.md`.
- [ ] Rode os testes/verificações do critério de pronto.

Uma sessão não está concluída enquanto o AMARRACAO não refletir a realidade.

## Fluxo B — Retomada

1. **Localize** o AMARRACAO (ou confirme qual usar, se houver vários).
2. **Leia** o AMARRACAO e o ADR referenciado. Só isso nesta etapa.
3. **Escolha** a próxima sessão pendente cujas dependências já estejam concluídas. Se houver mais de uma possível, pergunte qual executar.
4. **Confirme** com o usuário: "Vou executar S0X — <título>". Não replaneje a demanda inteira; se o plano estiver errado, registre o desvio e proponha um ajuste explícito.
5. **Carregue apenas o contexto mínimo** listado no briefing da sessão (arquivos, documentos e testes). Não leia o restante do repositório "por segurança".
6. **Execute** a sessão e siga o checklist de encerramento acima. Se precisar de outra skill para o "como", invoque-a dentro do escopo e siga o contrato de composição.

Se o AMARRACAO estiver inconsistente (status sem PR, dependência não concluída, sessão em andamento sem dono), corrija o arquivo antes de implementar.

## Regras do contrato

- Não implementar antes de o plano de sessões ser aprovado. Se o usuário pedir explicitamente para dispensar o plano, confirme uma vez e registre a dispensa no AMARRACAO.
- Não encerrar sessão sem atualizar o AMARRACAO.
- Item descoberto no meio do caminho não entra na sessão atual: vai para o AMARRACAO como pendente ou fora do escopo, com motivo.
- Todo artefato criado por esta skill é em português do Brasil. Se outra skill ou convenção do repositório exigir outro idioma, trate como conflito: pergunte ao usuário e registre a decisão.
- Não misturar refatoração com funcionalidade nova no mesmo PR.
- Não deixar o sistema quebrado entre sessões; se a entrega é parcial, use feature flag ou expand/contract.
- Em conflito real com outra skill, não escolha em silêncio: exponha o conflito e peça a decisão do usuário.
- Não duplicar plano, ADR, tracker ou descrição de PR que já existam; referencie-os.
- Esta skill decide o quê, a ordem e o contexto; skills de domínio decidem o como.

## Artefatos e caminhos

| Artefato | Caminho padrão |
|---|---|
| ADR da demanda | `docs/adr/NNNN-<slug>.md` |
| Amarração entre sessões | `docs/sessoes/<slug>/AMARRACAO.md` |
| Briefing de sessão | `docs/sessoes/<slug>/S0X.md` |
| Descrição de PR | derivada do briefing com `assets/pr.md` |

Os caminhos são configuráveis: se o usuário, o `AGENTS.md` ou a convenção do repositório indicarem outro local (por exemplo `docs/decisoes/` ou `adr/`), siga a convenção local. Registre no topo do AMARRACAO os caminhos efetivamente usados, para que a próxima sessão não precise adivinhar.

## Checklist de início

- [ ] Identifiquei se é demanda nova ou retomada.
- [ ] Li o AMARRACAO e o ADR (retomada) ou mapeei o terreno (demanda nova).
- [ ] Tenho uma sessão única, com escopo, dependências e critério de pronto.
- [ ] Sei quais arquivos ler e quais não ler.
- [ ] Confirmei com o usuário qual sessão executar.

## Referências

- `references/criterios-de-corte.md` — heurísticas de fatiamento, P/M/G, exemplos bom vs. ruim e anti-padrões.
- `references/composicao-com-outras-skills.md` — precedência, handoff, matriz de conflitos e exemplos de convivência com skills de domínio.
- `assets/adr.md` — template de ADR (Nygard/MADR).
- `assets/amarracao.md` — template do fio condutor entre sessões.
- `assets/sessao.md` — template de briefing de sessão.
- `assets/pr.md` — template de descrição de PR.
