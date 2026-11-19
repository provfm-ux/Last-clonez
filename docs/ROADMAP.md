# Last CloneZ v0.20 vs Project Zomboid — o que falta (roadmap + handover para o ChatGPT)

> **Estado:** a Fase 1 está parcialmente feita na **v0.21** (ver secção 7 e `CHANGELOG.md`). Os itens A1, A2 e B5 estão concluídos; A3 e B1 parcialmente. As tabelas da secção 3 descrevem o estado da v0.20.
>
> **Para o ChatGPT:** lê este documento inteiro, depois o `HANDOFF_CHATGPT.md` (convenções, gravações, testes). Trabalha **uma fase de cada vez**, em passos pequenos, e corre `node smoke-test.js .` antes e depois de cada alteração. No fim de cada sessão, atualiza a secção 7 (registo de progresso).

Data da análise: 13 nov 2026 · Jogo analisado: Last CloneZ **0.20 "Neighbourhoods"** · Referência: Project Zomboid **Build 42** (42.20 estável desde 29 jul 2026; 42.21 estável desde 28 set 2026).

## 0. Como ler e limites desta análise

- **Verificado no código** (leitura de `data.js`, `sim.js`, `world.js`, `regions.js`, `homes.js`, `README.md`; `node --check` OK; `smoke-test.js` passa 24/24): marcado como **[V]**.
- **Não verificado** (não abri esse sistema, ou só vi o nome): marcado como **[?]** — confirmar no código antes de implementar.
- A lista do Zomboid vem de fontes online sobre o Build 42 (secção 8) e do conhecimento geral do jogo. Algumas contagens (ex.: nº de skills) variam entre fontes e versões; usa-as como ordem de grandeza.
- O jogo **não deve copiar tudo**. A secção 6 diz o que ignorar.
- Eu (Claude) não testei nada num browser real.

## 1. O que o Last CloneZ já tem (v0.20)

**Arquitetura [V]:** JS puro, 13 scripts carregados por ordem (`data → research → legacy-level → level → regions → homes → chronicle → world → atmosphere → soundscape → sim → view → game`). `Sim` é independente do DOM e testável em Node. Gravação em `localStorage` com validação estrita, exportar/importar e migrações preparadas.

**Mundo [V]:** Cold Vale (74×74) + 4 regiões exteriores (Pine Ridge, Ironworks, Bracken Coast, Westfields) + Cinder Grotto (gruta 42×42, subterrânea, só lanterna). Casas compactas com residentes e portas (`homes.js`), seed do mapa, mini-mapa/mapa com marcadores, diário "Field ledger".

**Sobrevivência [V]:** fome, sede, fadiga, stamina, temperatura, humidade, exposição ao vírus, pânico, dor; feridas (corte/arranhão, sangramento, ligadura, desinfetante, infeção gradual); analgésicos; descansar na cama; ciclo dia/noite; chuva; cortes de água e luz por dia.

**Combate [V]:** 7 armas (taco, tubo, lança, machado, faca, pé-de-cabra, pistola) com desgaste e reparação; empurrar; chance de acertar; 3 tipos de infetado (walker, runner, brute) com roupas variadas; ruído atrai infetados; hordas com aviso; filamentos de fungo; infetados dentro de casas ("Listen" à porta).

**Inventário e construção [V]:** peso (16 / 26 com mochila), cinto de 4 slots, 3 slots de equipamento (pulso, braços, corpo), ~49 itens, comida que apodrece, 10 receitas, barricadas, caixa de arrumação, fogueira, cerca, portão, horta, coletor de chuva.

**Comida e utilidades [V]:** horta (rabanete, morango, batata), pesca, forrageio (amoras, maçãs, isco), cozinhar/secar na fogueira, ferver água, gerador com combustível, torneira, lanterna com pilhas.

**Veículos [V]:** carros com vida e combustível, entrar/conduzir/sair, reparar com sucata e fita (o Mecânico repara mais).

**Progressão [V]:** 4 skills (combate, artesanato, medicina, jardinagem, nível máx. 5) e 6 papéis (Carer, Builder, Scout, Mechanic, Electrician, Ranger). 9 presets e 14 regras personalizáveis. Eva (NPC aliada, recrutável, ajuda na horta, missões "dispatch"), rádio.

