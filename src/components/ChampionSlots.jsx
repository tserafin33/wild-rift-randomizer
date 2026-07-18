import { useState, useRef, useEffect, useCallback } from 'react'
import championsData from '../data/champions.json'

const POSITIONS = {
  'Top': { color: '#FF1744' },
  'Jungle': { color: '#39FF14' },
  'Mid': { color: '#FFD700' },
  'ADC': { color: '#9C27B0' },
  'Support': { color: '#2979FF' }
}

const SLOT_HEIGHT = 80
const VISIBLE_ROWS = 3
const STRIP_LENGTH = 30

function SlotMachine({ isSpinning, finalChampion, posColor, onSpinEnd }) {
  const [phase, setPhase] = useState('idle')
  const [scrollY, setScrollY] = useState(0)
  const [strip, setStrip] = useState([])
  const rafRef = useRef(null)
  const startTimeRef = useRef(null)

  useEffect(() => {
    if (!isSpinning) {
      setPhase('idle')
      setScrollY(0)
      setStrip([])
      return
    }

    const finalIdx = STRIP_LENGTH - 2
    const newStrip = []
    for (let i = 0; i < finalIdx; i++) {
      newStrip.push(championsData[Math.floor(Math.random() * championsData.length)])
    }
    newStrip.push(finalChampion)
    newStrip.push(championsData[Math.floor(Math.random() * championsData.length)])
    setStrip(newStrip)

    const totalDuration = 2200
    startTimeRef.current = performance.now()
    setPhase('spinning')

    const animate = (timestamp) => {
      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / totalDuration, 1)
      const eased = 1 - Math.pow(1 - progress, 2)
      const maxScroll = (finalIdx - 1) * SLOT_HEIGHT
      setScrollY(eased * maxScroll)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        setPhase('landed')
        setTimeout(() => {
          setPhase('done')
          onSpinEnd()
        }, 350)
      }
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [isSpinning, finalChampion])

  if (phase === 'idle') return null

  return (
    <div className="relative mx-auto" style={{ width: '100px', height: `${SLOT_HEIGHT * VISIBLE_ROWS}px`, overflow: 'hidden' }}>
      <div
        className="absolute left-0 right-0 flex flex-col items-center"
        style={{
          transform: `translateY(${-scrollY}px)`,
          transition: phase === 'landed' ? 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)' : 'none',
        }}
      >
        {strip.map((champ, idx) => {
          const finalIdx = STRIP_LENGTH - 2
          const isFinal = idx === finalIdx
          const centerIdx = Math.round(scrollY / SLOT_HEIGHT)
          const distFromCenter = Math.abs(idx - centerIdx)
          const isCenter = distFromCenter === 0

          let opacity, scale
          if (phase === 'done') {
            opacity = isFinal ? 1 : 0
            scale = isFinal ? 1.1 : 0.5
          } else if (phase === 'landed') {
            opacity = isFinal ? 1 : distFromCenter <= 1 ? 0.3 : 0.1
            scale = isFinal ? 1 : distFromCenter === 1 ? 0.8 : 0.6
          } else {
            opacity = distFromCenter === 0 ? 1 : distFromCenter === 1 ? 0.4 : distFromCenter === 2 ? 0.15 : 0
            scale = distFromCenter === 0 ? 1 : distFromCenter === 1 ? 0.85 : 0.7
          }

          return (
            <div
              key={`${champ.id}-${idx}`}
              className="flex items-center justify-center flex-shrink-0"
              style={{
                height: `${SLOT_HEIGHT}px`,
                opacity,
                transform: `scale(${scale})`,
                transition: 'opacity 0.12s, transform 0.12s',
              }}
            >
              <img
                src={champ.image}
                alt={champ.name_es}
                className="w-16 h-16 rounded-xl"
                style={{
                  border: isCenter || (isFinal && phase !== 'spinning') ? `2px solid ${posColor}` : '1px solid rgba(255,255,255,0.1)',
                  boxShadow: isCenter || (isFinal && phase !== 'spinning') ? `0 0 20px ${posColor}40` : 'none',
                }}
                loading="lazy"
                onError={(e) => {
                  e.target.src = `https://ddragon.leagueoflegends.com/cdn/16.14.1/img/champion/${champ.id}.png`
                }}
              />
            </div>
          )
        })}
      </div>

      <div className="absolute top-0 left-0 right-0 pointer-events-none z-10"
        style={{ height: `${SLOT_HEIGHT}px`, background: 'linear-gradient(to bottom, #0E0E0E 0%, transparent 100%)' }} />
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-10"
        style={{ height: `${SLOT_HEIGHT}px`, background: 'linear-gradient(to top, #0E0E0E 0%, transparent 100%)' }} />
      <div className="absolute left-0 right-0 pointer-events-none z-10"
        style={{ top: `${SLOT_HEIGHT}px`, height: '2px', background: posColor, boxShadow: `0 0 10px ${posColor}60` }} />
      <div className="absolute left-0 right-0 pointer-events-none z-10"
        style={{ top: `${SLOT_HEIGHT * 2}px`, height: '2px', background: posColor, boxShadow: `0 0 10px ${posColor}60` }} />
    </div>
  )
}

