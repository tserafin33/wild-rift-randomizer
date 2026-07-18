# Persistent Memory - Errors & Preferences

## Known Errors to Avoid
- [2026-07-18] useEffect with stale state → Never use useEffect for auto-assign when state depends on async setState. Use the confirming function directly.
- [2026-07-18] Roulette angle formula: use `324 - index * 72`, NOT `index * 72 + 36`
- [2026-07-18] Config changes require opencode restart - skills.paths not loaded in running session
- [2026-07-18] updateAssignments with flat merge overwrites nested data → Use deep merge when adding champion/build to player: `{ ...prev[player], champion: data }`
- [2026-07-18] Wild Rift rune images not on PC Data Dragon → Use RuneIcon component with color fallback on onError
- [2026-07-18] Multiple items sharing same Data Dragon ID → Ensure unique IDs, especially for Wild Rift items mapped to PC equivalents
- [2026-07-18] isActive variable only defined inside .map() scope → Don't reference it outside the callback
- [2026-07-18] Wild Rift runes different from PC LoL → Use wildriftfire.com for Wild Rift-specific rune images, not PC Data Dragon
- [2026-07-18] BuildPhase only gave basic boots → Always include boots + enchantment + (support if support) + fill with combat items
- [2026-07-18] Builds with random items ignoring roles → Items MUST be role-appropriate: ADC→physical, Mago→magic, Tanque→defense, Luchador→physical+defense, Asesino→physical, Apoyo→support+defense
- [2026-07-18] Boots slot had enchantment boots → Slot 1 = basic boots ONLY (tier 1), Slot 2 = enchantment (separate)
- [2026-07-18] Support item on non-support → Support item EXCLUSIVE to Support position, mandatory
- [2026-07-18] Smite on non-jungle → Jungle ALWAYS gets Smite, other positions NEVER
- [2026-07-18] Dynamic Tailwind class `grid-cols-${cols}` → Tailwind v4 JIT can't detect dynamic classes. Use inline style `gridTemplateColumns: \`repeat(${cols}, minmax(0, 1fr))\`` instead
- [2026-07-18] `transition: all` wastes GPU cycles → animation-engine says only animate what changes (colors, opacity, transform)
- [2026-07-18] Fixed SVG size overflows mobile → Use `viewBox` + `w-full max-w-[300px]` for responsive SVGs

## User Preferences
- Always use omega + skills workflow for every iteration
- UI in Spanish
- Images from Riot Data Dragon
- Wants roulette result to match what pointer shows
- Auto-assign last position (no spin needed)
- Champion names and positions must show in results
- Rune images must have fallback when URLs are broken
- Item images should be unique per item
- User DOES NOT like green color for completed states in PlayerSelector - use monotone gray
- User DOES NOT want "Equipo Azul/Rojo" or "VS" text anywhere in the UI
- Position colors must be VIVID: Top #FF1744, Jungle #39FF14, Mid #FFD700, ADC #9C27B0, Support #2979FF
- Slot machine animation must be VERTICAL STRIP scroll with gradient fade, not just random image swap
- Keystone rune should have MORE HIERARCHY than minor runes (centered, larger)
- Roulette spin should be FAST (2s max)
- App must work on MOBILE (touch targets, responsive, no overflow)

- Support ALWAYS gets a support item — mandatory, no other position can have support items
- Jungle ALWAYS gets Smite (Aplastar) exclusive; other positions NEVER get Smite
- Builds must be ROLE-APPROPRIATE: Mage→AP items, ADC→crit/AD, Tank→HP/armor, etc. No random garbage
- Boots must be tier 2 UPGRADED (Mercury's, Berserker's, etc.), NOT basic tier 1
- Slot 2 must be an enchantment (Zhonya's/Stasis, Protobelt, etc.) — active ability boots upgrade
- Wild Rift build = boots + enchantment + (support if support) + combat items = 6 slots total

## Corrections Received
- [2026-07-18] Roulette showed wrong position despite pointer → Fix angle formula
- [2026-07-18] Roulette froze on phase transition → Remove useEffect, use direct logic in confirmPosition
- [2026-07-18] "use omega for everything" → Register skills in opencode.json, restart required
- [2026-07-18] Champion images broken (Wukong, Kai'Sa) → Update Data Dragon version to 16.14.1, fix IDs
- [2026-07-18] Colors too dark/muted → User wants vivid neon colors for positions
- [2026-07-18] Green completed state in PlayerSelector → User wants monotone gray
- [2026-07-18] "Equipo Azul/Rojo" text unwanted → Remove all team labels from UI
- [2026-07-18] Slot machine selecting wrong champion → Scroll target must be `(finalIdx - 1) * SLOT_HEIGHT` not `finalIdx * SLOT_HEIGHT`, viewport center is at SLOT_HEIGHT not 0
- [2026-07-18] Champion selection too chaotic on mobile → Show ONE player at a time with large display, not 5 simultaneous slot machines
- [2026-07-18] Runes overflowing containers → Add overflow-hidden + min-w-0 on flex containers
- [2026-07-18] Basic boots appearing in builds → Remove tier 1 boots entirely, only upgraded tier 2 boots