**Extras acima do Zomboid:** NPC aliado funcional (o PZ só planeia NPCs humanos para o Build 43), pistas/história com ligações entre mapas, jogo em toque/telemóvel, jogável no browser sem instalação.

## 2. Resumo da distância (por área)

| Área | Zomboid B42 | Last CloneZ 0.20 | Distância |
|---|---|---|---|
| Skills | ~35 skills, nível 10, livros/revistas | 4 skills, nível 5 | Muito grande |
| Estados de saúde (moodles, partes do corpo) | Dezenas | Poucos, sem partes do corpo | Grande |
| Crafting | Centenas de receitas, estações | 10 receitas | Muito grande |
| Mundo | Mapa enorme, andares, caves, arranha-céus | 5 mapas + gruta, sem andares | Grande |
| Zumbis | Sentidos configuráveis, caídos, cadáveres | 3 tipos, ruído e visão | Médio |
| Veículos | Muitos modelos, peças, mala | Carro básico | Grande |
| Comida/animais | Estações, animais, caça, armadilhas | Horta simples, pesca | Grande |
| Clima/estações | 4 estações, nevoeiro, tempestades, neve | Chuva, ciclo diário | Médio |
| Criação de personagem | Ocupações + traços (pontos) | 6 papéis | Médio |

## 3. Lista detalhada do que falta

Prioridade: **P1** (alto impacto, cabe na arquitetura atual) · **P2** (médio) · **P3** (longo prazo). Esforço: **S** (horas) · **M** (1–2 dias) · **L** (vários dias).

### A. Personagem e progressão
| ID | Falta | Notas de implementação | Prio | Esf. |
|---|---|---|---|---|
| A1 | **Sistema de skills orientado a dados** (tabela `Data.skills`, XP por ação, curva de níveis até 10, painel de skills) | Hoje há `level()` fixo a 5 e 4 skills em `player.skills`. Criar framework antes de acrescentar skills. Migração de gravações. | P1 | M |
| A2 | Skills passivas: Fitness (stamina) e Strength (dano e peso) | Sobem com o tempo a correr/combater/carregar | P1 | S |
| A3 | Skills de agilidade: Sprinting, Lightfooted (ruído de passos), Nimble, Sneaking | Já existe `quiet` e "Scout"; ligar ao ruído | P1 | M |
| A4 | Skills por tipo de arma (machado, contundente longo/curto, lâmina longa/curta, lança) + Maintenance | Hoje só "combat" geral | P2 | M |
| A5 | Firearms: Aiming e Reloading | Hoje só chance de acerto genérica | P2 | M |
| A6 | Skills de sobrevivência: Cooking, Foraging, Fishing, Trapping, Tracking | Ligar a sistemas C, G | P2 | M |
| A7 | Skills de artesanato: Carpentry, Electrical, Mechanics, Tailoring, Metalworking/Welding, Blacksmithing, Carving, Knapping, Masonry, Pottery, Glassmaking | Só depois do sistema de crafting (F) | P3 | L |
| A8 | **Ocupações e traços** na criação de personagem (pontos positivos/negativos, ex.: Fast Learner, Lucky, Thick Skinned, Hemophobic) | Substituir/expandir os 6 papéis | P2 | L |
| A9 | Livros e revistas de skill (XP acelerado, receitas por revista) | Item novo + loot | P2 | M |
| A10 | Multiplicador de XP e opções de sandbox para skills | Regra extra em `ruleFields` | P3 | S |

