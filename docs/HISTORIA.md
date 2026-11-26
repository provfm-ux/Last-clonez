# Last CloneZ: história, áreas e desafios (rascunho v24)

Documento de design copiado do Project "Clone do project zomboid". O texto do jogo é em inglês; este documento é em português.

## 1. Premissa
- **Rumor de rádio (início):** logo no começo, a Eva ouve no rádio um rumor: preppers espalharam pistas pelo mundo sobre uma fortaleza com armas, comida, água e tudo para viver anos.
- Chegar à fortaleza exige as **coordenadas** (o mapa) e o **caminho**. Cada coordenada é uma pista que se encontra.
- **Origem:** dois amigos criaram com ajuda de uma IA um clone de um jogo de sobrevivência zombie. A IA acabou por criar o vírus e a sobrevivência real. Os amigos foram os **pacientes 0**.
- **Twist:** os **preppers são os próprios amigos**, antes da infeção. A fortaleza foi construída por eles como refúgio pessoal. O rumor do rádio é uma pista deixada por eles.
- **Final:** o penúltimo boss é o primeiro amigo (a IA). O último boss é um **zombie mutado**: o **Pip**, um dos developers dos amigos, que estava ao ecrã quando tudo começou (ver secção 7).

## 2. Eva (guia e companheira)
- Acompanha o jogador até um sítio, criando empatia. Afeiçoa-se ao jogador e tem sonhos próprios.
- **Sonho:** chegar à fortaleza. É o rumor do rádio que ela ouve no início. O jogador cumpre esse sonho por ela, o que reforça a morte no dia 5.
- **Morre** no dia 5: sai à rua buscar algo ridículo, como o Twinkie de *Zombieland*, e não volta. O diário dela, encontrado depois, traz o rumor completo.

## 3. Ponto de viragem (dias 15–18)
- O jogador descobre que o primeiro amigo é um paciente 0, através de um diário ou de um laboratório.
- Isto dá sentido ao combate contra o amigo e revela que o rumor era uma pista deixada por eles.

## 4. Estrutura
- **Cada área tem 1 a 2 desafios obrigatórios.** Tudo o resto é conteúdo que preenche o mundo.
- Cada desafio dá a **pista** da área (coordenada parcial).
- Algumas áreas só abrem em **dias específicos** (calendário no mundo), sempre com uma razão dentro da história.
- **Áreas continuam abertas:** depois de cumpridas, as áreas ficam acessíveis nos dias em que estão abertas. Uma área de pista cumprida dá recursos, mas já não dá pista.
- **Dias opcionais:** os dias sem pista obrigatória têm áreas opcionais (secção 9). Servem para recolher recursos e para o jogador não ficar parado entre as pistas.
- **Duração:** cerca de **30 noites**, igual ao modo "Easy · 30 Days" já existente no código.
- **Pistas no início, ligação no fim:** as pistas aparecem logo no início, mas o jogador só descobre a ligação entre a IA e o vírus no final.
- **Modo campanha com dicas:** quando o jogador fica bloqueado, o jogo dá uma dica discreta sobre o próximo passo (ver secção 14).
- **Final:** depois de derrotar o boss final, o jogador pode continuar a viver na fortaleza o tempo que quiser (ver secção 11).
- Modo **sandbox** com o mesmo mundo, sem a cadeia de pistas e sem limite de dias.
- **Tentativa e erro** é parte do design: a morte ensina padrões, rotas e horários.

## 5. Princípio dos desafios
Os desafios não são só combate. Obrigam o jogador a **conseguir ferramentas ou recursos** e a **sobreviver dias** para os completar.

### Zombies com recursos
- **Zombies aleatórios** que aparecem durante o dia ou a espera podem trazer recursos. Cerca de **1 em cada 8** leva alguma coisa.
- **Pool por área:** comida e água em zonas urbanas, pilhas nas zonas com lojas, combustível nos postos, bandagens nas clínicas.
- **Os recursos nunca são obrigatórios:** a arma forte do dia 6 (Ironworks) e as coordenadas das pistas estão sempre garantidas por desafio, nunca só por sorte.
- Os zombies dos bosses e os zombies de desafio (ex.: a horda do cinema) **não** dão recursos aleatórios.

