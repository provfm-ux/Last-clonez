# Last CloneZ 0.21 · Neighbourhoods

Jogo de sobrevivência isométrica para teclado, rato e toque. Escolhe uma aparência, um percurso e um ponto de partida em Cold Vale. **Customize** permite ajustar as regras de cada preset.

## Primeira partida

- **Recommended start** começa no abrigo com o preset Survival e o mapa com marcadores. Até dormires pelo menos uma hora ou amanhecer, os golpes dos infetados causam 40% menos dano em Cold Vale e as hordas itinerantes e sirenes ficam suspensas. Os infetados já presentes continuam ativos.
- Recolhe e equipa o taco, escuta à porta de uma casa e procura uma ligadura. Se te ferires, usa-a no inventário ou em **Health**. Regressa ao abrigo ao anoitecer. Podes desligar as dicas em **Advanced** ou no menu de pausa.
- O objetivo fixo começa por encontrar a Eva. No modo sem mapa, segue os sinais para a clínica a norte. Em **Advanced** podes escolher o modo de exploração, personagem, preset, regras, ponto de partida e seed.
- Para testar a primeira partida, ativa **Record Recommended playtest milestones locally** em **Advanced**. Os tempos ficam na gravação e em **Journal → Playtest report**. O jogo não os envia.

## Dificuldade e assistências

- **Advanced** mostra a pressão de combate, escassez e necessidades de cada preset. Os outros modos aparecem em **More modes**.
- **Assists** ajusta os avisos de ataque, agarrões, hemorragia, lembrete de ligadura, custo de resistência e mira de toque. Os cinco primeiros vêm ligados em Recommended até escolheres as tuas preferências. A mira de toque começa desligada.
- **Adaptive hordes** dá uma pausa nas hordas quando a vida desce abaixo de 30 e antecipa uma horda se ficares muito tempo parado em segurança no abrigo. Está ligado por defeito em novas partidas Relaxed e Survival.
- Em **Pause → Difficulty and assists**, podes mudar assistências e a pressão de combate, necessidades e hordas sem gerar o mapa de novo. Aumentar a pressão pede confirmação. As mudanças aparecem no relatório de teste.
- As travessias indicam o perigo da região. Nas novas partidas, os infetados dos Outer Districts causam 15% mais dano.
- Para comparar presets com um bot simples, corre `node scripts/balance.js 3 game 2`. O CSV distingue mortes de partidas ainda vivas ao fim do teste.

## Bairros e exploração

- **Casas compactas.** Explora cozinhas, quartos e quintais em Cold Vale e nos quatro mapas exteriores. Procura no frigorífico, no armário do quarto e nos móveis do corredor. Nos trilhos e quintais há amoras, maçãs e isco.
- **Portas e infetados.** Uma porta pode começar aberta. Alguns infetados andam pela casa e outros reagem à aproximação ou ao barulho. Usa **Listen** ao pé da porta e verifica o quarto antes de recolher saque.
- **Seed.** Deixa **Map seed** em branco para sortear uma partida ou escreve um número para repetir o mapa, o saque e as posições iniciais dos infetados com as mesmas regras. O número aparece no diário.
- **Pistas e humor.** Procura recados, objetos e esconderijos com ligações entre mapas. As descobertas ficam em **Journal → Field ledger**.
- **Gravações.** Usa **Start new run** para jogar no mapa com os bairros novos. **Continue** recupera a partida gravada com o mapa em que começou. Para mudar de endereço ou navegador, usa **Journal → Export save** e **Import save**.

## Skills, estados e sono (0.21)

- **Skills até ao nível 10.** Há sete: Combat, Strength, Fitness, Sneaking, Building, First aid e Gardening. Fitness cresce a correr, Strength a lutar corpo a corpo e Sneaking a andar furtivamente. Vê o progresso em **Health → Skills**.
- **Estados graduados.** Fome, sede, cansaço, dor, frio, carga e outros passam por vários níveis (ex.: Peckish, Hungry, Very hungry, Starving). Os quatro mais graves aparecem no ecrã.
- **Dormir.** Numa cama, com cansaço de 35 ou mais, o botão passa a **Sleep**: o tempo avança até ao fim da noite (máx. 10 h). Dormir recupera fadiga e saúde, gasta menos fome e sede, e perigo ou dor acordam-te.

## Novidades da 0.22

- **Cadáveres.** Os infetados mortos ficam no chão (podem ter roupa ou itens para revistar) e desaparecem ao fim de 2 dias. Ficar perto de 2 ou mais corpos deixa-te **doente** (Queasy → Sick → Very sick): cansas-te mais depressa e, em casos graves, perdes vida. Afasta-te para recuperar; dormir ou descansar ajuda.
- **Frio e humidade.** Ficar molhado e com frio também te deixa doente.
- **Skills de sobrevivência.** Cooking (comida cozinha mais depressa), Foraging (colheitas maiores) e Fishing (o peixe morde mais cedo).
- **Armas novas.** Machete (Ironworks, Tool cage), garden shovel (Westfields, Farm tools) e golf club (armários das casas).