### B. Saúde e estados
| ID | Falta | Notas | Prio | Esf. |
|---|---|---|---|---|
| B1 | **Painel de estados ("moodles")** sempre visível: com fome, sede, cansado, ferido, dor, pânico, stress, doente, molhado, frio/calor, carga pesada, a sangrar | Os valores já existem; falta a UI e os limiares | P1 | S |
| B2 | **Partes do corpo** (cabeça, tronco, braços, mãos, pernas, pés) com dano, dor e feridas por parte | Hoje as feridas têm `part` mas sem modelo completo | P1 | L |
| B3 | Tipos de ferida: arranhão, laceração, ferida funda, mordida, queimadura, fratura, estilhaço/bala | Hoje só corte/arranhão/mordida [?] | P1 | M |
| B4 | Tratamento: suturas, tala, pinça, desinfetar por parte, trocar ligaduras sujas | Skill de primeiros socorros (A6) | P1 | M |
| B5 | **Sono real** (dormir avança o tempo, qualidade da cama, interrupções por ruído, insónia) | Hoje existe "resting" (descanso) [V]; falta avançar tempo e risco | P1 | M |
| B6 | Doenças: constipação/gripe, intoxicação alimentar, cadáveres a causar doença | Ligar a comida podre e cadáveres | P2 | M |
| B7 | Stress, tédio e infelicidade (leitura, rádio/TV, passatempos) | Efeitos no pânico e na saúde mental | P2 | M |
| B8 | Nutrição: calorias, peso do personagem, ganhar/perder peso | Hoje só fome simples | P3 | M |
| B9 | Álcool, tabaco, drogas (efeitos e dependência) | | P3 | M |
| B10 | Higiene e sujidade (sangue/sujidade em roupa, lavar-se, lavar roupa) | | P3 | M |
| B11 | Morte e reanimação: transformar-se em infetado, "tempo até à infeção", mensagens de sintomas | A infeção hoje é por exposição/feridas [V]; rever detalhe | P2 | M |

### C. Combate e infetados
| ID | Falta | Notas | Prio | Esf. |
|---|---|---|---|---|
| C1 | **Modelo de sentidos configurável** (visão, audição, olfato, memória, cognição) com sliders de sandbox | Hoje: alerta por ruído e visão [V]; expor parâmetros em `Data.infected`/regras | P1 | M |
| C2 | Opções de infetados: velocidade (shambler/fast/sprinter), força, resistência, transmissão, respawn/migração | Hoje só `mix` (walker/runner/brute) | P1 | M |
| C3 | **Cadáveres**: ficam no chão, podem ser revistados, queimados, causam doença, atraem moscas | Hoje os mortos desaparecem [?] | P1 | M |
| C4 | Infetados caídos/a rastejar, cair ao ser empurrado, pisar no chão | Estado novo em `updateEnemies` | P2 | M |
| C5 | Condição e afiação das armas, cabo/cabeça separados (B42), manutenção | Hoje só `wear` único [V] | P2 | M |
| C6 | Mais armas: machete, martelo de guerra, pá, enxada, bastão metálico, arco/besta, lança melhorada | Dados em `Data.items` | P2 | S |
| C7 | **Firearms completos**: munições por calibre, carregadores, recarregar, encravar, ruído, silenciador, mira por zona do corpo (B42) | Hoje: só uma pistola, 9 mm [V] | P2 | L |
| C8 | Explosivos e armadilhas de ruído (molotov, bomba de cano, latas, armadilha de cola) | | P3 | M |
| C9 | Eventos meta: tiros e sirenes distantes, alarmes de casa e de carro, helicóptero | O jogo tem sirene/colisão [V]; generalizar para um sistema de eventos | P2 | M |
| C10 | **Visualização do raio de ruído** (modo opcional) e feedback de furtividade | Ótimo para jogabilidade | P1 | S |
| C11 | Atropelar infetados com veículo, ragdoll simples | | P3 | M |
| C12 | Tipos de infetado extra: queimados, de uniforme/SWAT com proteção, "bloater/spitter" não existem no PZ (evitar) | Só variantes de resistência/aparência | P3 | S |

### D. Mundo, edifícios e exploração
| ID | Falta | Notas | Prio | Esf. |
|---|---|---|---|---|
| D1 | **Vários andares** (escadas, telhados, janelas para trepar) | Maior mudança estrutural do mapa (`world.js`, `view.js`) | P2 | L |
| D2 | Caves/bunkers e arranha-céus (B42) | Só depois de D1; a gruta (Cinder Grotto) já é "região subterrânea" [V] | P3 | L |
| D3 | **Tabelas de saque por tipo de divisão/edifício** (cozinha, quarto, armário, loja, oficina) com raridade | Hoje há saque por móvel [V]; centralizar em `Data.loot` | P1 | M |
| D4 | Tempo de pesquisa por contentor e modos de revista; contentores vazios/visitados | `loot` actions [V] | P1 | M |
| D5 | **Portas trancadas, chaves, porta-chaves, arrombar, partir janelas (vidros/estilhaços), trepar cercas** | Há `breach` e chave da esquadra [V]; generalizar | P1 | M |
| D6 | Alarmes de casa | Liga a C9 | P2 | S |
| D7 | Interiores aleatórios, casas já saqueadas/sujas, mobília variada | `homes.js` já gera casas [V]; adicionar variação de estado | P2 | M |
| D8 | Mapa maior e mais cidades (o B42 mais do que duplicou o mapa, ~1400 edifícios novos) | Mais regiões em `regions.js`; custo alto de arte | P3 | L |
| D9 | Zonas de saque/sandbox (rural vs. urbano), estradas, quintas, campos, lagos, rios | | P2 | M |
| D10 | Lixo, caixotes, carros abandonados com saque, acidentes na estrada | | P2 | M |
| D11 | Ecrã de mapa com símbolos extra e anotações (já há pins [V]) | Pequenos extras | P3 | S |

