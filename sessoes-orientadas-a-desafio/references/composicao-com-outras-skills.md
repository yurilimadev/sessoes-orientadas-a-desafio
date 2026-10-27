# Composição com outras skills

Esta skill é uma camada de coordenação. Ela não substitui skills de domínio: define **o quê**, **em que ordem** e **com qual contexto**; a skill de domínio define **como**. As duas podem trabalhar juntas desde que cada uma respeite a dimensão da outra.

## Princípio do consenso

Não existe conflito quando as dimensões estão separadas. Existe conflito quando duas instruções disputam a mesma decisão e apontam para resultados diferentes.

Para a mesma dimensão, a precedência é:

1. Instrução explícita do usuário na conversa.
2. Segurança, privacidade e compliance.
3. Convenção documentada do repositório (`AGENTS.md`, README, ADRs existentes, configuração de lint/teste).
4. A skill dona daquela dimensão (tabela abaixo).
5. Defaults genéricos do agente.

Se o item 1 ou 2 contrariar esta skill, eles vencem. Se o conflito for entre esta skill e uma skill de domínio sobre a mesma dimensão, pare e pergunte — não escolha em silêncio.

## Divisão de autoridade

| Dimensão | Quem decide | Exemplos |
|---|---|---|
| Escopo da sessão, ordem, dependências, critério de pronto, tamanho do PR | **esta skill** | o que entra em S03; S03 depende de S02 |
| Como implementar, padrões de código, bibliotecas, estilo de teste | **skill de domínio / convenção do repo** | TDD, framework, acesso a banco |
| Segurança, privacidade, compliance | **regras do repo/organização** | nunca relaxar uma exigência para caber na sessão |
| Formato, local e idioma dos artefatos | **convenção existente; esta skill se adapta** | ADR em `docs/adr/` ou `adr/` |
| Commit, branch, PR, merge | **política do repo ou skill de PR** | squash, conventional commits, template de PR |
| Prioridade do produto e o que entra na demanda | **usuário** | cortar escopo, adiar sessão |

## Contrato de handoff

Ao usar outra skill dentro de uma sessão:

1. **Identifique a skill certa** para o "como". Não peça a ela para replanejar a demanda inteira.
2. **Passe o pacote de contexto**: objetivo da sessão, dentro/fora do escopo, critério de pronto, arquivos do briefing e restrições relevantes.
3. **Deixe a skill executar dentro do pacote.** Se ela propuser expandir o escopo, avalie contra o briefing.
4. **Se a expansão for necessária**, atualize o briefing e o AMARRACAO antes de continuar. Se for outro assunto, crie uma sessão nova ou registre como pendente.
5. **Ao voltar**, atualize o AMARRACAO com entregue, desvios e dívidas.
6. **Se a skill criar artefatos próprios**, referencie-os no AMARRACAO em vez de copiar o conteúdo.

## Fontes de verdade

Evite duas listas de status, dois planos ou dois ADRs para a mesma decisão. Escolha uma fonte de verdade e referencie as demais.

| Já existe | O que fazer |
|---|---|
| Plano, spec ou documento de requisitos | Use como entrada do fatiamento; o AMARRACAO aponta para ele |
| ADR da demanda | Atualize ou referencie; não crie um ADR paralelo |
| Tracker de tarefas | Mantenha o status lá e espelhe só o link no AMARRACAO; se o agente não puder atualizar o tracker, o AMARRACAO é a fonte e linka o tracker |
| Template de PR | Use o do repositório; o briefing fornece o conteúdo |
| Modo de plano/aprovação do host | Use o mecanismo nativo; não crie um segundo checkpoint |
| Outra skill com estado de sessão próprio | Defina uma única fonte de verdade e referencie a outra |

## Matriz de conflitos comuns

