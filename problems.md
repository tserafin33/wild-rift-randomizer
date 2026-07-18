# Known Problems

## Roulette pointer didn't match result
- **Status:** Resuelto
- **Causa:** Formula de angulo era `index * 72 + 36` (medio segmento de mas)
- **Solucion:** Cambiar a `324 - index * 72` para alinear centro de seccion con flecha
- **Prevenir:** Verificar geometria SVG antes de implementar rotacion

## Roulette sections disappeared when positions removed
- **Status:** Resuelto
- **Causa:** Se re-dibujaban solo las posiciones disponibles, rompiendo la geometria
- **Solucion:** Siempre dibujar las 5 posiciones, atenuar las usadas (opacity 0.25)
- **Prevenir:** Nunca cambiar el numero de secciones de la ruleta

## useEffect infinite loop on phase transition
- **Status:** Resuelto
- **Causa:** useEffect de auto-asignacion tenia `usedIds.length` en dependencies, que cambia en cada render, causando loop infinito
- **Solucion:** Eliminar useEffect, mover logica a `confirmPosition` donde se tiene acceso a valores actuales
- **Prevenir:** Nunca usar useEffect con valores de state que cambian frecuentemente como dependencias

## useEffect used stale state (async setState)
- **Status:** Resuelto
- **Causa:** `usedIds.length` en useEffect leia el valor viejo del state (React setState es async)
- **Solucion:** Calcular todo en la funcion `confirmPosition` usando closures
- **Prevenir:** Cuando necesites el valor actual de state en una accion, no uses useEffect - usa la funcion que initia la accion

## Champion data not showing in results
- **Status:** Resuelto
- **Causa:** ChampionSlots pasaba `name_es` (string) en vez del objeto completo
- **Solucion:** Pass `{ playerName: championObject }` en vez de `{ playerName: "name" }`
- **Prevenir:** Verificar que los datos que pasan entre componentes tengan la estructura que el componente receptor espera

## Spell images not loading
- **Status:** Resuelto (por usuario)
- **Causa:** URLs en spells.json incorrectas
- **Solucion:** Usuario actualizo spells.json externamente
- **Prevenir:** Verificar URLs de Data Dragon antes de usar

## Skills not loading in opencode
- **Status:** Resuelto
- **Causa:** skills.paths no estaba en opencode.json al iniciar sesion
- **Solucion:** Agregar skills.paths y reiniciar opencode
- **Prevenir:** La config se carga una vez al inicio, cualquier cambio requiere restart

## Champions no aparecen en resultados
- **Status:** Resuelto
- **Causa:** `updateAssignments` hace merge plano, sobreescribe el objeto jugador (position se pierde con champion)
- **Solucion:** `handleChampionsComplete` y `handleBuildComplete` ahora mergean de forma profunda: `{ ...prev[player], champion: data }`
- **Prevenir:** Cuando se agrega data anidada a un objeto existente, usar spread del objeto padre: `{ ...existing, newProp: value }`

## Runas no muestran imagenes
- **Status:** Resuelto
- **Causa:** Wild Rift runes usan URLs de PC LoL Data Dragon que no existen
- **Solucion:** Crear componente RuneIcon con fallback a cuadro de color con inicial del nombre en onError
- **Prevenir:** Wild Rift y PC LoL comparten mecánicas pero no URLs de assets. Usar fallbacks para assets cross-platform

## Items con imagenes duplicadas
- **Status:** Resuelto
- **Causa:** Multiples items Wild Rift mapeados al mismo ID de PC LoL (ej. 3089 para Rabadon e Infinity Orb)
- **Solucion:** Asignar IDs unicos a cada item, priorizando que al menos muestren imagenes diferentes
- **Prevenir:** Verificar unicidad de IDs de imagen en la base de datos

## Champion images broken (Data Dragon version)
- **Status:** Resuelto
- **Causa:** Data Dragon version 14.12.1 desactualizada, algunas imagenes no existian
- **Solucion:** Actualizar a version 16.14.1, corregir IDs (Wukong→monkeyking, Kai'Sa→Kaisa, K'Sante→ksante)
- **Prevenir:** Siempre usar la ultima version de Data Dragon

## Colors too dark/muted
- **Status:** Resuelto
- **Causa:** Colores de posicion eran oscuros apagados (#890202, #4B5C71)
- **Solucion:** Cambiar a colores vivid neón (#FF1744, #9C27B0, #FFD700, etc.)
- **Prevenir:** Preguntar al usuario si prefiere vivid o muted antes de aplicar colores

## Green completed state unwanted
- **Status:** Resuelto
- **Causa:** PlayerSelector usaba verde para estado completado
- **Solucion:** Cambiar a gris monotono
- **Prevenir:** El usuario no gusta del verde para feedback en PlayerSelector

## Equipo Azul/Rojo text unwanted
- **Status:** Resuelto
- **Causa:** Se habia agregado texto de equipo al header
- **Solucion:** Eliminar todo texto de equipo/VS
- **Prevenir:** No agregar etiquetas de equipo a menos que se pida