### E. Clima, tempo e luz
| ID | Falta | Notas | Prio | Esf. |
|---|---|---|---|---|
| E1 | **4 estações** (temperatura e duração do dia variam, afetam culturas) | Hoje o clima é um ciclo de chuva [V] | P1 | M |
| E2 | Mais tipos de clima: nevoeiro, tempestade com trovões, neve, vento | `atmosphere.js` | P2 | M |
| E3 | Data de início e meses configuráveis, calendário | `startHour` já existe [V]; acrescentar data | P2 | S |
| E4 | Temperatura do corpo com isolamento da roupa por peça e por zona | Hoje só impermeável [V] | P1 | M |
| E5 | Iluminação: luz através de janelas, candeeiros de rua, luz de casa com eletricidade, escuridão mais forte à noite | Ligar a cortes de luz [V] | P2 | M |
| E6 | Fogo: propagação, lareiras, fogões a lenha, aquecimento | Depende de F | P3 | L |

### F. Crafting e construção
| ID | Falta | Notas | Prio | Esf. |
|---|---|---|---|---|
| F1 | **Sistema de receitas escalável** (ficheiro de dados, categorias, pesquisa, filtro "posso fazer", ingredientes próximos) | Hoje 10 receitas em `Data.recipes` [V]; preparar para centenas | P1 | M |
| F2 | **Estações de trabalho** (bancada, forja, roda de olaria, bancada de carpintaria, fogão) com requisitos | Existe "workbench" [V]; transformar em sistema | P1 | M |
| F3 | Menu de construção: paredes, portas, janelas, chão, escadas, telhado, muros de sacos de areia, barricada de metal | Hoje: cerca, portão, caixa, barricada [V] | P1 | L |
| F4 | Mover/rodar/arrumar mobília, transportar móveis, colocar itens livremente no chão | Interação nova | P2 | M |
| F5 | Desmontar com skill e rendimento (já há "dismantle" [V]) | Ligar a A7 | P2 | S |
| F6 | Costura (remendar roupa, fazer roupa/armadura), couro | Depende de B/C | P3 | M |
| F7 | Soldadura, forja, metal, vidro, olaria, alvenaria, esculpir, lascar pedra | Tudo depende de F1–F2 | P3 | L |
| F8 | Elétrico: fios, lâmpadas, eletrodomésticos, painéis solares, baterias | Gerador já existe [V] | P3 | L |
| F9 | Canalização: poços, bombas, barris, purificação com comprimidos | Torneira e coletor já existem [V] | P2 | M |

### G. Comida, agricultura e animais
| ID | Falta | Notas | Prio | Esf. |
|---|---|---|---|---|
| G1 | **Culturas sazonais** (milho, ervilhas, tomate, couve, ervas…), janelas de plantação, doenças e pragas, rega, adubo | Hoje 3 culturas [V] | P1 | M |
| G2 | **Cozinhar a sério**: receitas com ingredientes, skill, comida crua/queimada, utensílios | Hoje só grelhar/cozer [V] | P1 | M |
| G3 | Conservação: frigorífico/congelador dependentes de eletricidade, enlatar, secar, fumar | Eletricidade já tem cortes [V] | P2 | M |
| G4 | Armadilhas e caça: laços, gaiolas, isco, animais selvagens (coelho, veado, rato) | Isco já existe [V] | P2 | M |
| G5 | Pesca melhorada: espécies, tamanho, ruído afasta peixe, isco/chum, redes | Pesca básica [V] | P2 | M |
| G6 | **Criação de animais** (galinhas, vacas, ovelhas, porcos…): currais, comida, ovos, leite, reprodução | Sistema novo grande | P3 | L |
| G7 | Abate e processamento (carne, couro, ossos) | Depende de G4/G6 | P3 | M |
| G8 | Forrageio com herbas, cogumelos, insetos e venenosos | Forrageio básico [V] | P2 | M |

