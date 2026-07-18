import { useState, useCallback } from 'react'
import itemsData from '../data/items.json'
import runesData from '../data/runes.json'
import spellsData from '../data/spells.json'
import RuneIcon from './RuneIcon'

const POSITIONS = {
  'Top': { color: '#FF1744' },
  'Jungle': { color: '#39FF14' },
  'Mid': { color: '#FFD700' },
  'ADC': { color: '#9C27B0' },
  'Support': { color: '#2979FF' }
}

const ROLE_ITEM_POOLS = {
  'Tirador': ['physical'],
  'Mago': ['magic'],
  'Tanque': ['defense'],
  'Luchador': ['physical', 'defense'],
  'Asesino': ['physical'],
  'Apoyo': ['support', 'defense'],
}

function getItemsForChampion(champion) {
  const roles = champion.roles_es || []
  const categories = new Set()
  roles.forEach(role => {
    const pools = ROLE_ITEM_POOLS[role] || ['physical']
    pools.forEach(p => categories.add(p))
  })
  if (categories.size === 0) categories.add('physical')
  return categories
}

function shuffleArray(arr) {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function BuildPhase({ players, assignments, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [buildAssignments, setBuildAssignments] = useState({})
  const [showResult, setShowResult] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const currentPlayer = players[currentIndex]
  const playerPosition = assignments[currentPlayer]?.position
  const playerChampion = assignments[currentPlayer]?.champion
  const posColor = POSITIONS[playerPosition]?.color || '#2979FF'
  const isSupport = playerPosition === 'Support'
  const isJungle = playerPosition === 'Jungle'

  const generateRandomBuild = useCallback(() => {
    const usedIds = new Set()
    const boots = []
    const combat = []

    // 1. Boots: upgraded tier 2 boots only (all remaining boots are tier 2)
    const availableBoots = itemsData.boots
    const randomBoots = availableBoots[Math.floor(Math.random() * availableBoots.length)]
    boots.push(randomBoots)
    usedIds.add(randomBoots.id)

    // 2. Enchantment (Zhonya's, Protobelt, etc.)
    const enchants = itemsData.enchant || []
    const randomEnchant = enchants[Math.floor(Math.random() * enchants.length)]
    boots.push(randomEnchant)
    usedIds.add(randomEnchant.id)

    // 3. Support item: mandatory for support
    if (isSupport) {
      const supportItems = itemsData.support || []
      const randomSupport = supportItems[Math.floor(Math.random() * supportItems.length)]
      combat.push(randomSupport)
      usedIds.add(randomSupport.id)
    }

    // 4. Combat items based on champion roles
    const allowedCategories = playerChampion ? getItemsForChampion(playerChampion) : new Set(['physical'])
    const combatItems = []
    const bannedCategories = new Set(['boots', 'enchant', 'support'])
    allowedCategories.forEach(cat => {
      const pool = itemsData[cat] || []
      pool.forEach(item => {
        if (!usedIds.has(item.id) && !bannedCategories.has(item.category)) {
          combatItems.push(item)
        }
      })
    })

    // Shuffle and fill remaining combat slots (5 total for non-support, 4 for support)
    const shuffled = shuffleArray(combatItems)
    const maxCombat = isSupport ? 4 : 5
    let idx = 0
    while (combat.length < maxCombat && idx < shuffled.length) {
      combat.push(shuffled[idx])
      usedIds.add(shuffled[idx].id)
      idx++
    }

    return { boots, combat }
  }, [isSupport, playerChampion])

  const generateRandomRunes = useCallback(() => {
    const usedRunes = []
    const runes = { keystone: null, minor: [] }

    const keystones = runesData.keystones || []
    const randomKeystone = keystones[Math.floor(Math.random() * keystones.length)]
    runes.keystone = randomKeystone
    usedRunes.push(randomKeystone.id)

    const minorRunes = runesData.minorRunes || []
    const runesByPath = {}
    minorRunes.forEach(rune => {
      if (!runesByPath[rune.path]) runesByPath[rune.path] = []
      runesByPath[rune.path].push(rune)
    })

    const paths = Object.keys(runesByPath)
    for (let i = 0; i < 3 && i < paths.length; i++) {
      const pathRunes = runesByPath[paths[i]].filter(r => !usedRunes.includes(r.id))
      if (pathRunes.length > 0) {
        const randomRune = pathRunes[Math.floor(Math.random() * pathRunes.length)]
        runes.minor.push(randomRune)
        usedRunes.push(randomRune.id)
      }
    }

    return runes
  }, [])

  const generateRandomSpells = useCallback(() => {
    const spells = spellsData || []
    const smite = spells.find(s => s.id === 'smite')

    if (isJungle && smite) {
      const others = spells.filter(s => s.id !== 'smite')
      const shuffled = shuffleArray(others)
      return [smite, shuffled[0]]
    }

    const nonSmite = spells.filter(s => s.id !== 'smite')
    const shuffled = shuffleArray(nonSmite)
    return shuffled.slice(0, 2)
  }, [isJungle])

  const generateFullBuild = useCallback(() => {
    setIsGenerating(true)

    setTimeout(() => {
      const { boots, combat } = generateRandomBuild()
      const runes = generateRandomRunes()
      const spells = generateRandomSpells()

      setBuildAssignments(prev => ({
        ...prev,
        [currentPlayer]: { boots, combat, runes, spells }
      }))

      setShowResult(true)
      setIsGenerating(false)
    }, 800)
  }, [currentPlayer, generateRandomBuild, generateRandomRunes, generateRandomSpells])

  const confirmBuild = () => {
    setShowResult(false)

    if (currentIndex < players.length - 1) {
      setCurrentIndex(prev => prev + 1)
    } else {
      onComplete(buildAssignments)
    }
  }

  const currentBuild = buildAssignments[currentPlayer]

  const boxStyle = {
    background: 'rgba(26, 26, 26, 0.7)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.06)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 4px 16px rgba(0,0,0,0.3)',
  }

  const innerBoxStyle = {
    background: 'rgba(14, 14, 14, 0.8)',
    border: '1px solid rgba(255,255,255,0.04)',
  }

  const renderItems = (items, cols = 2) => (
    <div className="grid gap-2 animate-blur-in overflow-hidden" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
      {items.map((item, idx) => (
        <div key={idx} className="text-center min-w-0">
          <img
            src={item.image}
            alt={item.name_es}
            className="w-11 h-11 mx-auto rounded-lg"
            style={{ border: '1px solid rgba(255,255,255,0.08)' }}
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://ddragon.leagueoflegends.com/cdn/16.14.1/img/item/1001.png'
            }}
          />
          <p className="text-[10px] text-gray-500 mt-1 truncate font-medium min-w-0">{item.name_es}</p>
        </div>
      ))}
    </div>
  )

  const renderLoader = () => (
    <div className="text-center py-6">
      <div className="text-3xl mb-2 animate-spin">🎰</div>
      <div className="text-sm font-bold" style={{ color: posColor }}>Generando...</div>
    </div>
  )

  const renderEmpty = () => (
    <div className="text-center text-gray-600 py-6">
      <div className="text-3xl mb-2 opacity-20">🎰</div>
      <div className="text-xs font-bold">Pulsa para generar</div>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto animate-scale-in">
      <div className="glass-strong rounded-[var(--radius-xl)] p-4 sm:p-8">
        <h2 className="text-2xl font-black text-white mb-2 text-center tracking-tight">Build de {currentPlayer}</h2>
        <p className="text-center mb-6 font-bold" style={{ color: posColor }}>
          Posicion: <span className="text-white">{playerPosition}</span>
          {playerChampion && <span className="text-gray-500 ml-2">· {playerChampion.name_es}</span>}
        </p>

        {/* Items: Boots+Enchant | Combat | Runes | Spells */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mb-6 sm:mb-8 stagger-children">
          {/* Boots + Enchantment */}
          <div className="rounded-xl p-3" style={boxStyle}>
            <h3 className="text-white font-black mb-2 text-center text-[10px] sm:text-xs tracking-wide">BOTAS + ENCANT.</h3>
            <div className="rounded-lg p-3 min-h-[140px]" style={innerBoxStyle}>
              {isGenerating ? renderLoader() : showResult && currentBuild?.boots ? renderItems(currentBuild.boots, 2) : renderEmpty()}
            </div>
          </div>

          {/* Combat Items */}
          <div className="rounded-xl p-3" style={boxStyle}>
            <h3 className="text-white font-black mb-2 text-center text-[10px] sm:text-xs tracking-wide">ITEMS</h3>
            <div className="rounded-lg p-3 min-h-[140px]" style={innerBoxStyle}>
              {isGenerating ? renderLoader() : showResult && currentBuild?.combat ? renderItems(currentBuild.combat, 2) : renderEmpty()}
            </div>
          </div>

          {/* Runes */}
          <div className="rounded-xl p-3" style={boxStyle}>
            <h3 className="text-white font-black mb-2 text-center text-[10px] sm:text-xs tracking-wide">RUNAS</h3>
                <div className="rounded-lg p-3 min-h-[140px] overflow-hidden" style={innerBoxStyle}>
                  {isGenerating ? renderLoader() : showResult && currentBuild?.runes ? (
                    <div className="animate-blur-in flex flex-col items-center overflow-hidden">
                      <div className="text-center mb-2">
                        <RuneIcon rune={currentBuild.runes.keystone} size="lg" />
                        <p className="text-[10px] font-black mt-1 truncate max-w-[80px]" style={{ color: posColor }}>
                          {currentBuild.runes.keystone.name_es}
                        </p>
                      </div>
                      <div className="flex gap-2 items-center min-w-0">
                        {currentBuild.runes.minor.map((rune, idx) => (
                          <div key={idx} className="flex flex-col items-center gap-0.5 min-w-0">
                            <RuneIcon rune={rune} size="sm" />
                            <p className="text-[8px] text-gray-500 truncate font-medium w-[50px] text-center">{rune.name_es}</p>
                          </div>
                        ))}
                      </div>
                    </div>
              ) : renderEmpty()}
            </div>
          </div>

          {/* Spells */}
          <div className="rounded-xl p-3" style={boxStyle}>
            <h3 className="text-white font-black mb-2 text-center text-[10px] sm:text-xs tracking-wide">HECHIZOS</h3>
            <div className="rounded-lg p-3 min-h-[140px]" style={innerBoxStyle}>
              {isGenerating ? renderLoader() : showResult && currentBuild?.spells ? (
                <div className="grid grid-cols-2 gap-2 animate-blur-in">
                  {currentBuild.spells.map((spell, idx) => (
                    <div key={idx} className="text-center">
                      <img
                        src={spell.image}
                        alt={spell.name_es}
                        className="w-12 h-12 mx-auto rounded-lg"
                        style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                        loading="lazy"
                      />
                      <p className="text-[10px] text-white font-bold mt-1">{spell.name_es}</p>
                    </div>
                  ))}
                </div>
              ) : renderEmpty()}
            </div>
          </div>
        </div>

        {/* Generate button */}
        {!showResult && !isGenerating && (
          <div className="text-center">
            <button
              onClick={generateFullBuild}
              className="btn-success btn-shimmer px-8 py-4 rounded-xl font-black text-sm tracking-wide min-h-[52px]"
            >
              GENERAR BUILD COMPLETO
            </button>
          </div>
        )}

        {/* Generating indicator */}
        {isGenerating && (
          <div className="text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-3 px-6 py-3 glass rounded-[var(--radius-lg)]">
              <div className="w-4 h-4 border-2 border-[var(--color-yellow)] border-t-transparent rounded-full animate-spin" />
              <span className="font-bold text-sm text-[var(--color-yellow)]">Generando build...</span>
            </div>
          </div>
        )}

        {/* Result and confirm */}
        {showResult && (
          <div className="text-center animate-result-reveal">
            <button
              onClick={confirmBuild}
              className="btn-primary btn-shimmer px-8 py-4 rounded-xl font-black text-sm tracking-wide min-h-[52px]"
            >
              {currentIndex < players.length - 1 ? 'SIGUIENTE JUGADOR' : 'VER RESULTADOS'}
            </button>
          </div>
        )}

        {/* Progress */}
        <div className="mt-6 pt-4 border-t border-white/5">
          <div className="flex justify-center gap-2" role="list" aria-label="Progreso">
            {players.map((player, index) => {
              const pColor = POSITIONS[assignments[player]?.position]?.color || '#888'
              return (
                <div
                  key={player}
                  role="listitem"
                  className="px-3 py-1 rounded-lg text-xs font-bold transition-colors duration-200"
                  style={{
                    background: index < currentIndex ? `${pColor}20` : index === currentIndex ? `${pColor}12` : '#1A1A1A',
                    color: index < currentIndex ? pColor : index === currentIndex ? 'white' : '#555',
                    border: `1px solid ${index < currentIndex ? pColor + '30' : index === currentIndex ? pColor + '40' : 'rgba(255,255,255,0.05)'}`,
                  }}
                >
                  {player}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
