# Last CloneZ — registo de alterações (cumulativo)

## Em desenvolvimento
- Added 13 occupations with Cold Vale backstories, starting skills and equipment (from #17).
- Added 30 point-budgeted traits chosen at setup; drawbacks pay for advantages.
- Added Sandbox controls for infected speed, sight, hearing and sound memory, food lifetime and bite chance.
- Expanded the firewatch, substation and Night Reel clues.
- Added Tracking. Moving infected leave fading outdoor tracks that reveal direction, age and type as the skill improves.
- Spread existing infected across quiet landmarks and stocked long travel routes with small caches and patrols on new maps.
- Renamed the Field Ledger to Logbook and added saved daily summaries of combat and survival activities.
- Added nine campfire recipes and six pantry ingredients stocked across five regions.
- Increased blackberry and apple yields and moved cookable batches to the top of the campfire list.
- Added flint knapping at workbenches, with skill-based blade condition.
- Added outdoor stone walls, skill-based strength, and material stores in the quarry and Highmoor.
- Added seed-based field notes, linked survivor accounts, and optional scavenging rewards.
- Added mushroom identification, safe cooking, and readable patch warnings that can draw nearby infected.
- Added skill categories, weapon-family practice, movement skills, equipment care, electrical work, and carving.
- Added finite, recovering fishing spots and kept older saves compatible.
- Added clothing damage, DIY-scaled repairs, and ten one-time skill books.
- Added explicit weapon unequip and kept hands empty when dropping or storing a weapon.
- Added a character Equipment view and direct repairs for damaged and broken weapons.
- Added weapon matchups, brute resistance and clearer equipment descriptions.
- Added a Recommended start with optional in-run hints and first-night protection from wandering hordes.
- Moved presets, seed and other setup choices under Advanced and pinned the current story objective in the HUD.
- Added opt-in local playtest milestones to the run report.
- Added preset ratings, regional danger labels, and independent assists with saved mid-run pressure changes.
- Added adaptive hordes to new Survival and Relaxed runs, first-night damage relief in Recommended, and a seeded balance CSV tool.
- Added warm flashlight falloff, powered window glow, firelight, rain sheen and coastal mist.
- Added Full, Reduced and Off atmosphere effects and a saved Reduce flicker option.

## 0.34 — Dark Pixel
- Redrew survivor sprites and seven animated infected variants with eight-direction views.
- Added survivor customization with a live portrait, plus Marksmanship and Mechanics progression.
- Detailed interiors, streets and props, with moving foliage, rain ripples and campfire smoke.
- Added alternate horde entrances, moon-dependent visibility and timed waiting with a wristwatch.
- Made inventory search collapsible and added a confirmation before dismantling furniture.

## 0.33 — The Outer Districts
- Expanded Cold Vale and its surrounding regions with five connected districts and 50 explorable sites.
- Added local witness stories, 300 hidden curios, and a five-district follow-up to The Second All-Clear.
- New runs use generation 7. Existing saves retain their original layouts.

## 0.32 — Oxford Night Reel
- Added an optional, replayable beginner introduction using the survival controls.
- Infected deaths can open one of six short afterlife games with reduced visibility and directional sound.
- Added seed-dependent film Easter eggs and a fictional Oxford cinema with six independent clues.
- The El Gordo raffle can leave a rare infected winner, a collectible trophy or a quiet screening room.

## 0.31 — The Second All-Clear
- Extended the evacuation story into a playable finale in Cinder Grotto.
- Added six field challenges and marked discovered story sites on the map.
- Hid three new records in the outlying regions with a linked ending and cache.

## 0.30 — visual "Dark pixel"
Testes: `smoke-test.js` **140** a passar; `render-test.js` tudo OK (inclui o novo visual). **Não visto num browser real** — por isso o menu *Graphics* permite voltar a *Fast*/*Classic*.

- **Pipeline (`view.js`):** com `state.look === "dark"` o mundo é desenhado num buffer `lowCanvas` de `largura/pixCss` (pixCss = round(largura/640), mínimo 1) e ampliado com `imageSmoothingEnabled = false`. Antes da ampliação aplica-se o tom (`saturation` 42 % + `multiply` #aab3c4), nevoeiro baixo e vinheta. Os blocos de chão em cache são construídos à escala do buffer (menos pixels, mais leve). Texto, marcadores e HUD ficam à resolução normal. `ctx` é reposto no início de cada `render` (`mainCtx`).
- **Detalhe e sangue (`microDetail`, `bloodPool`):** dentro do chão em cache (custo zero por frame): tufos de erva, manchas secas, pedras, fissuras e gravilha no asfalto, pontos no chão de interior/areia, manchas de sangue (≈1 em 8 tiles; mais no asfalto e nos interiores), poças (1 em 47) e rastos (1 em 61). Paleta de sangue coagulado com toques de vermelho fresco. Poça por baixo dos cadáveres.
- **Menu Graphics (`game.js`):** `look` = `dark` | `fast` | `classic` (`localStorage["clonez-gfx"]`).
- **Por fazer:** personagens e objetos ainda usam as formas atuais (só ficam pixelizados e escurecidos); sprites micro pixel próprios (o mockup) e manchas de sangue dinâmicas quando se mata ou se é ferido.

## 0.29 — desempenho do renderer (relatório: "o jogo está lento no PC")
Testes: `node smoke-test.js . <antiga>` → **140 verificações a passar**; novo `render-test.js` (renderer com canvas simulado) → tudo OK. **Não foi medido num browser real** (sem GPU nem perfil de frame): os números são de operações de canvas por frame.

- **Diagnóstico:** em 1280×720 cada frame fazia ~7.900 chamadas de canvas (≈1.070 polígonos), das quais o código JS custava só 1,3 ms — o tempo ia para o browser a rasterizar. Culpados: (1) cada tile do chão redesenhado por frame; (2) um segundo polígono por tile só para escurecer com a distância; (3) o minimapa a percorrer ~12.000 tiles várias vezes por segundo.
- **Cache do chão (`view.js`: `groundLayer`, `buildChunk`):** blocos de 8×8 tiles em canvases fora do ecrã, à escala `zoom × dpr`. Reconstrói quando o número de tiles explorados do bloco muda, quando o zoom/DPR muda ou ao mudar de mundo; LRU com limite dinâmico. `tile()` foi dividida em `tileArt` (estático), `tendril` (dinâmico, por frame) e o resto (sombra). Grutas mantêm o caminho antigo.
- **Escurecimento:** `dimAround` — um gradiente radial elíptico (claro até 3,2 tiles, 47 % às 12,6) substitui um polígono por tile. **Muda o visual:** já não existe o +10 % de escurecimento fora da zona do jogador.
- **Minimapa (`minimapLayer`):** camada de tiles em cache por canvas; chave = tamanho, unidade, offsets, tiles explorados e portas abertas.
- **Medido (mock):** polígonos por frame 1.066 → 237; operações 7.900 → 2.007; frame estável não reconstrói blocos; explorar 7×7 tiles refaz 2 blocos; minimapa repetido 2.247 → 1 `fillRect`.
- **Botão *Graphics: Fast/Classic*** (menu de pausa, `localStorage["clonez-gfx"]`, `state.fastGround`): permite voltar ao desenho antigo se o novo tiver artefactos (por exemplo linhas finas nas junções dos blocos).
- **O que ainda custa:** ~230 polígonos por frame de objetos, paredes e telhados (não estão em cache), mais efeitos. Próximos passos: cache de telhados/paredes por edifício; reduzir `dpr` máximo em ecrãs grandes; modo "Low" que desliga sombras.

## 0.28 — três regiões novas (geração 5) e botão Attack à direita
Testes: `node smoke-test.js . <pasta-antiga>` → **140 verificações a passar**. Verificado: gravações da v0.20 e da v0.27 abrem; ida e volta entre as regiões; gravar e restaurar dentro do Greywater Reservoir; renderer sem erros nas três (canvas simulado). CSS/`game.js` **não testados num browser real**.

- **Regiões novas (pedido: mapa maior):** `quarry`, `reservoir`, `lighthouse` em `Regions.definitions` com `deep:true`, `host`, `arrival`, `exitBack`, `hostExit`, `hostArrival`, `tag`. 64×64, geradas pelo mesmo `create()` (helpers `building`, `stash`, `road`, `resource`, `vehicle`) com `regionSurface`, densidade e blocos próprios. Ligadas às anfitriãs como a gruta (saídas em Ironworks [106,60], Westfields [60,106] e Bracken Coast [100,100]); `connection()` e `addExits()` tratam o par anfitriã↔profunda. `Regions.annexes` exclui-as, por isso o resto do jogo (rng das regiões, locais extra, casas) não mudou.
- **Chaves nas regiões novas:** `lockDoor`/`keyItem` — o paiol (pedreira), a casa do guarda (represa) e o farol ficam trancados; as chaves estão no escritório do capataz, na casa das bombas e na casa do guarda.
- **Geração 5:** jogos novos usam `generator = 5`; `restore` aceita 1–5. Só mundos da geração ≥ 5 têm as saídas para as regiões novas, por isso **gravações antigas não mudam**.
- **Pontos de integração que tiveram de ser tratados** (úteis para futuras regiões): `Atmosphere.arrivals`, `nestBuildings`, `outpost` (sem eles a viagem falhava com *"outpost is not iterable"* ou *"reading 'door'"*), `World.areaDensity`, `Homes.place` (`plots[region] ?? []`), rótulos de saída em `view.js` e lista de rotas em `game.js`, e `Regions.expand` (ignora regiões profundas).
- **Botão Attack (pedido):** à direita, canto inferior; 98 px (86 em paisagem baixa), vermelho, borda clara, área de toque alargada (+10 px), pulsa quando está pronto. `.touch-controls` passa a uma fila de 3 botões mais pequenos por cima, a 20 px de distância. A mensagem de aviso (`.toast`) sobe para não ficar por baixo.
- **Por fazer nas regiões:** pistas de história (`chronicle.js`) e eventos próprios nas regiões novas; mais pontos de interesse; neve/nevoeiro.

## 0.27 — mundo com mais locais de exploração (geração 4), aviso de arma
Testes: `node smoke-test.js .` → **119 verificações a passar**. Verificado também: gravações da v0.20 abrem; viajar e gravar em Pine Ridge funciona.

- **Geração 4 (pedido: mapa maior):** novo valor `generator = 4` (jogos novos via `createControl`); `restore` aceita 1–4 e os testes `generator === 3` passam a `>= 3` (em `world.js` e `sim.js`). `Regions.addWilds(world)` acrescenta **7 contentores por região exterior** (`wild-<região>-<n>`), em relva/campo/areia, a ≥ 12 tiles da chegada, sem tiles sólidos ou objetos vizinhos, com um gerador aleatório próprio (`seed ^ constante`) — por isso **não altera** a geração das versões 1–3. Medido: 7/7 alcançáveis a pé em cada região, itens de saque todos válidos, a geração 3 continua sem esses locais.
- **Honestidade sobre o âmbito:** isto aumenta a exploração, mas **não aumenta o tamanho do mapa** (74×74 em Cold Vale, 111×111 nas outras). Aumentar o mapa a sério (novas regiões encadeadas a partir das existentes, como a gruta) exige: entradas em `definitions`, função de superfície, edifícios, ligações em `addExits`/`connection` (hoje hub-and-spoke) e conteúdo em `chronicle.js`. Plano na secção 9 do roadmap.
- **Aviso de arma gasta (comunidade/mods):** notifica quando a condição desce de ≥ 20 para < 20.

## 0.26 — chaves, nomes de casas, portas abertas
Testes: `node smoke-test.js .` → **99 verificações a passar** (a opção `node smoke-test.js <nova> <antiga>` testa também que gravações da versão antiga abrem). `game.js` só validado sintaticamente.

- **Chaves com dono (pedido do utilizador):** `housekey` (`individual:true`, nunca empilha) leva `lock` (id do edifício), `label` (nome da casa) e `uid`. Em `homes.js`, cada segunda porta fechada fica `locked` com `lockId`; a chave é metida no armário (`-cupboard`) ou despensa (`-pantry`) de outra casa, nunca na própria. `canUnlock` aceita a chave com `lock === o.lockId` (a `policekey` continua a abrir só a esquadra). Mensagens com o nome da casa; `itemState` preserva `lock/label/uid` ao mover itens; o inventário mostra "Tag: …".
- **Nomes (pedido do utilizador):** todas as casas ganham nome alusivo a filmes de zombies (`plots` e `cottageNames` em `homes.js`). As pistas de `chronicle.js` que apontavam para casas pelo nome foram atualizadas. Os nomes não afetam gravações.
- **Portas abertas (pedido do utilizador):** `updateDoorLure` (a cada 1,5 s): infetados sem alerta a ≤ 8 tiles de uma porta aberta entram com 10 % de hipótese; se o jogador está dentro dessa casa, os que estão a ≤ 13 tiles vêm com 30 %. Aviso "The open door is drawing infected toward you." Medido: porta aberta → o infetado chega ao jogador; porta fechada → não.
- **Compatibilidade de gravações (correção importante):** a 0.25 tinha introduzido um consumo extra do gerador aleatório (`rng()`) no saque das casas, o que fazia **gravações antigas falharem com "Invalid world data"**. Agora as novidades de geração (roupa, trancas, chaves) não consomem o `rng()` partilhado. Verificado: gravações da v0.20 abrem na 0.26. **Regra para o futuro:** nunca acrescentar chamadas a `rng()` na geração do mundo sem subir `Regions.mapRevision` e tratar a migração.
- **Mapa maior: por fazer.** Cada região usa coordenadas fixas (entradas, estradas, edifícios) e acrescentar regiões novas exige conteúdo novo em `regions.js`. Proposta na secção 9 do roadmap.

## 0.25 — roupa por camadas, cantos, botão Attack
Testes: `node smoke-test.js .` → **86 verificações a passar**. CSS/HTML/`game.js` só validados sintaticamente.

- **Roupa (roadmap I1, E4):** `p.gear` passa a 7 ranhuras (`head, hands, wrist, arms, body, legs, feet`). Itens novos em `data.js`: beanie, gloves, wintercoat, jeans, boots; `armguards` e `raincoat` passam a usar `guard`/`warmth` por dados. `clothingWarmth(s)` soma `warmth` à temperatura alvo ao ar livre (casaco+gorro: +1,15 °C medido no inverno). Em `hurt()`, `guard` por parte (braço: arms+hands+body; perna: legs+feet; máx. 0,7) reduz o dano e dá `guard×0,9` de hipótese de **absorver o golpe** (sem ferida nem infeção). Começa com jeans e botas; a roupa aparece nos armários das casas (35 %). **Correção:** `restore` já não deixa roupa "fantasma" em gravações antigas.
- **Cantos (bug "paredes bloqueiam"):** `move()` ganhou *corner assist*: se o movimento ficar bloqueado frontalmente e houver passagem até 0,4 tiles para o lado, desliza para ela (vale também para infetados e carros). Teste: atravessa uma abertura de 1 tile partindo 0,42 desalinhado.
- **Botão Attack:** fora da grelha; redondo, canto esquerdo, acima do joystick; escondido a pé quando não há ação e no carro.
- Teste do sono tornado robusto (o infetado era colocado dentro de uma parede quando o mapa mudava).

## 0.24 — estações, fraturas, anéis de ruído
Testes: `node smoke-test.js .` → **78 verificações a passar**. Renderer verificado com canvas simulado (anéis de ruído sem erros); `game.js`/CSS não testados num browser real.

- **Estações (roadmap E1, parcial):** `Data.seasons` (7 dias cada) e `Sim.season(s)`. Ajusta a temperatura alvo ao ar livre (`chill`: verão −0,35, outono +0,3, inverno +0,9) e a velocidade de crescimento das culturas (`grow`: 1,1 / 1,25 / 0,9 / 0,45). Medido: ao ar livre, inverno 35,71 °C vs primavera 36,60 °C. Etiqueta curta junto ao dia (`DAY 08 · SUM`). *Falta:* duração do dia por estação, clima de neve/nevoeiro, opção de começar noutra estação, roupa de inverno que compense o frio.
- **Fraturas (B3, parcial):** `p.fracture` (minutos de jogo até curar, validado 0–10080) e `p.splinted`. Causas: Brute (8 % por golpe) e choque de carro com dano ≥ 25 (25 %). Efeitos: 40 % da velocidade (75 % com tala) e sem correr. Cura em 4320 min com tala; sem tala 25 % dessa velocidade; descansar ×1,6; First aid +10 %/nível. Novo item **Splint** + receita (1 madeira, 1 pano). Moodles "Broken leg" / "Splinted leg". Gravações antigas abrem com `fracture: 0`. *Falta:* fraturas noutras partes do corpo, talas de loot nas clínicas, dor associada.
- **Anéis de ruído (C10):** `noise()` regista os últimos eventos em `s.noiseRings` (não gravados, 1,2 s de vida, máx. 16); `view.js` desenha-os como anéis que se expandem quando `state.showNoise`; tecla **N** e botão no menu de pausa.
- Correção de contagem: o registo da 0.23 dizia 67 testes, eram 65.

## 0.23 — correções reportadas em jogo
Testes: `node smoke-test.js .` → **65 verificações a passar**. CSS e `game.js` só validados sintaticamente (não testados num browser real).

- **Ficar preso (a pé):** `freeSpot()` + `Sim.unstick(s)`. Se a posição do jogador deixar de ser livre (`World.clear`), é empurrado automaticamente para o chão livre mais próximo; se tentar andar >4 s sem se mexer, aparece um aviso. Botão **"Stuck? Free me"** no menu de pausa (também dentro do carro, onde sai à força). Em terreno livre, afasta ≥ 1,2 tiles.
- **Carro (ficar preso e saída):** `exitVehicle` procura agora um ponto livre até 3,5 tiles (8 se forçado) quando os 6 vizinhos estão bloqueados. Se o carro não se mexer durante 2,5 s a tentar andar, é recolocado no ponto de estrada livre mais próximo ou o jogador sai.
- **Carro indestrutível:** choques contra obstáculos causam `velocidade × 5` de dano (uma vez por impacto, não enquanto se encosta), atropelar custa `10 + velocidade × 1,5`, os infetados fazem `dano × 1,1` (antes × 0,65). Abaixo de 45 de vida o carro fica 30 % mais lento e avisa ("The engine is smoking"). Medido: ~4 choques fortes destroem o carro.
- **Agarrar e abrandar:** ao acertar o jogador, o infetado pode agarrá-lo (walker 30 %, runner 20 %, brute 50 %): 40 % da velocidade e sem correr até 2,2 s; **Shove** liberta de imediato; andar encurta o tempo; depois 4 s sem novo agarrão. Estado "Grabbed" nos moodles. Campos `grabbed`/`grabCool` são transitórios (não gravados; gravações antigas abrem a 0).
- **Interface no telemóvel:** barra "Search items" do inventário mais baixa (34 px, fonte 16 px para o iOS não fazer zoom); botões de ação do ecrã (Run/Use/Shove/Attack) de 52→60 px com texto e ícones maiores; botões dos menus e separadores com mínimo de 42 px em ecrãs de toque.

> Nota sobre o pedido: "Walls can block" foi interpretado como *o jogador fica preso/bloqueado por paredes*; "Zombies can grab and slow me" como *mecânica de agarrar à Zomboid, mas com saída justa*. Se a intenção era outra, ajustar `unstick`/`hurt` em `sim.js`.

## 0.22 — cadáveres, doenças, skills de sobrevivência, armas
Testes: `node smoke-test.js .` → **54 verificações a passar**. Renderer verificado com canvas simulado (sem erros com cadáveres); **não testado num browser real**.

- **Cadáveres (roadmap C3, parcial):** `defeat()` deixa sempre um objeto `drop` com `corpse:true` e `died` (minutos de jogo), mesmo sem item; o `view.js` desenha um corpo caído. Desaparecem ao fim de 2 dias (5 dias se ainda tiverem saque) e há um máximo de 60 (os mais antigos saem primeiro). Gravam e restauram (id `built…`, sem mudar `saveVersion`). *Falta:* queimar/enterrar, moscas, cheiro visível.
- **Doença (B6, parcial):** novo `p.sick` (0–100, validado na gravação). Sobe perto de 2+ cadáveres (4 tiles) e com frio+molhado; desce com o tempo, mais depressa a descansar ou a dormir. ≥40 aumenta a fadiga; >70 tira vida lentamente (causa de morte "illness"). Estado "Queasy / Sick / Very sick" nos moodles. *Falta:* intoxicação alimentar, gripe/constipação com sintomas próprios, medicamentos específicos.
- **Skills (A6, parcial):** Cooking (−3 % de tempo de cozedura por nível, +3 XP por tacho), Foraging (+1 de colheita a cada 3 níveis), Fishing (−4 % de espera por nível). *Falta:* Trapping, Tracking.
- **Armas (C6, parcial):** machete, garden shovel, golf club (dados + loot em Ironworks, Westfields e armários das casas). Reutilizam o ícone `bat`. *Falta:* ícones próprios, armas de lâmina longa com mecânica própria.


Base: v0.20 "Neighbourhoods". Testes: `node smoke-test.js .` → **44 verificações a passar**. Não testado num browser real (alterações em `game.js` só verificadas com `node --check`).

## O que mudou

### 1. Skills até ao nível 10 (roadmap A1, A2, A3)
- Nova tabela `Data.skills` em `data.js` (7 skills) com `Data.skillMax = 10` e `Data.skillXp(n) = 12·n²` (mesma curva de antes; as gravações antigas mantêm o XP).
- Skills novas: **Strength**, **Fitness**, **Sneaking** (além de Combat, Building, First aid, Gardening).
- Função central `addXp(s, skill, amount)` em `sim.js`: acrescenta XP e avisa "X reached level N." ao subir. Todos os antigos `skills.X += n` passam por ela.
- Efeitos:
  - **Fitness** (XP ao correr): stamina gasta −5 % por nível e recupera +5 % por nível.
  - **Strength** (XP ao bater em melee): dano corpo a corpo +3 % por nível e +1 kg de capacidade a cada 2 níveis (`Sim.capacity`).
  - **Sneaking** (XP a andar furtivamente): ruído dos passos −4 % por nível (acumula com o papel Scout).
  - **Combat**: o bónus de dano passa a escalar até ao nível 10.
- Compatibilidade: gravações antigas sem as skills novas abrem com 0; a validação aceita qualquer skill de `Data.skills` e rejeita valores negativos ou não numéricos. **`saveVersion` não mudou.**
- UI: painel **Health → Skills** com nível e % para o seguinte (`skillsHtml` em `game.js`).

### 2. Estados graduados / "moodles" (roadmap B1)
- `Sim.moodles(s)` devolve uma lista ordenada por gravidade com `{id, level, label}`: Hurt, Bleeding, Wound infected, Hungry, Thirsty, Tired, Winded, Pain, Panic, Cold, Wet, Load.
- Exemplo: fome <50/30/15/5 → Peckish / Hungry / Very hungry / Starving.
- `statusText()` em `game.js` mostra os 4 mais graves nas etiquetas do ecrã (mais "VIRAL INFECTION", horda, descanso e modo construção como antes).

### 3. Sono real (roadmap B5)
- Na cama, com fadiga ≥ 35, o botão passa de **Rest** a **Sleep**. Com menos cansaço mantém o descanso rápido de antes.
- `Sim.sleep(s)` (e a cama através de `sleepPending`, que corre no fim do `tick` para evitar recursão) avança a simulação normal em passos de 0,25 s até: fadiga ≤ 4, 10 horas de jogo, perigo (`threats`/descanso interrompido) ou dano.
- Durante o sono: fadiga −0,45/s, fome e sede a metade, regeneração de vida a metade do descanso, feridas curam como em descanso.
- Recusa dormir com infetados à vista, com fome ou sede < 12, ou com fadiga < 20.
- Medido: um sono demora cerca de 0,1 s de CPU; em 12 testes com um infetado a aproximar-se, o jogador acordou sempre antes de levar dano.

### 4. Outros
- Versão 0.21 em `data.js`, `index.html` (`?v=`) e README. README ganhou a secção "Skills, estados e sono".
- Texto da mochila: "Adds 10 kg of capacity" (a capacidade total agora depende da Strength).

## Ficheiros tocados
`data.js` (skills, versão) · `sim.js` (level/addXp, capacity, create, XP sites, strength/fitness/sneaking, moodles, sleep, validação) · `game.js` (statusText, skillsHtml, rótulo da cama, texto da mochila) · `index.html` (só `?v=`) · `README.md`.

## Ideias para a próxima sessão (por ordem)
1. **C10** raio de ruído visível (opcional) e **B1** com ícones em vez de texto.
2. **D3/D4** tabelas de saque por divisão + tempo de pesquisa.
3. **C3** cadáveres (ficam no chão, revistáveis, causam doença).
4. **E1** estações do ano e **E4** isolamento da roupa por peça.
5. **F1/F2** crafting escalável com estações.
6. Equilíbrio das skills com jogadores reais (XP por ação, efeitos por nível).