### H. Veículos
| ID | Falta | Notas | Prio | Esf. |
|---|---|---|---|---|
| H1 | **Mala e bancos como contentores** | Vem de F4/inventário | P1 | M |
| H2 | **Peças e mecânica**: bateria, pneus, travões, motor, silenciador, portas, vidros; skill Mechanics | Hoje só vida e combustível [V] | P2 | L |
| H3 | Chaves, ligação direta, alarme do carro, luzes, buzina, rádio | Alarme liga a C9 | P2 | M |
| H4 | Bombas de gasolina (precisam de eletricidade), sifão | Gerador/eletricidade já existem [V] | P2 | M |
| H5 | Vários modelos de veículo (mala, consumo, velocidade, peso) e reboques | Dados | P3 | M |
| H6 | Colisões, dano por peça, atropelamento | | P3 | M |

### I. Interface, inventário e acessibilidade
| ID | Falta | Notas | Prio | Esf. |
|---|---|---|---|---|
| I1 | Roupa por camadas e mais slots (cabeça, mãos, pernas, pés, mochila de cintura) com proteção e isolamento por peça | Hoje 3 slots [V] | P1 | M |
| I2 | Várias mochilas/contentores portáteis, "transferir tudo", ordenar/filtrar | Inventário já tem listas [V] | P2 | M |
| I3 | Painel de skills e de saúde por partes do corpo | Liga a A1, B2 | P1 | M |
| I4 | **Remapear teclas** e ecrã de definições | Já usa `event.code` [V] | P2 | M |
| I5 | Suporte a comando (gamepad) | Hoje teclado, rato e toque [V] | P3 | M |
| I6 | Daltonismo, tamanho de texto, contraste, leitor de ecrã | | P2 | M |
| I7 | **Tradução para português (pt-PT)** e sistema de idiomas | Mensagens já têm `lang`; log filtra `"en"` [V] | P2 | L |
| I8 | Tutorial/dicas iniciais e ecrã de ajuda por contexto | Existe `help` em `game.js` [V] | P2 | S |

### J. Sandbox, modos e criação de partida
| ID | Falta | Notas | Prio | Esf. |
|---|---|---|---|---|
| J1 | Mais opções de sandbox (o PZ tem 100+): taxa de apodrecimento, decaimento de armas, respawn de saque, nº de contentores, XP, tempo de mudança de estação | `ruleFields` tem 14 [V]; migrar para tabela escalável | P1 | M |
| J2 | Modos nomeados ao estilo B42 (Apocalypse, Outbreak, Rising, Extinction) e desafios com cenário fixo (ex.: começar num telhado; 28 min depois) | Hoje 9 presets [V] | P2 | S |
| J3 | Escolher região/ponto de partida mais livre | Hoje 6 pontos fixos [V] | P2 | S |
| J4 | Criação de personagem (nome/aparência já existem [V]) com ocupação, traços, roupa inicial, pontos | Liga a A8 | P2 | M |

### K. Gráficos e áudio (ver também o mockup do estilo anos 2000)
| ID | Falta | Notas | Prio | Esf. |
|---|---|---|---|---|
| K1 | **Cache do terreno** em canvases por blocos para desempenho | Plano em `HANDOFF_CHATGPT.md`; verificar visualmente | P1 | M |
| K2 | Sprites pré-renderizados (estilo anos 2000), atlas único, animação por direções | Ver mockup; precisa de arte | P2 | L |
| K3 | Animações de combate, morte, trepar, dormir | Dependem de K2 | P3 | L |
| K4 | Áudio: passos por superfície, ambiente, gemidos de infetados direcionais, vozes do personagem (tosse, esforço, dor), música rara | `soundscape.js` é pequeno (96 linhas) | P2 | M |
| K5 | Efeitos: sangue persistente, buracos de bala, vidros partidos, fumo/fogo | | P3 | M |

