# Sessões orientadas a desafio

Skill para agentes de código que **divide demandas grandes em sessões independentes antes de escrever qualquer código**. Cada sessão tem escopo pequeno, contexto mínimo e gera um único PR revisável. O estado da demanda fica registrado em ADR e em um arquivo de amarração versionado no repositório, permitindo retomar o trabalho em uma sessão nova sem depender da conversa anterior.

## Por que usar

Uma demanda grande em uma única sessão costuma degradar de três formas:

- o agente acumula arquivos e decisões até perder precisão;
- o PR mistura assuntos e fica impossível de revisar;
- a próxima sessão não consegue retomar sem reconstruir todo o contexto.

A skill ataca os três problemas: fatia a demanda em sessões, define o contexto mínimo de cada uma e mantém o estado em arquivos versionados.

## Quando ela é acionada

Use a skill sempre que o pedido envolver:

- funcionalidade, épico, refatoração ou migração com várias partes;
- "planejar", "quebrar", "fatiar" ou "dividir em etapas/PRs/tarefas";
- um prompt longo com múltiplos requisitos;
- "continuar de onde paramos" ou referência a um `AMARRACAO.md`;
- preocupação com contexto do agente, tamanho de PR ou code review.

Não é para correções pontuais de uma linha nem para perguntas conceituais.

## O que ela produz

| Artefato | Caminho padrão | Papel |
|---|---|---|
| ADR da demanda | `docs/adr/NNNN-<slug>.md` | Registra contexto, opções de divisão, decisão e consequências |
| Amarração | `docs/sessoes/<slug>/AMARRACAO.md` | Fio condutor entre sessões, com status e próximo passo |
| Briefing de sessão | `docs/sessoes/<slug>/S0X.md` | Escopo, contexto mínimo e critério de pronto de cada sessão |
| Descrição de PR | derivada do briefing | Objetivo, mudanças, como testar e pontos de atenção |

Os caminhos são configuráveis: se o repositório usar outra convenção, a skill segue a convenção local e registra os caminhos usados no topo do `AMARRACAO.md`.

## Fluxo

### Demanda nova

1. **Entender** — requisitos explícitos e implícitos, ambiguidades e no máximo 3 perguntas.
2. **Mapear o terreno** — módulos, arquivos e dependências afetados, sem carregar o repositório inteiro.
3. **Fatiar em sessões** — cada uma com ID, objetivo, dentro/fora do escopo, dependências, critério de pronto verificável, tamanho P/M/G e contexto mínimo.
4. **Validar o plano** — a implementação só começa após aprovação explícita.
5. **Registrar o ADR** — incluindo as formas alternativas de dividir a demanda.
6. **Criar o AMARRACAO e os briefings** — com o prompt original preservado na íntegra.
7. **Encerrar cada sessão** — atualizar status, PR, desvios e dívidas no `AMARRACAO.md` antes de concluir.

### Retomada

Ao abrir uma sessão nova, a skill lê primeiro o `AMARRACAO.md` e o ADR, identifica a próxima sessão pendente cuja dependência já foi concluída, confirma com o usuário e carrega **apenas** o contexto listado no briefing daquela sessão.

## Instalação

O repositório contém a pasta da skill. Copie-a para o diretório de skills do seu agente.

**Claude Code (macOS/Linux):**

```bash
git clone https://github.com/yurilimadev/sessoes-orientadas-a-desafio.git
mkdir -p ~/.claude/skills
cp -r sessoes-orientadas-a-desafio/sessoes-orientadas-a-desafio ~/.claude/skills/
```

**Claude Code (Windows/PowerShell):**

```powershell
git clone https://github.com/yurilimadev/sessoes-orientadas-a-desafio.git
New-Item -ItemType Directory -Force "$HOME\.claude\skills" | Out-Null
Copy-Item -Recurse ".\sessoes-orientadas-a-desafio\sessoes-orientadas-a-desafio" "$HOME\.claude\skills\"
```

Para uso apenas em um projeto, copie a pasta para `.claude/skills/` na raiz do projeto. O diretório deve se chamar `sessoes-orientadas-a-desafio`, igual ao campo `name` do `SKILL.md`.

## Como usar

**Demanda nova** — descreva a demanda e peça o plano:

```text
Implementar autenticação com OAuth2 + refresh token + tela de login + auditoria
de acessos em uma API Node existente.
```

A skill apresenta as sessões e espera sua aprovação antes de implementar. Depois da aprovação, ela cria o ADR, o `AMARRACAO.md` e os briefings.

**Retomada** — em uma sessão nova, peça:

```text
continua a demanda de autenticação
```

A skill localiza o `AMARRACAO.md`, confirma a sessão pendente e carrega só o contexto necessário.

## Estrutura do repositório

```
.
├── README.md
└── sessoes-orientadas-a-desafio/
    ├── SKILL.md
    ├── assets/
    │   ├── adr.md
    │   ├── amarracao.md
    │   ├── sessao.md
    │   └── pr.md
    ├── references/
    │   └── criterios-de-corte.md
    └── evals/
        ├── evals.json
        └── fixtures/retomada/
```

- `SKILL.md` — fluxo, princípios e regras que o agente segue.
- `assets/` — templates prontos para ADR, amarração, briefing e descrição de PR.
- `references/criterios-de-corte.md` — heurísticas de fatiamento, tamanhos P/M/G, exemplos bom vs. ruim e anti-padrões.
- `evals/` — três casos de teste (OAuth2, migração de pagamentos e retomada), incluindo um fixture com `AMARRACAO.md` já preenchido.

## Casos de teste

1. Autenticação OAuth2 + refresh token + tela de login + auditoria em uma API Node.
2. Migração do módulo de pagamentos de um monolito para um serviço separado.
3. Retomada de uma demanda com S01 e S02 concluídas e S03 pendente.

Os casos estão em `evals/evals.json`. A execução automatizada depende de um harness com Python e subagentes; os arquivos estão prontos para rodar quando esse ambiente estiver disponível.
