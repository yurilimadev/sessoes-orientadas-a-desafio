# ADR 0001 — Autenticação OAuth2

- **Data:** 2026-10-01
- **Status:** Aceito
- **Demanda:** `autenticacao`
- **AMARRACAO:** [docs/sessoes/autenticacao/AMARRACAO.md](../sessoes/autenticacao/AMARRACAO.md)

## Contexto

A API Node não possui autenticação própria. O produto precisa de login, sessão renovável e trilha de auditoria sem reescrever a camada HTTP existente.

## Problema

Entregar OAuth2, refresh token, tela de login e auditoria em um único PR seria grande demais para revisar e arriscado para o sistema em produção.

## Opções consideradas

### Opção A — Uma sessão única

- **Descrição:** implementar tudo de uma vez.
- **Prós:** entrega rápida no papel.
- **Contras:** PR G+, mistura contrato, UI, dados e auditoria; revisão inviável.

### Opção B — Fatias verticais com feature flag

- **Descrição:** seis sessões (configuração, login, refresh, tela, auditoria, cutover), com a flag desligada até o fim.
- **Prós:** PRs pequenos, sistema funcional entre sessões, paralelismo entre S03/S04/S05.
- **Contras:** mais overhead de planejamento e uma flag temporária.

### Opção C — Backend e frontend separados

- **Descrição:** S01 backend, S02 frontend.
- **Prós:** menos sessões.
- **Contras:** S02 não entrega nada testável sem S01; integração fica para o fim.

## Decisão

Opção B. As fatias verticais permitem revisão isolada e mantêm o sistema funcional; a flag `auth.oauth2` cobre a entrega parcial.

## Consequências

### Positivas

- PRs pequenos e com um propósito.
- Auditoria não contamina o fluxo de login.
- Cutover reversível.

### Negativas

- Flag temporária precisa ser removida na S06.
- Mais arquivos de planejamento.

## Sessões resultantes

| ID | Título | Depende de | Tamanho |
|---|---|---|---|
| S01 | Configuração do provedor e modelo de identidade | — | P |
| S02 | Login e emissão de access token | S01 | M |
| S03 | Refresh token com rotação e revogação | S02 | M |
| S04 | Tela de login | S02 | M |
| S05 | Auditoria de acessos | S02 | M |
| S06 | Ligar flag e remover legado | S03, S04, S05 | P |

## Links

- **PRs:** #12 (S01), #18 (S02)
- **ADRs derivados:** nenhum