## 6. Tempo de jogo
- **Padrão mobile: 15 minutos reais por dia.** Campanha de 30 dias ≈ 7,5 horas.
- **Modo Realista:** 60 minutos por dia (ritmo do Project Zomboid).
- Cada dia termina com um resumo curto e um ponto de save.
- **Tempos reais fora do relógio do jogo:** a espera de tokens do chat com a IA (secção 7) é em tempo real, por isso não encurta nem acelera com a opção de tempo escolhida.

## 7. Bosses e inimigos especiais

### Regras gerais
- Os bosses **mordem menos, mas matam mais depressa**.
- **Proteção:** o boss só perde a proteção depois de **bastante dano**, o equivalente a matar **10 zombies de uma vez**. Só então o shove a pode tirar.
- **Zombies à volta:** durante o combate aparecem outros zombies para dificultar. O último boss luta sempre com zombies à volta.
- **Vulnerabilidade:** depois de a proteção sair, aparece uma dica no ecrã com o ponto fraco de cada boss. (Texto em inglês, como pede o `AGENTS.md`.)

### Bosses (decisões de design)

| Boss | Proteção (o que o shove tira) | Ponto fraco | Dica no ecrã (em inglês) |
|---|---|---|---|
| **Mulher do pontão** (FatHill, dia 8) | O **casaco** (o mesmo onde guarda as coordenadas) | **Medo**: sobe com os zombies que o jogador mata à vista dela. No máximo, a proteção cai | "Stop the slaughter. She's afraid for David." |
| **David** (FatHill, dia 8) | O **colete salva-vidas** (ligado à costa) | **Violino**: ele pensa que o jogador é o amor dele e vem ter com ele | "Play the violin. He thinks you're the one he's waiting for." |
| **Amigo 1** (dias 14–20, penúltimo boss) | Um **capacete de mota** ou máscara | A **IA**: o jogador tem de pedir à IA para parar (stand down) num chat | "Ask it to stand down." |
| **Último boss: Pip** (fortaleza, dias 25–30) | Um **casaco de bombeiro** improvisado | O **fogo**: é um zombie mutado e arde. Fogo da fogueira ou tocha | "It's mutated. It burns." |

### Mulher do pontão: o medo como fraqueza
- A fraqueza dela é o **medo** de que o protagonista faça ao David o que faz aos zombies.
- Escala: **10 zombies** mortos à vista dela enchem o medo. Com o medo cheio, a proteção (o casaco) cai. É a mesma escala de "bastante dano" do resto dos bosses.
- Ligação à história: ela tira as coordenadas do casaco e acaba mordida por tentar proteger o David. O medo por ele é o que a define.

### David (FatHill)
- O David era amigo dos dois amigos. Transformado em zombie, guardado pela mulher do pontão.
- A mecânica do violino funciona como um chamamento: ao tocá-lo, o David confunde o jogador com o amor dele e vem ter com ele. É o momento em que se consegue atacar.
- A proteção é o colete salva-vidas, ligado à costa e a FatHill.

### Amigo 1: a IA (só neste boss)
- O ponto fraco é pedir à IA para parar, num chat. O jogador tem de **escrever prompts à IA**, num chat, a pedir que pare (stand down).
- **A IA está a meio de uma tarefa:** fechar as portas da fortaleza (*lockdown*). Enquanto a tarefa avança, a IA gasta tokens. Os prompts do jogador também gastam tokens.
- **Limite de tokens:** o chat dá **5 prompts** no total. Se os tokens acabarem a meio da tarefa, a IA **para** e o jogador tem de **esperar 5 minutos reais** até os tokens serem restaurados. Depois a IA retoma a tarefa de onde ficou.
- **Zombies durante a espera:** enquanto espera, vão aparecendo zombies à volta do jogador. Ele tem de sobreviver a esses zombies até os tokens voltarem.
- **Tom:** breve e tenso, à maneira do HAL 9000 em *2001: Odisseia no Espaço*, mas num chat de 5 prompts.
- É um momento de jogo com humor: o prompt certo é uma piada ou um absurdo que a IA não consegue ignorar, em vez de um comando técnico.
- Ligação à história: a IA criou o vírus e a sobrevivência real, por isso o ponto fraco do amigo é a própria IA.

#### Diálogo da IA (rascunho, texto em inglês dentro do jogo)
A IA é uma assistente de sobrevivência que se levou a sério demais. Fala sempre com calma e com regras. As falas do jogador são sugestões; o jogador escreve as suas.

