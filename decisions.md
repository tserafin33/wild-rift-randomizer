# Design & Business Decisions

## 2026-07-18 - Estructura de bases de datos
**Decision:** Crear 4 archivos JSON separados para items, campeones, runas y hechizos.
**Por que:** Modularidad, escalabilidad, mantenimiento independiente por categoria.
**Alternativas descartadas:** Un solo archivo JSON (demasiado grande), SQL (innecesario).

## 2026-07-18 - Stack tecnologico
**Decision:** Vite + React + Tailwind CSS v4, JavaScript sin TypeScript.
**Por que:** Velocidad de desarrollo, Tailwind v4 para CSS moderno, sin overhead de types para un proyecto pequeño.
**Alternativas descartadas:** Next.js (SSR innecesario), TypeScript (complejidad extra no justificada).

## 2026-07-18 - Imagenes via Data Dragon CDN
**Decision:** URLs de `ddragon.leagueoflegends.com` para todas las imagenes.
**Por que:** Imagenes actualizadas automaticamente por Riot, sin necesidad de hosting propio.
**Alternativas descartadas:** Imagenes locales (requieren actualizacion manual).

## 2026-07-18 - Idioma espanol
**Decision:** Toda la UI y datos en espanol, identificadores en ingles.
**Por que:** Audiencia hispanohablante. Identificadores en ingles para compatibilidad con Data Dragon.

## 2026-07-18 - Ruleta siempre con 5 secciones
**Decision:** Dibujar las 5 posiciones siempre, atenuar las ya asignadas.
**Por que:** Mantiene la geometria consistente. La rotacion funciona igual siempre. Visualmente se ve que posiciones quedan.
**Alternativa descartada:** Redibujar con menos secciones (rompia la geometria y el angulo de rotacion).

## 2026-07-18 - Auto-asignar ultima posicion
**Decision:** Cuando queda 1 posicion, asignarla automaticamente al ultimo jugador sin girar.
**Por que:** No tiene sentido girar cuando solo hay 1 opcion. Ahorra tiempo.
**Implementacion:** En `confirmPosition`, despues de asignar, verificar si `remaining.length === 1` y asignar directamente.

## 2026-07-18 - CSS custom properties para design tokens
**Decision:** Usar CSS variables (--color-surface, --radius-xl, --ease-spring, etc.) en vez de Tailwind arbitrary values.
**Por que:** Consistencia, facil de cambiar tema, legible. Segun design-system skill.

## 2026-07-18 - Animaciones con requestAnimationFrame
**Decision:** Roulette y slot machine usan rAF con easing functions custom, no CSS animations.
**Por que:** Control preciso del timing, desaceleracion natural, sync con frame rate del browser.
**Alternativa descartada:** CSS @keyframes (menos control sobre la curva de desaceleracion).

## 2026-07-18 - Touch targets minimos 44px
**Decision:** Todos los botones tienen `min-h-[44px]` o `min-h-[48px]`.
**Por que:** web-design-guidelines lo requiere para accesibilidad en mobile.

## 2026-07-18 - Omega methodology
**Decision:** Usar omega + skills para todas las sesiones.
**Por que:** Prevenir errores repetidos, documentar decisiones, mantener contexto entre sesiones.

## 2026-07-18 - Vivid neon position colors
**Decision:** Colores vivid neón para posiciones en vez de oscuros apagados.
**Por que:** Estetica gamer agresiva, conecta con la tematica de Wild Rift.
**Colores:** Top #FF1744, Jungle #39FF14, Mid #FFD700, ADC #9C27B0, Support #2979FF.

## 2026-07-18 - Data Dragon version
**Decision:** Actualizar de 14.12.1 a 16.14.1.
**Por que:** Version antigua causaba imagenes rotas (Wukong, Kai'Sa, K'Sante).
**Prevenir:** Siempre usar la ultima version de Data Dragon.

## 2026-07-18 - No team labels in UI
**Decision:** Eliminar todo texto "Equipo Azul/Rojo" y "VS" de la interfaz.
**Por que:** El usuario no quiere etiquetas de equipo, solo colores visuales.
**Prevenir:** No agregar texto de equipo/VS a menos que se pida explicitamente.

## 2026-07-18 - Monotone completed state
**Decision:** Estado completado en PlayerSelector en gris monotono, no verde.
**Por que:** El usuario no gusta del verde para estados completados en esta pantalla.
**Prevenir:** Usar gris/neutral para feedback de completado a menos que se pida color.

## 2026-07-18 - Vertical strip slot machine
**Decision:** Slot machine con strip vertical que scrollea, no solo intercambio de imagenes.
**Por que:** El usuario quiere animacion real de tragamonedas con gradiente fade.
**Implementacion:** Strip de 5 campeones, scroll vertical, gradient fade arriba/abajo, lineas de color en centro.

## 2026-07-18 - Keystone rune hierarchy
**Decision:** Keystone rune con mayor jerarquia (centrada, grande) vs runas menores (pequeñas, secundarias).
**Por que:** El usuario quiere que la runa principal tenga mas protagonismo.
**Implementacion:** Tamaño xl para keystone, centrada, badge de color. Runas menores size sm debajo.
