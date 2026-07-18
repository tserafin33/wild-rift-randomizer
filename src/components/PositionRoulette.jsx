import { useState, useRef, useEffect, useCallback } from 'react'

const POSITIONS = [
  { id: 'top', name: 'Top', color: '#FF1744', icon: '🗡️' },
  { id: 'jungle', name: 'Jungle', color: '#39FF14', icon: '🌿' },
  { id: 'mid', name: 'Mid', color: '#FFD700', icon: '⚡' },
  { id: 'adc', name: 'ADC', color: '#9C27B0', icon: '🏹' },
  { id: 'support', name: 'Support', color: '#2979FF', icon: '💚' }
]

const SLOT_HEIGHT = 80
const VISIBLE_ROWS = 3
const STRIP_LENGTH = 20

function SlotMachine({ isSpinning, finalPosition, onSpinEnd }) {
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
      newStrip.push(POSITIONS[Math.floor(Math.random() * POSITIONS.length)])
    }
    newStrip.push(finalPosition)
    newStrip.push(POSITIONS[Math.floor(Math.random() * POSITIONS.length)])
    setStrip(newStrip)

    const totalDuration = 2000
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
  }, [isSpinning, finalPosition])

  if (phase === 'idle') return null

  return (
    <div className="relative mx-auto" style={{ width: '120px', height: `${SLOT_HEIGHT * VISIBLE_ROWS}px`, overflow: 'hidden' }}>
      <div
        className="absolute left-0 right-0 flex flex-col items-center"
        style={{
          transform: `translateY(${-scrollY}px)`,
          transition: phase === 'landed' ? 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)' : 'none',
        }}
      >
        {strip.map((pos, idx) => {
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
              key={`${pos.id}-${idx}`}
              className="flex items-center justify-center flex-shrink-0"
              style={{
                height: `${SLOT_HEIGHT}px`,
                opacity,
                transform: `scale(${scale})`,
                transition: 'opacity 0.12s, transform 0.12s',
              }}
            >
              <div
                className="flex flex-col items-center justify-center rounded-xl"
                style={{
                  width: '100px',
                  height: '64px',
                  border: isCenter || (isFinal && phase !== 'spinning') ? `2px solid ${pos.color}` : '1px solid rgba(255,255,255,0.1)',
                  boxShadow: isCenter || (isFinal && phase !== 'spinning') ? `0 0 20px ${pos.color}40` : 'none',
                  background: `${pos.color}10`,
                }}
              >
                <span className="text-2xl">{pos.icon}</span>
                <span className="text-xs font-black mt-0.5" style={{ color: pos.color }}>{pos.name}</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="absolute top-0 left-0 right-0 pointer-events-none z-10"
        style={{ height: `${SLOT_HEIGHT}px`, background: 'linear-gradient(to bottom, #0E0E0E 0%, transparent 100%)' }} />
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-10"
        style={{ height: `${SLOT_HEIGHT}px`, background: 'linear-gradient(to top, #0E0E0E 0%, transparent 100%)' }} />
      <div className="absolute left-0 right-0 pointer-events-none z-10"
        style={{ top: `${SLOT_HEIGHT}px`, height: '2px', background: finalPosition?.color || '#FFD700', boxShadow: `0 0 10px ${finalPosition?.color || '#FFD700'}60` }} />
      <div className="absolute left-0 right-0 pointer-events-none z-10"
        style={{ top: `${SLOT_HEIGHT * 2}px`, height: '2px', background: finalPosition?.color || '#FFD700', boxShadow: `0 0 10px ${finalPosition?.color || '#FFD700'}60` }} />
    </div>
  )
}

export default function PositionRoulette({ players, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [usedIds, setUsedIds] = useState([])
  const [assignments, setAssignments] = useState({})
  const [isSpinning, setIsSpinning] = useState(false)
  const [finalPosition, setFinalPosition] = useState(null)
  const [spinResult, setSpinResult] = useState(null)
  const [confirmed, setConfirmed] = useState(Array(players.length).fill(false))
  const [playerPositions, setPlayerPositions] = useState(Array(players.length).fill(null))
  const [autoAssigned, setAutoAssigned] = useState(false)

  const getAvailablePositions = useCallback(() => {
    return POSITIONS.filter(p => !usedIds.includes(p.id))
  }, [usedIds])

  const spinSlot = useCallback(() => {
    if (isSpinning) return
    const available = getAvailablePositions()
    const randomPos = available[Math.floor(Math.random() * available.length)]
    setFinalPosition(randomPos)
    setIsSpinning(true)
    setSpinResult(null)
  }, [isSpinning, getAvailablePositions])

  const handleSpinEnd = useCallback(() => {
    setIsSpinning(false)
    setSpinResult(finalPosition)
    setPlayerPositions(prev => {
      const next = [...prev]
      next[currentIndex] = finalPosition
      return next
    })
  }, [finalPosition, currentIndex])

  const confirmPosition = () => {
    const playerName = players[currentIndex]
    const position = playerPositions[currentIndex]
    const newAssignments = { ...assignments, [playerName]: position }
    const newUsedIds = [...usedIds, position.id]

    setAssignments(newAssignments)
    setUsedIds(newUsedIds)
    setConfirmed(prev => {
      const next = [...prev]
      next[currentIndex] = true
      return next
    })
    setSpinResult(null)

    if (currentIndex < players.length - 1) {
      const nextIdx = currentIndex + 1
      const remaining = POSITIONS.filter(p => !newUsedIds.includes(p.id))

      if (remaining.length === 1) {
        const lastPlayer = players[nextIdx]
        const lastPos = remaining[0]
        const finalAssignments = { ...newAssignments, [lastPlayer]: lastPos }
        setAssignments(finalAssignments)
        setPlayerPositions(prev => {
          const next = [...prev]
          next[nextIdx] = lastPos
          return next
        })
        setConfirmed(prev => {
          const next = [...prev]
          next[nextIdx] = true
          return next
        })
        setAutoAssigned(true)
        setTimeout(() => {
          onComplete(finalAssignments)
        }, 1200)
      } else {
        setCurrentIndex(nextIdx)
      }
    } else {
      onComplete(newAssignments)
    }
  }

  const currentPlayerName = players[currentIndex]
  const currentConfirmed = confirmed[currentIndex]
  const currentPos = playerPositions[currentIndex]
  const posColor = currentPos?.color || '#888'

  return (
    <div className="max-w-lg mx-auto animate-scale-in">
      <div className="glass-strong rounded-[var(--radius-xl)] p-4 sm:p-8">
        <h2 className="text-2xl font-black text-white mb-2 text-center tracking-tight">Ruleta de Posiciones</h2>
        <p className="text-center mb-6 font-bold" style={{ color: spinResult?.color || posColor || '#888' }}>
          {autoAssigned ? (
            <>Posicion restante para: <span className="text-white">{players[currentIndex]}</span></>
          ) : (
            <>Turno de: <span className="text-white">{currentPlayerName}</span></>
          )}
        </p>

        {/* Slot machine / result */}
        <div className="flex justify-center mb-6">
          {isSpinning ? (
            <SlotMachine
              isSpinning={true}
              finalPosition={finalPosition}
              onSpinEnd={handleSpinEnd}
            />
          ) : spinResult && !currentConfirmed ? (
            <div className="animate-result-reveal text-center">
              <div
                className="rounded-[var(--radius-xl)] p-5 inline-block"
                style={{
                  background: 'rgba(26, 26, 26, 0.9)',
                  border: `2px solid ${spinResult.color}50`,
                  boxShadow: `0 0 25px ${spinResult.color}15, inset 0 1px 0 rgba(255,255,255,0.05)`,
                  backdropFilter: 'blur(12px)',
                }}
              >
                <div className="flex items-center justify-center gap-3 mb-3">
                  <span className="text-4xl">{spinResult.icon}</span>
                  <span className="text-3xl font-black" style={{ color: spinResult.color, textShadow: `0 0 15px ${spinResult.color}66` }}>
                    {spinResult.name}
                  </span>
                </div>
                <button
                  onClick={confirmPosition}
                  className="btn-primary btn-shimmer px-8 py-3 rounded-xl font-black text-sm tracking-wide min-h-[44px]"
                >
                  {currentIndex < players.length - 1 ? 'SIGUIENTE JUGADOR' : 'CONTINUAR'}
                </button>
              </div>
            </div>
          ) : autoAssigned ? (
            <div className="animate-result-reveal text-center">
              <div
                className="rounded-[var(--radius-xl)] p-5 inline-block"
                style={{
                  background: 'rgba(26, 26, 26, 0.9)',
                  border: `2px solid ${players[currentIndex] ? getAvailablePositions()[0]?.color || '#888' : '#888'}50`,
                }}
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="text-4xl">{getAvailablePositions()[0]?.icon}</span>
                  <span className="text-3xl font-black" style={{ color: getAvailablePositions()[0]?.color }}>
                    {getAvailablePositions()[0]?.name}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mt-2 font-bold">Asignada automaticamente</p>
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

        {/* Player progress cards */}
        <div className="grid gap-2 mb-4" style={{ gridTemplateColumns: `repeat(${Math.min(players.length, 5)}, minmax(0, 1fr))` }}>
          {players.map((player, index) => {
            const isDone = confirmed[index]
            const isActive = index === currentIndex
            const pos = playerPositions[index]

            return (
              <div
                key={player}
                className="rounded-xl p-2 text-center transition-all duration-300"
                style={{
                  background: isActive ? `${pos?.color || '#888'}10` : 'rgba(14,14,14,0.5)',
                  border: `2px solid ${isActive ? (pos?.color || '#888') + '50' : isDone ? (pos?.color || '#888') + '25' : 'rgba(255,255,255,0.05)'}`,
                }}
              >
                <p className="text-white font-bold text-[10px] truncate mb-1">{player}</p>
                {pos ? (
                  <div className="flex flex-col items-center">
                    <span className="text-xl">{pos.icon}</span>
                    <span className="text-[9px] font-black" style={{ color: pos.color }}>{pos.name}</span>
                  </div>
                ) : (
                  <div className="w-10 h-10 mx-auto rounded-lg flex items-center justify-center" style={{ background: '#0E0E0E' }}>
                    <span className="text-lg opacity-20">🎰</span>
                  </div>
                )}
                {isDone && (
                  <span className="text-[9px] font-black" style={{ color: pos?.color || '#888' }}>LISTO</span>
                )}
              </div>
            )
          })}
        </div>

        {/* Progress */}
        <div className="pt-4 border-t border-white/5">
          <div className="flex justify-center gap-2" role="list" aria-label="Progreso">
            {players.map((player, index) => {
              const pColor = playerPositions[index]?.color || '#888'
              return (
                <div
                  key={player}
                  role="listitem"
                  className="px-3 py-1 rounded-lg text-xs font-bold transition-colors duration-200"
                  style={{
                    background: index < currentIndex || (autoAssigned && index === players.length - 1) ? `${pColor}20` : index === currentIndex ? `${pColor}12` : '#1A1A1A',
                    color: index < currentIndex || (autoAssigned && index === players.length - 1) ? pColor : index === currentIndex ? 'white' : '#555',
                    border: `1px solid ${index < currentIndex || (autoAssigned && index === players.length - 1) ? pColor + '30' : index === currentIndex ? pColor + '40' : 'rgba(255,255,255,0.05)'}`,
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