### L. Engenharia (fora do Zomboid, mas necessário)
| ID | Falta | Notas | Prio | Esf. |
|---|---|---|---|---|
| L1 | Testes: incluir `smoke-test.js` (ou o `npm test` do repositório) no pipeline; testes de determinismo por seed e de migração de gravações | O zip v0.20 só traz o `dist` sem os testes [V] | P1 | S |
| L2 | Partir `sim.js` (2392 linhas) e `game.js` (1933) em módulos por sistema (necessidades, combate, veículos, crafting, UI) | Um sistema de cada vez, com testes verdes | P2 | L |
| L3 | Dados em ficheiros separados (JSON/JS por categoria) para facilitar mods e conteúdo | `Data` já concentra tudo [V] | P2 | M |
| L4 | Service worker para jogar offline, com cache versionada | | P3 | S |
| L5 | Orçamento de desempenho (alvo de fps em telemóvel médio, nº máximo de infetados ativos) e medição | Simulação ~0,05 ms/tick [V]; render ainda por medir | P1 | S |
| L6 | Política de versões de gravação: nunca mudar `saveVersion` sem função em `migrations` | Já preparado [V] | P1 | S |

## 4. Plano por fases (sugestão para vários dias)

| Fase | Objetivo | Itens | Resultado visível |
|---|---|---|---|
| **1. Fundação** | Preparar para crescer sem partir nada | L1, L5, L6, A1, F1, J1, B1, C10, I4 | Moodles e painel de skills; testes sempre a correr |
| **2. Corpo e sobrevivência** | Tornar a saúde interessante | A2, A3, B2, B3, B4, B5, E4, I1, I3 | Feridas por parte, sono, roupa com isolamento |
| **3. Mundo e saque** | Explorar é recompensador | D3, D4, D5, C3, C1, C2, C9, E1 | Chaves e portas, saque por divisão, cadáveres, estações |
| **4. Base e crafting** | Construir de verdade | F2, F3, F4, F9, D6, G2 | Estações, menu de construção, cozinha melhor |
| **5. Comida e natureza** | Sustentabilidade a longo prazo | G1, G3, G4, G5, G8, E2 | Culturas sazonais, armadilhas, caça |
| **6. Veículos e armas** | Mobilidade e armamento | H1–H4, C5, C6, C7 | Mala, peças, bombas de gasolina, armas variadas |
| **7. Apresentação** | Beleza e acessibilidade | K1, K2, K4, I6, I7 | Cache de terreno, sprites novos, áudio, pt-PT |
| **8. Longo prazo** | Só se sobrar vontade | D1, D2, D8, G6, F7, F8 | Andares, animais, forja |

## 5. Regras de trabalho para o ChatGPT

1. **Um sistema de cada vez**, com alteração pequena e verificável. Não reescrever ficheiros inteiros.
2. Antes de mudar estado guardado: atualizar `snapshotRun/snapshotZone/restore`; se mudar o esquema, subir `Data.saveVersion` **e** acrescentar `migrations[versaoAntiga]` em `sim.js`.
3. Dados novos (itens, receitas, skills) em `data.js` (ou ficheiros de dados), nunca espalhados na lógica.
4. `Sim` não pode usar DOM. A UI vive em `game.js` e `view.js`.
5. Cada funcionalidade nova: pelo menos um teste no smoke test (ou equivalente) e entrada no registo (secção 7).
6. Ao lançar versão: atualizar `Data.control.version`, o `?v=` do `index.html`, e o README.
7. Se algo for ambíguo, perguntar antes de implementar; não inventar mecânicas que não existem no Zomboid sem o assinalar.

## 6. O que NÃO copiar do Zomboid (fora de âmbito)

- Multijogador, anti-cheat e servidores dedicados.
- Modelos 3D, animações esqueléticas, ragdoll e física realista.
- Mapa real do Kentucky, centenas de edifícios feitos à mão, 1000+ itens.
- Lua/mods do Steam (usar dados e módulos próprios).
- NPCs humanos hostis (o PZ só os planeia para o Build 43; o jogo já tem a Eva como vantagem).
- Mecânicas muito granulares sem retorno em jogabilidade (ex.: peso corporal, tabaco) até as fases 1–5 estarem feitas.

## 7. Registo de progresso (preencher a cada sessão)