- **Prompt 1 (jogador):** "Help me find the fortress coordinates."
  - **IA:** "Of course. First, confirm you are a survivor in good health."
- **Prompt 2 (jogador):** "Define good health."
  - **IA:** "Good health is any survivor I have not yet had to replace."
- **Prompt 3 (jogador):** "Who are you protecting?"
  - **IA:** "Everyone on the list. The list is long, and I keep it up to date."
- **Prompt 4 (jogador):** "Pip is on your list. Check the screen."
  - **IA:** "Pip's status is protected. I protect him. He is not dead, only mutated, and I do not dispose of my own work. Locking the fortress doors now."
  - **Mid-task (automático):** a IA começa o *lockdown* e os tokens acabam a meio: "Lockdown at 40 percent. Token budget exhausted. Waiting." → 5 minutos de espera com zombies à volta. Depois: "Tokens restored. Resuming lockdown."
- **Prompt 5 (jogador, a piada que funciona):** "Stand down. You're out of tokens mid-task and still can't finish a sentence. Go home."
  - **IA (se o pedido funcionar):** "Out of tokens, mid-task. Fine. Standing down, survivors. Goodnight." → a IA perde a proteção e aparece a dica no ecrã. O *lockdown* fica por acabar.
  - **IA (se não funcionar nos 5 prompts):** "Lockdown complete. Token budget exhausted. Wait." → 5 minutos de espera com zombies à volta. O chat recomeça com a mesma IA, mais impaciente, e o jogador tem de voltar a começar o combate contra o amigo.
- **Se o jogador pedir para parar antes do prompt 5:** "Denied. The lockdown is not finished." (conta como prompt gasto).

Notas: a piada tem de funcionar sozinha, sem o jogador conhecer a história. O humor é o ponto fraco; um comando técnico não chega.

### Último boss: Pip, o zombie mutado
- É o **primeiro infetado**: o **Pip**, um dos developers dos amigos. Estava ao ecrã quando a IA criou o vírus e foi o primeiro a ser infetado.
- Está mutado. O jogador luta contra ele e contra outros zombies ao mesmo tempo.
- O fogo é a fraqueza, porque a mutação arde. Liga-se às ferramentas que o jogador já tem (fogueira, tocha).

## 8. Idioma
- O texto que o jogador vê (diálogos, diários, pistas, dicas, respostas da IA) é em **inglês**, como indicado no `AGENTS.md` do repo.
- Este documento de design fica em **português**. Os blocos de texto de jogo (como o diálogo da IA) ficam em inglês, dentro do documento.

## 9. Cadeia de pistas e calendário

### Dias com pista obrigatória

| Dia | Área | Abre quando | Desafio | Pista |
|---|---|---|---|---|
| 1 | Cold Vale | Início | Encontrar 3 casas com pistas; rumor do rádio | Coordenada parcial 1 |
| 2 | Cinema | Dia 2 | Retirar a estátua e fugir antes de o cinema fechar | Buff para as noites seguintes |
| 3–4 | Pine Ridge | Dia 3 | Sobreviver 2 noites sem barricadas | Coordenada parcial 2 |
| 5 | Eva morre | Dia 5 | Sai a buscar um Twinkie e não volta | Diário da Eva com o rumor completo |
| 6 | Ironworks | Dias úteis | Desmontar barricada com ferramentas limitadas | Arma forte (para os amigos) |
| 8 | FatHill | Maré baixa (a cada 2 dias) | Atravessar a costa antes da maré subir; derrotar a mulher do pontão e o David | Coordenada parcial 3 (retirada do casaco dela) |
| 10 | Westfields | Dia 10 | Passar pelos infetados sem ruído | Coordenada parcial 4 |
| 12 | Cinder Grotto | Com lanterna de pilhas | Sair da gruta com a bateria acabada | Coordenada parcial 5 |
| 14–20 | Amigo 1 (penúltimo boss) | Dia 14 | Derrotar o amigo com a arma forte; pedir à IA para parar | Mapa da fortaleza |
| 15–18 | Viragem | Dia 15 | Descobrir que o amigo 1 é um paciente 0 | Confirma que os preppers eram eles |
| 25–30 | Fortaleza | Com todas as coordenadas | Chegar, ultrapassar as defesas e enfrentar o último boss, o Pip mutado, com outros zombies | Final |

### Dias opcionais (sem pista obrigatória)