## Visual "Dark pixel" (0.30)

- **Pausa → Atmosphere** permite escolher *Full*, *Reduced* ou *Off*. O valor automático usa *Reduced* em Fast e *Full* nos outros modos. *Off* recupera a iluminação e a chuva anteriores.
- As janelas iluminam o chão à noite enquanto houver eletricidade. Um gerador ou uma fogueira próxima pode manter alguma luz após o corte. A lanterna tem um feixe quente que continua a ser bloqueado por paredes e portas.
- A chuva deixa reflexos suaves no chão e a neblina é mais visível junto à costa e ao amanhecer ou anoitecer. **Reduce flicker** estabiliza a lanterna com pouca carga e a luz do fogo. As opções ficam guardadas no navegador.

- **Novo visual por defeito:** o mundo é desenhado a baixa resolução (~640 px de largura) e ampliado com pixels duros, com um tom frio e dessaturado, vinheta e nevoeiro baixo. O chão ganhou micro textura (ervas, pedras, fissuras no asfalto, terra) e **sangue espalhado**: manchas, poças e rastos. Os cadáveres têm poça de sangue por baixo.
- **Menu de pausa → Graphics:** *Dark pixel* (novo), *Fast* (visual antigo com cache) e *Classic* (visual antigo sem cache). A escolha fica guardada.
- Tudo o que é texto e interface continua nítido, à resolução normal.

## Desempenho (0.29)

- **Jogo mais leve no PC.** O chão deixa de ser redesenhado polígono a polígono a cada frame: é desenhado uma vez por blocos de 8×8 tiles e reutilizado (só refaz um bloco quando exploras ou mudas o zoom). Medido com um canvas simulado: **de ~7.900 para ~2.000 operações de desenho por frame**, e de ~1.070 para ~240 polígonos.
- **Minimapa.** Deixou de percorrer os 12.000 tiles do mapa várias vezes por segundo; guarda a camada e só a refaz quando exploras ou abres/fechas portas.
- **Botão *Graphics: Fast / Classic*** no menu de pausa. *Fast* é o novo (por defeito); *Classic* é o desenho antigo. Se vires linhas ou falhas estranhas no chão, põe *Classic* e diz-me. A escolha fica guardada.
- Diferença visual esperada em *Fast*: o escurecimento à distância é um único gradiente suave à volta do jogador, em vez de um polígono por tile (já não há o escurecimento extra por zona).

## Novidades da 0.28

- **Três regiões novas** (em jogos novos), a pé a partir das regiões exteriores: **Slag Quarry** (a partir de Ironworks, saída a leste), **Greywater Reservoir** (a partir de Westfields, saída a sul) e **Gull Point** (a partir de Bracken Coast, praia a sul-este). Cada uma tem edifícios com saque, pontos de pesca, amoras, uma casa trancada e a **chave escondida noutro edifício da mesma região** (a pedreira guarda um paiol com pistola e munições). O mapa total passa de 6 para 9 zonas.
- **Botão Attack no lado direito.** É o botão maior e mais visível (vermelho, 98 px, a pulsar quando está pronto), no canto inferior direito. Os outros três (Run, Use, Shove) ficaram mais pequenos e em linha por cima dele, com espaço livre entre eles.

## Novidades da 0.27