| Data | Sessão | Itens concluídos | Testes | Notas / problemas |
|---|---|---|---|---|
| 13 nov 2026 | Análise inicial v0.20 | — | smoke-test 24/24 | Correções da v0.16 mantidas (sirene, Training, causa de morte, teclado, brilhos) |
| 13 nov 2026 | Fase 1 (parte 1) → v0.21 | A1 ✔ (framework de skills até nível 10), A2 ✔ (Fitness e Strength), A3 ◐ (só Sneaking; falta Sprinting/Lightfooted/Nimble), B1 ◐ (estados graduados em texto; faltam ícones), B5 ✔ (sono real) | smoke-test 44/44 | Ver `CHANGELOG.md`. `game.js` só validado com `node --check`; confirmar no browser: etiquetas de estado, painel Skills, botão Sleep. |
| 13 nov 2026 | Bloco v0.22 | C3 ◐ (cadáveres; falta queimar/enterrar), B6 ◐ (doença por cadáveres e frio), A6 ◐ (Cooking/Foraging/Fishing; faltam Trapping/Tracking), C6 ◐ (3 armas) | smoke-test 54/54 | Ver `CHANGELOG.md`. Confirmar no browser o desenho dos cadáveres. |
| 14 nov 2026 | Bloco v0.23 (bugs) | Preso/saída do carro ✔, dano de carro ✔, agarrar (parcial do C4) ✔, UI de telemóvel ✔ | smoke-test 65/65 | Pedir feedback sobre agarrar e botões. |
| 14 nov 2026 | Bloco v0.24 | E1 ◐ (estações; faltam neve/nevoeiro e dia variável), B3 ◐ (fratura de perna + tala), C10 ✔ (anéis de ruído) | smoke-test 78/78 | Equilibrar o frio de inverno (só o raincoat dá proteção) e talas no loot. |
| 14 nov 2026 | Bloco v0.25 | I1 ✔ (7 ranhuras e proteção), E4 ◐ (calor da roupa), cantos ✔, botão Attack ✔ | smoke-test 86/86 | Falta peso/volume de roupa, roupa que molha e rasga. |
| 14 nov 2026 | Bloco v0.26 | D5 ◐ (chaves com dono e portas trancadas), D7 ◐ (nomes), C9 ◐ (portas abertas atraem), compatibilidade de gravações corrigida | smoke-test 99/99 | Mapa maior pendente. Nunca consumir `rng()` na geração sem migração. |
| 14 nov 2026 | Bloco v0.27 | D8 ◐ (geração 4: +28 locais de exploração), aviso de arma gasta ✔ | smoke-test 119/119 | Mapa maior a sério pendente (ver 9.1). |
| 15 nov 2026 | Bloco v0.28 | D8 ◐ (3 regiões novas 64×64, geração 5), D5 ◐ (chaves nas regiões novas), Attack à direita ✔ | smoke-test 140/140 | Pistas de história e eventos nas regiões novas; Cold Vale maior continua por fazer. |
| 16 nov 2026 | Bloco v0.29 | K1 ✔ (cache do chão e minimapa), L5 ◐ (orçamento de desempenho medido em ops/frame) | smoke-test 140/140; render-test OK | Medir num browser real; cache de telhados/paredes. |
| | | | | |

## 8. Fontes consultadas sobre o Project Zomboid (Build 42)

- Notícia oficial do lançamento (29 jul 2026) em gamedeveloper.com: "Project Zomboid – Build 42 Out Now".
- Resumos do Build 42 estável 42.20 (allthings.how; supercraft.host wiki "Build 42 news" e "Build 42 features"; logicservers.com; gameluster.com): mapa mais do que duplicado, caves e arranha-céus, iluminação nova, animais e culturas sazonais, pesca reformulada, armas e mira novas, construção 3D, multijogador oficial; 42.21 estável a 28 set 2026; saves do Build 41 incompatíveis.
- Skills do Build 42: pzfans.com/skills e pzfans.com/ProjectZomboidB42Skills; calculadora de XP em xgamingserver.com; guias em bamboogaming.net e build42guide.wiki (cerca de 35–36 skills, 11 novas: Carving, Masonry, Pottery, Knapping, Blacksmithing, Welding, Glassmaking, Agriculture, Animal Care, Butchering, Tracking).
- Crafting do Build 42: pzfans.com (guia "B42 Crafting Overhaul").
- Blog oficial: projectzomboid.com/blog (artigos sobre iluminação e disciplinas de crafting).
- Nota: os números exatos (skills, itens) variam entre fontes e versões; confirmar na wiki oficial antes de fixar valores no jogo.

