# Last CloneZ field expansion

## Como experimentar

Na raiz do repositório, corre `npm run build` e serve `dist/`. Em alternativa, abre `dist/single.html` no Chromium. O guia em inglês está em [Start here](START-HERE.md). O ZIP estático inclui os recursos locais, `index.html` e `single.html`.

## Conteúdo e sistemas

O catálogo inclui as 40 entradas e 80 variantes do anexo. A colocação usa um sorteio por local, um gerador separado e uma passagem de validação com um raio de 0,28 tiles. Os novos objetos são pequenos e não sólidos. A revisão de conteúdo permite acrescentá-los a saves anteriores mantendo as coordenadas, a população, as portas e o loot originais. As novas rotas seguem a malha existente.

- Dave tem três notas encadeadas. O encontro no cinema é ficcional. Os terminais integram a história dos dois amigos e da IA. Byte pode ser recolhido como recordação opcional.
- As cenas colocadas implementam leitura em contexto, registo no diário e, onde adequado, recompensa de uso único. O catálogo mantém entradas para áreas sem equivalente, incluindo escola, casino, apartamento e oficinas especializadas. As entradas que pedem um subsistema adicional ainda não têm a resolução interativa do anexo.
- Espécie e contaminação são independentes. O jogo guarda o estado ao colher, a identificação pelo progresso ou guia, o aviso de quatro segundos e o intervalo global de 120 segundos. Avisos expirados fora da região são consumidos. A atração só atribui um destino a infetados existentes com percurso aberto. Uma mancha colhida não volta a alertar.
- Os Pantrycaps identificados podem ser preparados na fogueira. A receita exige Pantrycaps, madeira e identificação. Bitterfold provoca doença e não entra na receita. A pesca tem reserva e recuperação por local.
- O novo spear talhado exige faca em bom estado, madeira e bancada. O nível altera a condição inicial. Novos dados são texto, regras e desenhos em pixels do próprio projeto. Não foram importados assets de terceiros.

## Matriz de competências

Os identificadores entre parênteses são os usados pelo save. Carpentry, Aiming, First Aid e Agriculture reutilizam IDs históricos. A validação indica o que foi exercitado explicitamente nesta entrega ou já tem cobertura na suite. As linhas pendentes correspondem a ciclos ainda sem implementação.

| Competência | Prática e efeito | Validação |
| --- | --- | --- |
| 01 Fitness | Correr em movimento. Menor consumo e maior recuperação de resistência. | XP e comparação de níveis |
| 02 Strength | Lutar corpo a corpo. Aumenta carga e dano. | Comparação de capacidade |
| 03 Running | Percorrer distância a correr. Reduz consumo de resistência. | XP e níveis comparados |
| 04 Lightfooted | Deslocar-se perto de infetados. Reduz raio de ruído dos passos. | XP e níveis comparados |
| 05 Nimble | Reposicionar-se furtivamente perto de um infetado visível. Melhora a velocidade nessa postura. | XP e níveis comparados |
| 06 Axe | Acertar com machado ou machadinha. Reduz recuperação nessa família. | XP e níveis comparados |
| 07 Long Blunt | Acertar com taco, tubo ou equivalente. Reduz recuperação. | XP e níveis comparados |
| 08 Short Blunt | Acertar com ferramenta contundente curta. Reduz recuperação. | XP e níveis comparados |
| 09 Long Blade | Acertar com machete. Reduz recuperação. | XP e níveis comparados |
| 10 Short Blade | Acertar com faca. Reduz recuperação. | XP e níveis comparados |
| 11 Spear | Acertar com lança ou arma de estocada. Reduz recuperação. | XP e níveis comparados |
| 12 Sneaking | Deslocar-se furtivamente perto de ameaça. Reduz ruído e alcance visual de deteção. | XP e comparação de ruído |
| 13 Maintenance | Usar arma sob desgaste ou repará-la com materiais. Reduz desgaste e melhora reparação. | XP e desgaste a níveis comparados |
| 14 Aiming (marksmanship) | Disparar com munição. Melhora precisão. | XP, munição e precisão testados |
| 15 Reloading | Falta estado de carregador e ação de recarga separada. | Pendente |
| 16 Carpentry (crafting) | Construir e reforçar aberturas. Melhora reparação e resistência da barricada. | Construção e reparação na suite |
| 17 Cooking | Recolher lotes de fogueira. Reduz tempo de preparação. | Fogueira e recolha na suite |
| 18 First Aid (medical) | Tratar feridas ou aplicar tala. Acelera recuperação de fratura. | Tratamento na suite |
| 19 Electrical | Reparar o rádio com peças. Aumenta autonomia do gerador. | XP e autonomia comparados, prática repetível pendente |
| 20 Welding | Falta equipamento de soldadura e reparação de metal. | Pendente |
| 21 Mechanics | Reparar um veículo avariado com materiais. Aumenta condição restaurada. | XP e níveis comparados |
| 22 Tailoring | Remendar roupa danificada. Aumenta condição restaurada. | XP e condição restaurada comparados |
| 23 Blacksmithing | Faltam forja e peças combináveis. | Pendente |
| 24 Carving | Talhar lança na bancada com faca e madeira. Melhora condição inicial. | Ferramenta, custo, XP e níveis comparados |
| 25 Knapping | Falta lascagem com pedra e saída utilizável. | Pendente |
| 26 Glassmaking | Faltam posto quente e recipientes funcionais. | Pendente |
| 27 Masonry | Falta construção mineral própria. | Pendente |
| 28 Pottery | Faltam argila, forno e recipientes funcionais. | Pendente |
| 29 Agriculture (gardening) | Cultivar e colher. Melhora rendimento sem eliminar tempo de crescimento. | Cultura e colheita na suite |
| 30 Animal Care | Faltam animais, alimentação, hidratação e produção. | Pendente |
| 31 Butchering | Faltam carcaças animais válidas e processamento. | Pendente |
| 32 Fishing | Pescar com equipamento e isco. Nível reduz espera. O local tem stock finito e recuperação. | Captura, XP, stock, isco, gravação e níveis comparados |
| 33 Trapping | Faltam armadilhas com isco e fauna disponível. | Pendente |
| 34 Foraging | Recolher recursos e cogumelos. Aumenta rendimento e permite identificar espécies. | XP de colheita e identificação testados |
| 35 Tracking | Faltam rastos persistentes de fauna ou passagem. | Pendente |