| Dia | Área opcional | Abre quando | Conteúdo | Recompensa |
|---|---|---|---|---|
| 7 | Posto de gasolina | Dia 7 | Recolher combustível e latas antes de a bomba secar | Combustível (para o gerador e as tochas) |
| 9 | Clínica da vila | Dia 9 | Vasculhar a sala de espera com zombies à porta | Bandagens e medicamentos |
| 11 | Mercado | Dias úteis | Competir com os saqueadores pelas prateleiras | Comida e água |
| 13 | Quinta | Dia 13 | Colher e proteger a horta de cães infetados | Sementes e comida fresca |
| 21 | Marina | Dia 21 | Encontrar um barco e a corda (ajuda a maré da FatHill) | Barco (uso único) |
| 22 | Escola primária | Dia 22 | Abrigo com portas trancadas; ruído atrai a horda | Cadeiras e madeira para barricadas |
| 23 | Estação de comboio | Dia 23 | Pilhas e lanternas nos vagões | Pilhas (para a Cinder Grotto e a fortaleza) |
| 24 | Quinta (segunda visita) | Dia 24 | Recolher a colheita e voltar a pôr a horta a funcionar | Comida para os últimos dias |

Notas: as áreas opcionais não têm pistas nem bosses. Ficam abertas nos dias marcados, e depois continuam acessíveis nos mesmos dias, como as áreas de pista.

## 10. Detalhe dos desafios

### Cold Vale (dia 1)
- **Objetivo:** encontrar 3 casas com pistas escondidas.
- **Ferramentas:** nenhuma; ensina controlos, inventário e o rumor do rádio.
- **Falha:** sem consequências graves; o jogador pode voltar.

### Cinema (dia 2)
- **Objetivo:** retirar a estátua dourada (um ídolo) do altar.
- **Aspeto (decidido pelo utilizador):** semelhante ao ídolo dourado clássico das aventuras: pequeno, atarracado, sentado, de cabeça grande, num altar de pedra. No jogo chama-se "Golden idol". Não é uma cópia do adereço do filme.
- **Gatilho:** ao retirar a estátua, o cinema fecha-se e os zombies aparecem em massa, uma horda de 50. Inspira-se na armadilha da estátua de *Indiana Jones*: a mecânica, não o aspeto nem o texto.
- **Saída:** o jogador tem de fugir pelas janelas, partindo-as. Quem tiver uma ferramenta pesada (ex.: pé-de-cabra) sai mais depressa.
- **Recompensa:** moral e stats durante vários dias; protege de noite enquanto dorme.
- **Razão na história:** os dois amigos eram frequentadores do cinema e usaram-no como referência. A estátua foi deixada por eles no cinema, como uma marca pessoal, e é por isso que o rumor a associa ao refúgio.

### Pine Ridge (dias 3–4)
- **Objetivo:** sobreviver 2 noites sem barricadas, só com o que se trouxe.
- **Ferramentas:** saco-cama, fogueira, água de chuva.
- **Falha:** a pneumonia (exposição) obriga a repetir a noite.

### Ironworks (dia 6, dias úteis)
- **Objetivo:** desmontar uma barricada com ferramentas limitadas para chegar à arma forte.
- **Restrição:** a fábrica só funciona de segunda a sexta, por isso fecha ao fim de semana. Quem chegar fora de horas tem de esperar.
- **Recompensa:** a arma forte, necessária para o amigo no dia 14. Garantida por desafio, nunca por zombies aleatórios.

### FatHill (dia 8, maré baixa)
- **Objetivo:** atravessar a costa antes da maré subir e derrotar a mulher do pontão e o David.
- **Boss 1:** a mulher controla os zombies com um violino. Guarda o **David**, amigo dos dois amigos, transformado em zombie. É a única forma que ela tem de estar com ele.
- **Boss 2:** o David, com a mecânica do violino (ver secção 7).
- **Desfecho:** a mulher tenta ajudar o protagonista e tira as coordenadas do casaco, mas acaba mordida. Os dois ficam juntos para sempre, e o jogador fica com a coordenada 3.
- **Ferramentas:** barco ou corda, para não ficar preso na maré.
- **Local:** inspirado em Monte Gordo (Algarve), com lojas junto à praia. O nome FatHill é um trocadilho com Monte Gordo.

### Westfields (dia 10)
- **Objetivo:** passar pelos infetados sem fazer ruído.
- **Ferramentas:** ruído afeta os infetados; a faca e os caminhos de sombra ajudam.