- **Mais para explorar.** Em jogos novos, Pine Ridge, Ironworks, Bracken Coast e Westfields têm cada uma **7 locais extra** espalhados longe do ponto de chegada (caixas e cacifos com nomes como *Knowby's cellar hatch*, *Umbra Corp supply crate*, *Dead Calm dinghy cache*, *Terminus fence cache*): armas, roupa, talas, ferramentas e comida. Jogos anteriores mantêm o mapa que já tinham.
- **Aviso de arma gasta.** Quando a arma desce abaixo de 20 % de condição, o jogo avisa antes de ela começar a falhar.

## Novidades da 0.26

- **Chaves com dono.** Cada segunda casa de porta fechada está **trancada**. A chave dessa casa está escondida noutra casa da mesma zona (armário ou despensa) e vem **etiquetada com o nome da casa** ("Key tag: Spencer Row no. 6"). A chave só abre a casa certa, e a etiqueta aparece no inventário. A porta trancada diz-te o nome da casa a que falta a chave.
- **Casas com nome.** Todas as casas têm nome ou número, com piscadelas aos filmes de zombies (Cemetery Road farmhouse, The Winchester cottage, Raccoon Rise, Spencer Row, Willard Close, Uneeda Row, Monroe Court, Greene Acres, Knowby Woods cabin, Busan Line cottages...).
- **Portas abertas deixam os infetados entrar.** Infetados parados perto de uma porta aberta podem entrar na casa e, se estás lá dentro com a porta aberta, os que estão perto reparam em ti e vêm. Fecha a porta atrás de ti.

## Novidades da 0.25

- **Roupa por camadas.** Sete ranhuras: cabeça, mãos, pulso, braços, corpo, pernas e pés. Começas com jeans e botas. **Casaco de inverno**, **gorro**, **luvas**, jeans e botas dão calor (compensam o frio do inverno) e **protegem de golpes**: reduzem o dano e, às vezes, impedem a ferida e a infeção (braços: braçadeiras, luvas, casaco; pernas: jeans, botas). Encontras roupa nos armários das casas.
- **Passagens estreitas.** Se encostares a um canto ao lado de uma porta ou abertura, o jogador (e os infetados) deslizam para a abertura em vez de ficarem presos.
- **Botão Attack** no telemóvel: agora é um botão redondo, sozinho, no canto esquerdo e mais acima, longe dos outros.

## Novidades da 0.24

- **Estações do ano.** Cada estação dura 7 dias (primavera, verão, outono, inverno; começas na primavera). O verão aquece um pouco e acelera as culturas; o inverno arrefece (cuidado com chuva à noite) e as culturas crescem a menos de metade da velocidade. A estação aparece junto ao dia (ex.: DAY 08 · SUM).
- **Fraturas e tala.** Um golpe de Brute ou um choque forte de carro pode partir-te a perna: andas a 40 % da velocidade e não corres. Faz uma **tala** (1 madeira + 1 pano) e usa-a: andas a 75 %, e a perna cura em ~3 dias de jogo (descansar ajuda, e a skill First aid acelera). Sem tala cura 4 vezes mais devagar.
- **Anéis de ruído.** Prime **N** (ou *Noise rings* no menu de pausa) para veres círculos que mostram até onde cada ruído que fazes se ouve.

## Correções da 0.23

- **Preso?** Se ficares dentro de uma parede ou num canto, o jogo empurra-te para chão livre. Se tentares andar e não saíres do sítio durante 4 s, aparece um aviso. No **menu de pausa** há agora o botão **Stuck? Free me**, que também funciona dentro do carro.
- **Carro.** Bater em obstáculos a velocidade causa dano (cerca de 4 choques fortes destroem o carro), atropelar custa mais e os infetados danificam-no mais. Com o motor muito danificado o carro anda mais devagar. Se o carro ficar preso num sítio sem saída, liberta-se sozinho ou sais; já não ficas fechado lá dentro.
- **Infetados agarram.** Quando um infetado te acerta, pode agarrar-te: ficas a 40 % da velocidade e sem correr durante até 2,2 s. **Empurrar (Shove)** liberta-te logo; andar também encurta o tempo. Depois há uma pausa de alguns segundos sem novo agarrão.
- **Telemóvel.** A barra de pesquisa do inventário ficou mais baixa e os botões de ação (Run, Use, Shove, Attack) e os dos menus ficaram maiores.

## Também disponível

- **Cinder Grotto.** A partir do trilho junto à cabana Firewatch, em Pine Ridge, desce por uma corda. A gruta tem 42 × 42 quadrículas e carrega como uma região própria. Leva uma lanterna e pilhas. A caixa no trilho tem material de reserva. A rocha bloqueia o feixe e o mapa guarda o terreno explorado.
- **Personagem.** Escolhe **Woman** ou **Man**. Usa **Gear → Edit survivor** para editar o perfil durante a partida. **Mechanic** repara mais dano por remendo. **Electrician** gasta menos pilha. **Ranger** recolhe mais frutos e isco.
- **Veículos.** Remenda um veículo danificado com duas unidades de sucata e uma de fita adesiva. O trabalho faz barulho.

## Controlos

| Ação | Teclado ou toque |
| --- | --- |
| Andar e correr | **WASD**, setas ou joystick. **Shift** ou botão **Run** para correr. |
| Interagir | **F**, toque no objeto ou no rótulo. **K** lista os objetos ao alcance. |
| Atacar e empurrar | **Espaço** ou **Attack**. **X**, **Q** ou **Shove** para empurrar. |
| Luz | **L** ou ranhura 4 do cinto por defeito. Troca a pilha em **Gear**. |
| Mapa e diário | **M** e **J**. Marca uma saída para seguir a seta até lá. |
| Ecrã inteiro | Botão no topo ou **Shift+Enter**. |

As hordas de superfície dão um aviso sonoro antes de entrar no mapa. Os filamentos de fungo podem acordar infetados. Ajusta as hordas em **Customize → Wandering hordes**. O botão do altifalante controla o áudio.

## Abrir o jogo

O ZIP tem o `index.html` na raiz para importar no Netlify. Para jogar localmente, extrai o ZIP, abre um terminal na pasta extraída e executa `python3 -m http.server 8080`. Depois abre [http://localhost:8080](http://localhost:8080).

No repositório, os ficheiros do jogo estão em `dist/`. Usa `python3 -m http.server 8080 --directory dist` para jogar e `npm install` seguido de `npm test` para correr os testes.
