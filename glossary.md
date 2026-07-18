# Project Glossary

| Term | Definition | Location |
|------|------------|----------|
| Randomizer | App que genera builds aleatorias de Wild Rift para jugadores | App principal |
| Build | Conjunto de items + runas + hechizos asignados a un jugador | BuildPhase.jsx, ResultCards.jsx |
| Phase | Una de las 5 etapas del flujo: players, positions, champions, build, results | App.jsx |
| Assignments | Objeto que almacena toda la data asignada por jugador: `{ playerName: { position, champion, items, runes, spells } }` | App.jsx |
| PositionRoulette | Ruleta SVG que asigna posiciones (Top, Jungle, Mid, ADC, Support) | PositionRoulette.jsx |
| ChampionSlots | Slot machine que asigna campeones sin repetir entre jugadores | ChampionSlots.jsx |
| Data Dragon | CDN de Riot Games con imagenes de campeones, items, runas, hechizos | data/*.json |
| Keystone | Runa principal (la mas poderosa) | runes.json > keystones |
| Minor Runes | Runas secundarias (3 por build) | runes.json > minorRunes |
| Segment Angle | Angulo de cada seccion en la ruleta (360 / numero de posiciones) | PositionRoulette.jsx |
| easeOutCubic | Funcion de easing que desacelera al final: `1 - (1-t)^3` | PositionRoulette.jsx |
| ease-out-expo | `cubic-bezier(0.19, 1, 0.22, 1)` - entrada rapida, desaceleracion suave | index.css |
| ease-spring | `cubic-bezier(0.34, 1.56, 0.64, 1)` - efecto resorte sutil | index.css |
| Auto-assign | Asignacion automatica de la ultima posicion restante al ultimo jugador | PositionRoulette.jsx |
| design-system | Skill que establece paletas, tipografia, layout, componentes | C:\Users\mario\Desktop\IA\skills\design-system |
| animation-engine | Skill de motion design, spring physics, micro-interacciones | C:\Users\mario\Desktop\IA\skills\animation-engine |
| web-design-guidelines | Skill de revision UI contra estandares de calidad (a11y, perf) | C:\Users\mario\Desktop\IA\skills\web-design-guidelines |
| write-style | Skill de control de estilo, elimina AI sounds, optimiza tokens | C:\Users\mario\Desktop\IA\skills\write-style |
| napkin | Memoria persistente de errores y preferencias del usuario | C:\Users\mario\Desktop\IA\skills\napkin |
| omega | Orquestador maestro que coordina todas las skills | C:\Users\mario\Desktop\IA\skills\omega |
| Glassmorphism | Efecto visual con backdrop-blur, transparencia y bordes sutiles | index.css (.glass, .glass-strong) |
| Slot Machine | Animacion de strip vertical que scrollea y se detiene en el centro | ChampionSlots.jsx |
| Neon glow | Efecto de sombra/brillo con color en textos y bordes | index.css (.neon-blue, .neon-red) |
| Vivid colors | Colores saturados y brillantes para estetica gaming | PositionRoulette.jsx POSITIONS |
| Keystone | Runa principal con mayor jerarquia visual (size xl, centrada) | BuildPhase.jsx |
| Position color | Color asignado a cada rol: Top rojo, Jungle verde, Mid amarillo, ADC morado, Support azul | Todos los componentes |