## Validação e amostragem

A auditoria de cinco seeds por 15 regiões encontrou 132 notas e 166 manchas, das quais 24 colonizadas e 17 ativas. Confirmou 16 IDs de cena colocados na amostra, spawns em posições livres e saídas com percurso, e nenhuma nova colocação no tile inicial de um infetado. Entre notas de regiões com mais de uma, a mediana do caminho até à nota mais próxima foi de 21 tiles, cerca de 8 segundos à velocidade base de caminhada, sem combate ou desvios.

Foram observadas as cenas F25, F27–F30, F34–F37, F40, R02, R05, R10, R18, R23 e R24. O catálogo completo continua disponível ao sistema de seleção. A presença destas cenas na amostra não comprova a resolução interativa específica de cada uma.

O conteúdo estático de `game/` passou de 1 401 691 para aproximadamente 1 434 000 bytes, cerca de +32,6 KB sem compressão. O catálogo ocupa 10 674 bytes. Os restantes cerca de 22 KB são implementação e ligação ao jogo. O build inclui um HTML autónomo com recursos incorporados.

O teste de integração cobre cinco seeds, posição inicial, percurso para objetos novos, gravação, recompensas únicas, toxicidade, pausa, intervalo global e infetados separados por obstáculos. A compatibilidade usa gravações produzidas pelo código v0.33. O teste de browser exercita a entrada Recommended, interação tátil, pausa, som, progresso gravado e Continue. Uma passagem tátil também confirmou a inspeção de uma mancha ativa, a colheita guardada e a leitura de uma nota sem abrir um painel. O HTML autónomo iniciou uma partida num contexto offline, com o documento servido pelo próprio teste e zero pedidos externos. A política deste Chromium impediu o teste direto com `file://`.

Medições exploratórias com Chromium headless em Linux, viewport de 1440 × 900 e perfil emulado de Pixel 7. Cada amostra seguiu o mesmo início, zoom e entrada durante 2,4 segundos. O p95 é do intervalo entre frames, e os valores de memória são instantâneos do heap JS, sem sincronizar o coletor. O emulador usa o computador anfitrião.

| Ambiente | FPS mediano antes → depois | p95 antes → depois | DOM pronto | Heap JS |
| --- | --- | --- | --- | --- |
| Desktop | 59,9 → 59,9 | 16,8 → 16,8 ms | 582 → 496 ms | 11,7 → 13,6 MB |
| Pixel 7 emulado | 59,9 → 59,9 | 16,7 → 16,7 ms | 427 → 549 ms | 11,7 → 13,5 MB |

As amostras são curtas. Uma passagem anterior com outros checks a correr chegou a 33,3 ms de p95 na emulação móvel. Na passagem final, a seed 17 passou de 370 para 384 objetos e manteve 65 infetados. O desempenho em telefone físico continua por medir. Verificar todos os interiores, densidade por quarteirão e balancear a economia das cenas continua pendente.
