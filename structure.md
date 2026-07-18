# Project Structure

## Architecture
SPA React con 5 fases: jugadores → posiciones → campeones → build → resultados. Cada fase es un componente independiente. App.jsx controla el flujo con state `phase`. Datos en JSON, imagenes via CDN de Riot.

## Directory Layout
```
randomizer/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── opencode.json                    # Config de omega skills
├── src/
│   ├── main.jsx                     # Entry point
│   ├── App.jsx                      # Controller principal (phase routing)
│   ├── index.css                    # CSS variables, animations, design tokens
│   ├── components/
│   │   ├── PlayerSelector.jsx       # Fase 1: seleccionar cantidad + nombres
│   │   ├── PositionRoulette.jsx     # Fase 2: ruleta SVG con 5 secciones
│   │   ├── ChampionSlots.jsx        # Fase 3: slot machine por jugador
│   │   ├── BuildPhase.jsx           # Fase 4: items, runas, hechizos
│   │   └── ResultCards.jsx          # Fase 5: tarjetas con build completo
│   └── data/
│       ├── champions.json           # 139 campeones Wild Rift
│       ├── items.json               # 114 items por categoria
│       ├── runes.json               # 15 keystones + 47 minor runes
│       └── spells.json              # 7 hechizos de invocador
├── context.md                       # Historial de sesiones
├── project.md                       # Contexto del proyecto
├── structure.md                     # Este archivo
├── problems.md                      # Bugs y soluciones
├── decisions.md                     # Decisiones de diseno
├── glossary.md                      # Terminos del proyecto
├── tasks.md                         # Tareas pendientes
├── napkin.md                        # Memoria persistente
└── README.md
```

## Technologies
| Tecnologia | Version | Uso |
|------------|---------|-----|
| Vite | 8.x | Build tool, dev server |
| React | 19.x | UI framework |
| Tailwind CSS | 4.x | Styling |
| JavaScript | ES2022+ | Lenguaje (no TypeScript) |
| Data Dragon CDN | 14.12.1 | Imagenes de items, runas, hechizos |

## Component Flow
```
PlayerSelector → PositionRoulette → ChampionSlots → BuildPhase → ResultCards
     │                │                  │              │            │
  players[]      assignments{}      assignments{}   assignments{}  onComplete
  (names)        (+ positions)      (+ champions)   (+ builds)    (restart)
```

## Data Flow
- App.jsx mantiene `assignments` como state centralizado
- Cada fase agrega su parte al objeto assignments
- ResultCards recibe el assignments completo para mostrar todo
