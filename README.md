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
