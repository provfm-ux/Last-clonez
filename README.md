# Last CloneZ

Jogo de sobrevivência zombie isométrico para o browser (JavaScript puro, sem dependências).
O jogo está em `game/`. Guia do jogador: `docs/GAME_GUIDE.md`.

## Pôr no GitHub (uma vez)
1. Cria um repositório novo em github.com (privado ou público), sem README.
2. No computador (com Git instalado), dentro desta pasta:
   ```
   git init
   git add .
   git commit -m "Last CloneZ v0.30 + handover para agentes"
   git branch -M main
   git remote add origin https://github.com/<o-teu-utilizador>/<o-teu-repositorio>.git
   git push -u origin main
   ```
   Alternativa sem Git: no repositório, Add file -> Upload files, arrasta todo o conteúdo desta pasta (mantém as pastas `.github`, `docs`, `game`, `scripts`, `tests`).
3. Em Settings -> Actions, confirma que as Actions estão ativas. O CI corre `npm test` em cada PR.

## Copilot e outros agentes
- O Copilot lê `.github/copilot-instructions.md`, `AGENTS.md` e `.github/instructions/*.instructions.md`.
- Cria issues com o modelo **Agent task** (ver `docs/TASKS.md`) e atribui-os ao Copilot coding agent.
  (Os nomes dos menus podem mudar; consulta a documentação do GitHub Copilot se algo não aparecer.)
- Como gastar pouco: `docs/WORKFLOW.md`.

## Publicar (Cloudflare Pages, Netlify ou GitHub Pages)
- Cloudflare Pages: Workers & Pages -> Create -> Pages -> Connect to Git -> escolhe o repositório.
  Build command `npm run build`, output directory `dist`, variável `NODE_VERSION=20`. Cada PR ganha uma pré-visualização.
- Netlify: o mesmo (build `npm run build`, publish `dist`). Alternativa sem build: publicar a pasta `game/` tal como está.

## Comandos
`npm test` | `npm run test:full` | `npm run index` | `npm run build` | `npm run test:compat` (precisa de `../old-version`)

Last CloneZ — Cloudflare deployment.

## Testar alterações de um PR no Android

Os Workers Builds podem criar um URL de pré-visualização por ramo a partir de
`game/`. Consulta a [configuração das pré-visualizações](docs/WORKERS_PREVIEWS.md).

## Personagem e Sandbox

Abre **Advanced** para escolher profissão, nome, aparência, equipamento inicial,
ponto de partida e seed. Em **Appearance and traits**, as desvantagens dão pontos
e as vantagens gastam-nos. O botão de início fica disponível com saldo igual ou
superior a zero. **Recommended start** oferece a configuração de introdução.

Escolhe um preset e abre **Customize** para ajustar a população, velocidade,
sentidos e memória dos infetados, risco de mordida, validade dos alimentos,
clima e cortes de água e eletricidade. As regras ficam gravadas com a partida.

Usa WASD ou as setas para andar, Shift para correr, C para te esgueirares e H
para abrir a saúde. Em ecrãs táteis, usa o joystick e os botões de corrida,
furtividade e saúde. O [guia do jogador](docs/GAME_GUIDE.md) lista os controlos
completos. Consulta os [sistemas](docs/SYSTEMS.md) e o [balanço da simulação](docs/BALANCE.md).
