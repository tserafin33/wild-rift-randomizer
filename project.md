# Project Context

## Overview
Wild Rift Randomizer - app web que genera builds aleatorias de retos para 1-5 jugadores. Cada jugador recibe: posicion, campeon, items, runas y hechizos, todo aleatorio.

## Objectives
- [x] Sistema de seleccion aleatoria de campeones
- [x] Generacion de builds aleatorias (items, runas, hechizos)
- [x] Interfaz amigable en espanol
- [x] Visual redesign: vivid neon gaming aesthetic
- [x] Slot machine animation for champion selection
- [x] Fix all broken champion images (Data Dragon 16.14.1)
- [ ] Validacion de combinaciones validas
- [ ] Sistema de puntuacion/dificultad
- [ ] Modos de juego (reto, ranked, etc.)
- [x] Despliegue en hosting gratuito (Vercel)

## Tech Stack
- **Framework:** Vite + React 19
- **Styling:** Tailwind CSS v4
- **Lenguaje:** JavaScript (no TypeScript)
- **Data:** JSON files con URLs de Riot Data Dragon v16.14.1
- **Host:** Pendiente (hosting gratuito)

## Design System
- CSS custom properties para colores, radius, easings
- Dark theme (background: #282828, surface: #1E1E1E)
- Primary: blue (#023E8A)
- Secondary: red (#890202)
- Glassmorphism: .glass, .glass-strong, .glass-blue/red/green etc.
- Animaciones: ease-out-expo, ease-spring, ease-decel

## Position Colors (VIVID)
- Top: #FF1744 (rojo vibrante)
- Jungle: #39FF14 (verde radioactivo)
- Mid: #FFD700 (amarillo oro)
- ADC: #9C27B0 (morado vibrante)
- Support: #2979FF (azul brillante)

## Workflow
- Omega methodology para todas las sesiones
- Skills: design-system, animation-engine, web-design-guidelines, write-style, napkin
- Documentacion obligatoria: context.md, problems.md, decisions.md, napkin.md

## Status
- Created: 2026-07-18
- Last Updated: 2026-07-18
- Phase: Ready for deployment