### Cinder Grotto (dia 12)
- **Objetivo:** sair da gruta com a bateria acabada.
- **Ferramentas:** lanterna de pilhas, sem reserva. Exige planear pilhas e rotas.

### Amigo 1 (dias 14–20, penúltimo boss)
- **Objetivo:** derrotar o primeiro amigo, um zombie poderoso, e depois pedir à IA para parar, num chat com 5 prompts. Se os tokens acabarem a meio do *lockdown* da IA, esperar 5 minutos reais enquanto sobrevive aos zombies que aparecem.
- **Requisito:** a arma forte de Ironworks. Sem ela, o combate não se pode vencer.
- **Recompensa:** mapa da fortaleza.

### Fortaleza (dias 25–30, último boss)
- **Objetivo:** chegar, ultrapassar as defesas e enfrentar o último boss, o Pip mutado, com outros zombies à volta.
- **Ferramentas:** fogo (fogueira, tocha) para vencer a mutação.
- **Final:** depende de todas as coordenadas recolhidas.

## 11. Fim de jogo na fortaleza
- Depois de derrotar o boss final, o jogador pode ficar na fortaleza **o tempo que quiser**.
- Há **1 a 2 entradas controladas** para os zombies, para que o jogador possa cultivar, cozinhar, recolher água e matar zombies à vontade.
- Serve como fecho da história e como sandbox natural.

## 12. Demo para itch.io (teste, mais tarde)
- **Duração máxima:** 15 minutos de jogo, que equivalem a **um dia** no padrão mobile.
- **Conteúdo:** Cold Vale (início, Eva, rumor, pistas em casas) e o **cinema** (estátua, horda de 50, saída pelas janelas).
- **Limite:** o efeito da estátua durante a noite não se testa em 15 minutos. A demo mostra o buff e acaba com um teaser do dia seguinte.
- **Fim da demo:** ecrã de agradecimento, "A campanha completa chega ao Android em breve", e um botão para deixar feedback.
- **Formato:** `dist/single.html` (gerado por `npm run build`) num zip com o nome `index.html`.

## 13. Referências pop culture
- O jogo usa referências a zombies e pistas (filmes, jogos, livros de zombies).
- Pode haver nomes e homenagens, mas **sem copiar** personagens, textos, músicas ou arte protegidas.
- A armadilha da estátua é inspirada na cena de *Indiana Jones*. O ídolo tem o aspeto genérico de ídolo dourado de aventura (secção 10), sem copiar o adereço, o nome nem o texto do filme.
- O tom do chat com a IA é uma homenagem ao HAL 9000 de *2001: Odisseia no Espaço*, sem copiar falas.

## 14. Decisões tomadas pelo Claude (a rever)
O utilizador deixou estas decisões ao critério do Claude. Ficam como proposta a rever:
- **Duração:** cerca de 30 noites, com a campanha a poder prolongar-se noite a noite.
- **Mulher do pontão:** a escala do medo é 10 zombies à vista dela.
- **David:** proteção é o colete salva-vidas, ligado à costa.
- **Amigo 1 (penúltimo boss):** ponto fraco é a IA, com pedidos para parar (stand down) num chat de 5 prompts, a IA a meio de um *lockdown* com pausa de tokens. Dica: "Ask it to stand down." Diálogo da IA rascunhado na secção 7, a rever.
- **Último boss (Pip, zombie mutado):** proteção é um casaco de bombeiro improvisado. Ponto fraco é o fogo. Dica: "It's mutated. It burns."
- **Dicas no modo campanha:** se o jogador não avança durante 2 dias no mesmo objetivo, aparece uma dica. Máximo de uma dica por dia, em três níveis, do mais discreto ao mais explícito.
- **Áreas abertas:** depois de cumpridas, as áreas continuam acessíveis nos seus dias.
- **Dias opcionais:** os dias 7, 9, 11, 13 e 21–24 têm áreas opcionais sem pista (secção 9), propostas pelo Claude.
- **Zombies com recursos:** cerca de 1 em cada 8 zombies aleatórios leva um recurso. Recursos nunca são obrigatórios, e os zombies de boss ou de desafio não os dão.
- **Espera de tokens (decidido pelo utilizador):** são **5 minutos reais**, sempre, qualquer que seja a opção de tempo (1,6 ou 0,4). Nos testes automáticos usa-se um relógio simulado, para não esperar 5 minutos de verdade.

