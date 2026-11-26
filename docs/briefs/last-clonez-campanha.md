# Brief: campanha de 30 dias do Last CloneZ

Fonte única: `docs/HISTORIA.md` (v23). Regras do repositório: `AGENTS.md`. Este brief diz **o que construir a seguir e como provar que está feito**, uma tarefa por PR.

## 1. Objetivo e hipótese
Acreditamos que uma campanha de 30 dias com uma pista por área, um calendário com razões dentro da história e dias de 15 minutos reais prende o jogador em mobile. A primeira prova é a **demo do itch.io** (Cold Vale + cinema, 15 min). Metas para a demo, a ler com `tracking-game-metrics`: ≥ 60% dos jogadores chegam ao cinema e ≥ 35% saem pela janela com a estátua.

## 2. Fora do âmbito (não construir)
Contas, backend, multiplayer, loja, anúncios reais, SDK de analytics real, localização (o texto do jogo é só em inglês), arte nova antes de a área funcionar em graybox, refactors fora da tarefa.

## 3. Ciclo principal
Explorar a área aberta no dia → conseguir ferramentas ou recursos → cumprir o desafio da área → receber a pista (coordenada parcial) → sobreviver à noite → o dia fecha com resumo e save. Falhar ensina (tentativa e erro); as áreas cumpridas continuam abertas nos seus dias, sem voltar a dar pista. Com 2 dias parado no mesmo objetivo, aparece uma dica por dia, em 3 níveis.

## 4. Controlos e sensação
Os controlos atuais do jogo, sem alterações. Os momentos que contam: a horda de 50 a entrar no cinema, o vidro a partir na fuga, a proteção dos bosses a cair com a dica no ecrã.

## 5. Pipeline de conteúdo: registo de desafios
Cada desafio é um registo com id `<area>.<desafio>` (secção 16) que declara a área, os dias (via `Campaign.areas`), os pré-requisitos (`Campaign.missing`), o objetivo, a falha, a recompensa e a pista. Cada registo tem um teste headless em `tests/smoke-test.js` com o mesmo id, que usa `Sim.testJump` e `Sim.fastForward`. Critério de aceitação: cada registo tem um teste que passa do estado de partida ao resultado da tabela da secção 16.

## 6. Sistemas por ordem de construção (estado em 2026-11-26)

| # | Sistema | Secção | Estado |
|---|---|---|---|
| 1 | `docs/HISTORIA.md` | — | PR #25 |
| 2 | Opções de tempo 1,6 / 0,4 (`sys.clock`) | 6, 16 | PR #26 |
| 3 | Calendário, horas e pré-requisitos (`sys.calendar`) | 9, 10, 16 | PR #27 |
| 4 | Recursos aleatórios ~1 em 8 (`sys.zombie-carry`) | 5, 16 | PR #28 |
| 5 | Dicas de campanha (`sys.hints`) | 4, 14, 16 | PR #29 |
| 6 | Atalhos de teste (`sys.test-shortcuts`) | 16 | PR #30 |
| 7 | Resumo curto no fim do dia (`sys.day-end`) | 6 | PR #31 |
| 8 | Modo campanha: ligar calendário, dicas e estado ao save | 4, 16 | a fazer |
| 9 | `coldvale.houses` | 10 | a fazer |
| 10 | `cinema.statue`, depois `cinema.buff` | 10 | a fazer |
| 11 | Pine Ridge, Eva, Ironworks, FatHill, Westfields, Cinder Grotto, viragem | 10 | a fazer, um PR por id |
| 12 | Bosses: `fathill.bosses`, `amigo1.lockdown-chat`, `fortress.last-boss` | 7 | a fazer |
| 13 | `opt.*` e `fortress.endgame` | 9, 11 | a fazer |
| 14 | Demo itch.io | 12 | a fazer |

**Tarefa 8 (a próxima depois dos merges):** um modo `campaign` em `Data.modes`, baseado no `longhaul`, com `clock:1.6`. O estado `{clues, completed, hints}` entra no snapshot/restore com valores por omissão (saves antigos ficam com uma campanha vazia). As áreas fechadas mostram `Campaign.closedReason` ao tentar viajar. Teste: uma campanha nova grava e carrega; um save antigo carrega sem campanha; viajar para Ironworks no dia 9 é recusado com a mensagem de fim de semana.

## 7. Monetização
Nada na campanha. Para a demo e o Play Store: uma única interface `Ads.showRewarded(placement, onReward)` como stub, ligada só no lançamento (`launching-on-zero-budget`; Play Store: 12 testers durante 14 dias antes da produção).

## 8. Eventos de analytics (stub, sem SDK)
`session_start`, `session_end`, `day_start {day}`, `day_end {day, kills, loot}`, `challenge_start {id}`, `challenge_complete {id, day, minutes}`, `challenge_fail {id, reason}`, `hint_shown {id, level}`, `clue_found {n}`, `death {day, area}`. Atrás de uma função `Metrics.track(event, data)` que, por agora, não faz nada.

## 9. Restrições técnicas
JavaScript sem dependências e sem bundler; `sim.js` nunca toca no DOM; sem chamadas novas a `rng()` na geração do mundo; desenho por frame barato (`AGENTS.md`, regras 1–6). Alvos: browser desktop e Android (WebView/PWA). Demo: `dist/single.html` em zip.

## 10. Marcos e critérios de aceitação
- **M0, sistemas base:** PRs #25–#31 com merge; `npm test`, `npm run index:check` e `npm run test:compat` passam.
- **M1, modo campanha:** tarefa 8 feita; uma campanha nova chega ao dia 30 com `Sim.testJump` e grava e carrega em cada dia.
- **M2, demo:** `coldvale.houses`, `cinema.statue` e `cinema.buff` passam; partindo de uma campanha nova, com `fastForward` chega-se ao cinema e sai-se dele em menos de 15 minutos de jogo real ao ritmo 1,6.
- **M3, cadeia completa:** os 14 ids da secção 16 têm teste e passam.
- **M4, lançamento da demo:** `npm run build` gera o zip; o ecrã final da demo mostra o agradecimento e o botão de feedback.

## 11. Verificação
Cada PR: `npm test` (só falhas), `npm run index:check`, `npm run test:compat` com a release anterior em `../old-version`. Para os desafios, o teste do id na tabela da secção 16. Para o desenho, `tests/render-test.js`.

## 12. Questões em aberto (com o valor a usar se ninguém responder)
1. **Espera de tokens do Amigo 1:** as secções 6, 7 e 10 dizem 5 minutos **reais**; a secção 16 diz "5 min de tempo do jogo, nunca real". Por omissão: 5 minutos reais no jogo e um relógio injetável nos testes.
2. **Ritmo padrão:** 1,6 só no modo campanha; os outros modos continuam com 2.
3. **Dia da semana:** o dia 1 é sexta-feira (os dias 6 e 11 são úteis; 9 e 10 são fim de semana).
4. **Maré baixa:** nos dias pares.
5. **Horário da Ironworks e do mercado:** 08:00–18:00.
6. **Quem conta como zombie aleatório:** a população da rua, as hordas itinerantes e os ninhos; as patrulhas de rota (`route`) não contam.
7. **Duração do `cinema.buff`:** 3 noites.