| Situação | Sinal | Resolução |
|---|---|---|
| Skill de implementação quer fazer tudo de uma vez | "implemente a feature completa" | Explique o custo de revisão e proponha fatiar. Se a skill não permitir entrega parcial, registre o conflito e peça decisão. |
| Skill de TDD quer escrever o teste antes do contrato | ciclo vermelho-verde-refatorar | TDD decide o ciclo; esta skill garante que o critério de pronto da sessão está coberto. Não imponha a ordem interna dos testes. |
| Skill de PR quer um PR por commit ou um PR gigante | automação de PR | A política do repo decide a mecânica; esta skill define o limite lógico. Se o repo exigir squash, registre que o PR da sessão continua sendo a unidade revisável. |
| Skill de brainstorming quer explorar antes de fatiar | ainda não há consenso | Brainstorming conduz a exploração; esta skill espera o consenso e então fatia. Não force um plano prematuro. |
| Projeto já tem `docs/plan.md` ou tracker | arquivo existente | Use-o; o AMARRACAO referencia e guarda só contexto mínimo e próximo passo. |
| Projeto escreve documentação em outro idioma | convenção | Trate como conflito com a regra de pt-BR: pergunte ao usuário e registre a decisão. |
| Skill de documentação tem outro formato de ADR | template existente | Use o formato dela, preservando os campos mínimos: contexto, problema, opções, decisão, consequências, status e links. |
| Skill de migração propõe big-bang | corte único | Proponha expand/contract ou cutover gradual. Se for inviável, documente o risco no ADR e peça decisão. |
| Skill de segurança exige uma etapa extra | requisito de segurança | Segurança vence. Adicione a etapa como sessão ou amplie o escopo com aprovação explícita. |
| Usuário pede para pular o plano | "só implementa" | Confirme uma vez; se ele mantiver, registre a dispensa no AMARRACAO e execute em uma única sessão, mantendo o escopo explícito. |
| Conflito irreconciliável | duas regras incompatíveis | Pare e apresente o conflito em duas ou três linhas, com opções. Não escolha sozinho. |

## Exemplos

### TDD + esta skill

O briefing da S03 define o comportamento observável: refresh token de uso único, rotação e revogação. A skill de TDD decide a ordem red-green-refactor e o estilo dos testes. Esta skill não dita o teste; ela verifica se o critério de pronto foi coberto e atualiza o AMARRACAO.

### Skill de PR + esta skill

Esta skill define que a S03 é um PR isolado. A skill de PR define título, corpo e checks. Use o template dela e preencha com o briefing da S03; o AMARRACAO recebe o link do PR.

### Spec-driven development + esta skill

O projeto já tem `specs/auth.md` e uma lista de tarefas. Não crie um plano paralelo: use a spec como entrada, fatie as sessões a partir dela e registre no AMARRACAO que a fonte de requisitos é a spec.

### Tracker externo + esta skill

Se o time usa um tracker, o status oficial fica lá. O AMARRACAO mantém apenas o que é específico do agente — contexto mínimo, decisões e próximo passo — e linka o item correspondente. Se o agente não puder atualizar o tracker, diga isso explicitamente no AMARRACAO.

## Checklist de composição

- [ ] Sei quais outras skills estão ativas e qual dimensão cada uma decide.
- [ ] O escopo da sessão está explícito e não foi ampliado silenciosamente.
- [ ] Não criei plano, ADR, tracker ou descrição de PR duplicados.
- [ ] O handoff passou objetivo, escopo e critério de pronto.
- [ ] Conflito real? Perguntei ao usuário em vez de decidir sozinho.
- [ ] O AMARRACAO referencia os artefatos externos e foi atualizado.

## Sinais de composição mal resolvida

- dois arquivos de status divergentes;
- o PR da sessão toca arquivos fora do escopo aprovado;
- uma skill de domínio foi usada para replanejar a demanda inteira;
- uma regra de segurança foi relaxada para caber na sessão;
- o usuário não sabe qual plano vale;
- o agente criou um ADR novo para uma decisão que já tinha ADR.