export default function ChampionSlots({ players, onComplete, assignments }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [championAssignments, setChampionAssignments] = useState({})
  const [usedChampions, setUsedChampions] = useState(new Set())
  const [isSpinning, setIsSpinning] = useState(false)
  const [finalChampion, setFinalChampion] = useState(null)
  const [spinResult, setSpinResult] = useState(null)
  const [confirmed, setConfirmed] = useState(Array(players.length).fill(false))
  const [playerChampions, setPlayerChampions] = useState(Array(players.length).fill(null))

  const playerPositions = players.map(p => assignments?.[p]?.position || 'Mid')

  const getAvailableChampions = useCallback(() => {
    return championsData.filter(c => !usedChampions.has(c.id))
  }, [usedChampions])

  const spinSlot = useCallback(() => {
    if (isSpinning) return
    const available = getAvailableChampions()
    const randomChampion = available[Math.floor(Math.random() * available.length)]
    setFinalChampion(randomChampion)
    setIsSpinning(true)
    setSpinResult(null)
  }, [isSpinning, getAvailableChampions])

  const handleSpinEnd = useCallback(() => {
    setIsSpinning(false)
    setSpinResult(finalChampion)
    setPlayerChampions(prev => {
      const next = [...prev]
      next[currentIndex] = finalChampion
      return next
    })
  }, [finalChampion, currentIndex])

  const confirmChampion = () => {
    const playerName = players[currentIndex]
    const champion = playerChampions[currentIndex]
    const newAssignments = { ...championAssignments, [playerName]: champion }
    const newUsedChampions = new Set(usedChampions)
    newUsedChampions.add(champion.id)

    setChampionAssignments(newAssignments)
    setUsedChampions(newUsedChampions)
    setConfirmed(prev => {
      const next = [...prev]
      next[currentIndex] = true
      return next
    })
    setSpinResult(null)

    if (currentIndex < players.length - 1) {
      setCurrentIndex(prev => prev + 1)
    } else {
      onComplete(newAssignments)
    }
  }

  const posColor = POSITIONS[playerPositions[currentIndex]]?.color || '#2979FF'
  const currentPlayerName = players[currentIndex]
  const currentConfirmed = confirmed[currentIndex]
  const currentChamp = playerChampions[currentIndex]

  return (
    <div className="max-w-lg mx-auto animate-scale-in">
      <div className="glass-strong rounded-[var(--radius-xl)] p-4 sm:p-8">
        <h2 className="text-2xl font-black text-white mb-2 text-center tracking-tight">Elige tu Campeon</h2>
        <p className="text-center mb-6 font-bold" style={{ color: posColor }}>
          Turno de: <span className="text-white">{currentPlayerName}</span>
        </p>

        {/* Current player - LARGE slot machine / result */}
        <div className="flex justify-center mb-6">
          {isSpinning ? (
            <SlotMachine
              isSpinning={true}
              finalChampion={finalChampion}
              posColor={posColor}
              onSpinEnd={handleSpinEnd}
            />
          ) : spinResult && !currentConfirmed ? (
            <div className="animate-result-reveal text-center">
              <div
                className="rounded-[var(--radius-xl)] p-5 inline-block"
                style={{
                  background: 'rgba(26, 26, 26, 0.9)',
                  border: `2px solid ${posColor}50`,
                  boxShadow: `0 0 25px ${posColor}15, inset 0 1px 0 rgba(255,255,255,0.05)`,
                  backdropFilter: 'blur(12px)',
                }}
              >
                <div className="flex items-center justify-center gap-4 mb-3">
                  <img
                    src={spinResult.image}
                    alt={spinResult.name_es}
                    className="w-24 h-24 rounded-xl"
                    style={{
                      border: `2px solid ${posColor}60`,
                      boxShadow: `0 0 20px ${posColor}30`,
                    }}
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = `https://ddragon.leagueoflegends.com/cdn/16.14.1/img/champion/${spinResult.id}.png`
                    }}
                  />
                  <div className="text-left">
                    <div className="text-2xl font-black text-white">{spinResult.name_es}</div>
                    <div className="text-sm font-bold" style={{ color: posColor }}>{spinResult.roles_es.join(' / ')}</div>
                  </div>
                </div>
                <button
                  onClick={confirmChampion}
                  className="btn-primary btn-shimmer px-8 py-3 rounded-xl font-black text-sm tracking-wide min-h-[44px]"
                >
                  {currentIndex < players.length - 1 ? 'SIGUIENTE JUGADOR' : 'CONTINUAR AL BUILD'}
                </button>
              </div>
            </div>
          ) : !currentConfirmed ? (
            <button
              onClick={spinSlot}
              className="btn-primary btn-shimmer px-10 py-4 rounded-xl font-black text-lg tracking-wide min-h-[52px]"
            >
              GIRAR
            </button>
          ) : null}
        </div>

        {/* Player progress cards - compact, shows completed champions */}
        <div className="grid gap-2 mb-4" style={{ gridTemplateColumns: `repeat(${Math.min(players.length, 5)}, minmax(0, 1fr))` }}>
          {players.map((player, index) => {
            const isDone = confirmed[index]
            const isActive = index === currentIndex
            const pcColor = POSITIONS[playerPositions[index]]?.color || '#888'
            const champ = playerChampions[index]

            return (
              <div
                key={player}
                className="rounded-xl p-2 text-center transition-all duration-300"
                style={{
                  background: isActive ? `${pcColor}10` : 'rgba(14,14,14,0.5)',
                  border: `2px solid ${isActive ? pcColor + '50' : isDone ? pcColor + '25' : 'rgba(255,255,255,0.05)'}`,
                  boxShadow: isActive ? `0 0 15px ${pcColor}10` : 'none',
                }}
              >
                <p className="text-white font-bold text-[10px] truncate mb-1">{player}</p>
                {champ ? (
                  <img
                    src={champ.image}
                    alt={champ.name_es}
                    className="w-10 h-10 mx-auto rounded-lg mb-1"
                    style={{ border: `2px solid ${pcColor}40` }}
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = `https://ddragon.leagueoflegends.com/cdn/16.14.1/img/champion/${champ.id}.png`
                    }}
                  />
                ) : (
                  <div className="w-10 h-10 mx-auto rounded-lg mb-1 flex items-center justify-center" style={{ background: '#0E0E0E' }}>
                    <span className="text-lg opacity-20">🎰</span>
                  </div>
                )}
                {isDone && (
                  <span className="text-[9px] font-black" style={{ color: pcColor }}>LISTO</span>
                )}
              </div>
            )
          })}
        </div>

        {/* Full progress bar */}
        <div className="pt-4 border-t border-white/5">
          <div className="flex justify-center gap-2" role="list" aria-label="Progreso">
            {players.map((player, index) => {
              const pColor = POSITIONS[playerPositions[index]]?.color || '#888'
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