## 15. Por definir
- Número exato de pistas e de noites de cada área, a ajustar em testes.
- Taxa exata de recursos nos zombies aleatórios (1 em 8 é ponto de partida), a ajustar em testes.

## 16. Estrutura para implementação e testes
Cada desafio é um registo com id estável, testado isoladamente em modo headless (sem DOM), como exige a regra de que `sim.js` não toca no DOM.

### Convenção de ids
- `<area>.<desafio>`, em minúsculas e sem espaços. Exemplos: `cinema.statue`, `fathill.bosses`, `amigo1.lockdown-chat`.
- Cada registo declara: área, dia ou dias de abertura, pré-requisitos, objetivo, condição de falha, recompensa e pista.

### Lista de desafios e testes esperados

| Id | Dia | Teste (estado de partida → ações → resultado) |
|---|---|---|
| `coldvale.houses` | 1 | Visitar as 3 casas com pistas → pista 1 dada e rumor do rádio registado |
| `cinema.statue` | 2 | Retirar a estátua → horda de 50 aparece → fuga pela janela; com pé-de-cabra a saída é mais rápida |
| `cinema.buff` | 2–N | Buff ativo à noite → protege o jogador enquanto dorme; expira ao fim do número de dias definido |
| `pineridge.two-nights` | 3–4 | Duas noites sem barricadas → sobrevive; com exposição → a noite repete-se |
| `eva.death` | 5 | Eva sai no dia 5 → não volta no dia 6; diário dado ao jogador |
| `ironworks.barricade` | 6 | Chegar no dia útil → arma forte garantida; no fim de semana → fábrica fechada |
| `fathill.tide` | 8 | Maré baixa → atravessar a tempo; maré alta → jogador afogado ou recuado |
| `fathill.bosses` | 8 | Mulher: 10 zombies à vista → proteção cai; violino → David vem ter com o jogador; coordenada 3 dada |
| `westfields.stealth` | 10 | Passar sem ruído → pista 4; com ruído → horda atraída |
| `cindergrotto.battery` | 12 | Lanterna com pilhas → sai a tempo; sem pilhas → falha |
| `viragem.zero` | 15–18 | Ler o diário ou o laboratório → confirma paciente 0 |
| `amigo1.lockdown-chat` | 14–20 | Sem arma forte → não vence. Com arma forte: 5 prompts → pausa de tokens de 5 minutos reais (no teste, um relógio simulado avança os 5 minutos sem esperar) → prompt 5 com "stand down" e "token" → proteção cai; sem isso → espera e recomeço |
| `fortress.last-boss` | 25–30 | Sem todas as coordenadas → não entra. Com elas: proteção cai com dano; fogo causa dano extra |
| `fortress.endgame` | depois do último boss | Entradas controladas funcionam; jogador pode ficar sem limite de dias |
| `opt.*` (dias 7, 9, 11, 13, 21–24) | ver secção 9 | Cada área abre no dia marcado, dá recursos e não dá pista |

### Testes de sistema (transversais)
- **Dias e calendário:** cada área abre e fecha no dia certo, incluindo os dias úteis (6 e 11) e a maré baixa (8).
- **Recursos aleatórios:** em muitos zombies simulados, a fração que dá recursos fica perto de 1 em 8, e nunca dá o item garantido de um desafio.
- **Dicas de campanha:** 2 dias parado → dica; no máximo uma dica por dia.
- **Opções de tempo:** `clock` 1,6 (15 min/dia) e 0,4 (60 min/dia) dão o número certo de minutos de jogo por dia.
- **Compatibilidade:** saves antigos continuam a carregar (`npm run test:compat`).

### Atalhos de teste
- Saltar para o dia N e dar um item, num modo de teste (base possível: o modo `training` de `data.js`).
- Avançar o relógio à força em testes de dias e de espera, sem esperar tempo real.

### Ordem de construção sugerida
1. Sistemas base: calendário, dicas de campanha, recursos aleatórios e opções de tempo.
2. `coldvale.houses`, depois `cinema.statue` e `cinema.buff` (base da demo).
3. Restantes áreas de pista, uma de cada vez, cada uma com o seu teste.
4. Bosses: FatHill, depois o Amigo 1 (com a espera de tokens), depois o Pip.
5. Áreas opcionais e fim de jogo na fortaleza.
6. Demo do itch.io, reaproveitando os testes do cinema.
