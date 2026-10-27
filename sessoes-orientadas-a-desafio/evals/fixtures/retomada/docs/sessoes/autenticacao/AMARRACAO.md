# AMARRACAO — autenticação

- **Demanda:** `autenticacao`
- **ADR:** [docs/adr/0001-autenticacao.md](../../adr/0001-autenticacao.md)
- **Caminhos usados:** ADR em `docs/adr/` · sessões em `docs/sessoes/autenticacao/`
- **Criado em:** 2026-10-01
- **Última atualização:** 2026-10-20

## Resumo da demanda

Adicionar autenticação OAuth2 à API Node existente, com login, refresh token, tela de login e auditoria de acessos. A entrega foi dividida em seis sessões verticais, com a flag de autenticação desligada até o cutover.

## Status das sessões

| ID | Sessão | Status | Depende de | PR | Tamanho |
|---|---|---|---|---|---|
| S01 | Configuração do provedor OAuth2 e modelo de identidade | ✅ concluída | — | [#12](https://example.com/pr/12) | P |
| S02 | Fluxo de login e emissão de access token | ✅ concluída | S01 | [#18](https://example.com/pr/18) | M |
| S03 | Refresh token com rotação e revogação | ⏳ pendente | S02 | — | M |
| S04 | Tela de login integrada ao fluxo | ⏳ pendente | S02 | — | M |
| S05 | Auditoria de acessos | ⏳ pendente | S02 | — | M |
| S06 | Ligar a flag e remover caminho legado | ⏳ pendente | S03, S04, S05 | — | P |

Legenda: ⏳ pendente · 🔄 em andamento · ✅ concluída · 🚫 fora do escopo

## Sessões concluídas

### S01 — Configuração do provedor OAuth2 e modelo de identidade

- **PR:** https://example.com/pr/12
- **Entregue:** configuração do provedor, tabela `identities` e feature flag `auth.oauth2` desligada.
- **Desvios do plano:** nenhum.
- **Dívidas técnicas:** nenhuma.

### S02 — Fluxo de login e emissão de access token

- **PR:** https://example.com/pr/18
- **Entregue:** endpoint `/auth/login`, emissão e validação de access token, testes de integração.
- **Desvios do plano:** o access token passou a ser assinado com RS256 em vez de HS256, por exigência do provedor.
- **Dívidas técnicas:** rotação de chaves ainda manual; registrada como pendente.

## Fora do escopo

| Item | Motivo | Vira demanda futura? |
|---|---|---|
| Login social (Google/GitHub) | Não faz parte do pedido original | Sim — `login-social` |
| MFA | Depende de decisão de produto | Não |

## Desafios em aberto e bloqueios

- A rotação de refresh token precisa de uma decisão sobre janela de graça para tokens recém-rotacionados.
- O ambiente de staging ainda não tem o provedor OAuth2 configurado.

## Próximo passo

Executar **S03 — Refresh token com rotação e revogação**. Antes de começar, ler `S03.md`, `src/auth/token.ts` e `tests/auth/refresh.test.ts`. Depende de S02 concluída.

## Anexo — prompt original

<details>
<summary>Prompt original (íntegro)</summary>

```text
Implementar autenticação com OAuth2 + refresh token + tela de login + auditoria de acessos em uma API Node existente.
```

</details>
