# Como trabalhar com agentes sem gastar tokens

1. **Cria um issue por tarefa pequena** com o modelo "Agent task" (Objetivo, Área, Ficheiros, Pronto quando). Uma tarefa = um PR.
2. **Atribui o issue ao Copilot** (Copilot coding agent). Ele abre um PR e corre o CI.
3. **Revê só o PR**: o CI tem de estar verde (`npm test`, índice do código, build). Faz merge ou pede ajuste num comentário curto.
4. **Preview e publicação**: o Cloudflare/Netlify gera uma pré-visualização por PR; ao fazer merge em `main` publica.

## Regras para gastar pouco
- Tarefas pequenas e concretas (ver `docs/TASKS.md`). Nada de "explora o repositório e melhora".
- Os agentes leem `AGENTS.md`, `docs/CODE_INDEX.md` e só a secção do `docs/CONTENT_GUIDE.md` da tarefa.
- Pede ao agente para correr só `npm test` (a saída é curta).
- Conteúdo de história/mundo/gráficos vai para ficheiros de dados e funções pequenas, sem mexer em `sim.js` inteiro.
- Se um agente começar a ler ficheiros enormes, interrompe e aponta a secção do guia.

## Modelo de pedido (copiar para o issue ou chat)
> Tarefa: <uma frase>. Área: <story|world|graphics...>. Lê `AGENTS.md` e a secção relevante de `docs/CONTENT_GUIDE.md`.
> Toca no mínimo de ficheiros. Acrescenta um teste. Corre `npm test`. Não mudes nada fora da tarefa.

## Para eu (Claude) ou outro agente rever
Passa só: o diff do PR + a saída de `npm test`. Não é preciso enviar o zip inteiro.