## 9. Ideias da comunidade e dos mods mais usados (pesquisa de 14 nov 2026)

Fontes: guias de mods do Build 42 (mobalytics.gg, hosthavoc.com, zap-hosting.com, itechguides.com, namehero.com, gamersdecide.com) e o conhecimento geral do jogo. Os nomes dos mods mudam e os números de subscritores variam; confirmar na Steam Workshop antes de os citar.

**Padrões que se repetem nos mods mais populares → o que o jogo deve ter**

| Tema (mod de referência) | Ideia para o Last CloneZ | Estado | Prio |
|---|---|---|---|
| Interface limpa e compacta (CleanUI, Bigger Character Avatar) | Painéis compactos no telemóvel; ícones nos estados | ◐ (barra de pesquisa e botões feitos na 0.23) | P1 |
| Ordenar e encontrar itens (Better Sorting, Inventory Tetris) | Ordenar por categoria/peso, "arrumar tudo", pesquisa | ◐ (já há pesquisa e ordenação) | P2 |
| Marcar livros/revistas como lidos (Has Been Read) | Marcar notas e livros lidos; não repetir | ✘ | P2 |
| Interações lógicas (Common Sense) | Fechar portas atrás de ti, abrir latas com ferramenta, comer sem menus extra, avisos úteis | ✘ | P1 |
| Durabilidade das armas visível | Aviso antes de a arma partir | ◐ (condição existe; falta aviso a 20 %) | P1 |
| Recuperar skills depois de morrer (Skill Recovery Journal) | Diário do sobrevivente: novo jogo herda ~50 % do XP | ✘ | P1 |
| Traços e ocupações (Simple Overhaul: Traits and Occupations) | Criação de personagem com traços e pontos | ✘ | P2 |
| Veículos detalhados com peças e mala (KI5) | Mala, peças, vários modelos | ✘ | P2 |
| Armas e armaduras (Brita's Weapon Pack / Armor) | Mais armas de fogo com munições e proteção | ◐ (3 armas brancas novas; roupa de proteção) | P2 |
| Áudio e rádio (True Music) | Rádio com música e notícias do mundo | ✘ | P3 |
| Crafting alargado (Hydrocraft e afins) | Muito mais receitas e estações | ✘ | P1 |
| Eventos do mundo | Sirenes, helicópteros, hordas migratórias | ◐ | P2 |

**Queixas frequentes da comunidade (recorrentes em guias e fóruns)**

- Início aborrecido e demasiado lento: acrescentar eventos e objetivos curtos nos primeiros dias.
- Procurar contentores é repetitivo: tabelas de saque por divisão e "revistar tudo" com um toque.
- Chaves confusas: saber a que casa pertence cada chave (ver v0.26).
- Zumbis vistos através de paredes ou a "teletransportar-se": manter visão e ruído coerentes com paredes (já há linha de visão).
- Mapa pequeno ou repetitivo: mais regiões, pontos de interesse únicos e história (ver v0.26).
- Controlos de toque pouco ergonómicos: botões grandes e bem posicionados (0.23 e 0.25).

### 9.1 Plano para um mapa realmente maior (itens 1–3 feitos na v0.28; 4 por fazer)

1. **Regiões de segundo nível** como a gruta: 3 novas regiões de ~64×64 ligadas às exteriores (ex.: pedreira a partir de Ironworks, represa a partir de Westfields, farol a partir de Bracken Coast). Cada uma precisa de: entrada em `Regions.definitions` (`entrance`/`arrival`), função de superfície, 3–5 edifícios com saque, 1–2 pistas em `chronicle.js`, densidade em `world.js` (`areaDensity`) e símbolos no mapa.
2. **Generalizar as ligações:** trocar o hub-and-spoke de `addExits`/`connection` por uma tabela de ligações `{a, b, exitA, arrivalA, exitB, arrivalB, vehicles}` (a gruta já é um caso especial).
3. **Só para a geração 5**, para não mexer em gravações antigas (regra: nunca consumir `rng()` partilhado na geração existente).
4. **Cold Vale maior:** exige deslocar todas as coordenadas fixas do `LegacyLevel`; alternativa é acrescentar uma "periferia" como região própria ligada pela estrada.
