import { useState, useRef, useCallback, useEffect } from 'react'

const POSITIONS = [
  { id: 'top', name: 'Top', color: '#FF1744', bg: '#1C1C1C', icon: '🗡️' },
  { id: 'jungle', name: 'Jungle', color: '#39FF14', bg: '#1C1C1C', icon: '🌿' },
  { id: 'mid', name: 'Mid', color: '#FFD700', bg: '#1C1C1C', icon: '⚡' },
  { id: 'adc', name: 'ADC', color: '#9C27B0', bg: '#1C1C1C', icon: '🏹' },
  { id: 'support', name: 'Support', color: '#2979FF', bg: '#1C1C1C', icon: '💚' }
]

const SEGMENT_ANGLE = 360 / POSITIONS.length

function createSlicePath(startAngle, endAngle, radius) {
  const startRad = (startAngle - 90) * (Math.PI / 180)
  const endRad = (endAngle - 90) * (Math.PI / 180)
  const x1 = 150 + radius * Math.cos(startRad)
  const y1 = 150 + radius * Math.sin(startRad)
  const x2 = 150 + radius * Math.cos(endRad)
  const y2 = 150 + radius * Math.sin(endRad)
  const largeArc = endAngle - startAngle > 180 ? 1 : 0
  return `M 150 150 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`
}

function getTextPosition(startAngle, endAngle, radius) {
  const midAngle = ((startAngle + endAngle) / 2 - 90) * (Math.PI / 180)
  return {
    x: 150 + radius * Math.cos(midAngle),
    y: 150 + radius * Math.sin(midAngle),
  }
}

export default function PositionRoulette({ players, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [usedIds, setUsedIds] = useState([])
  const [assignments, setAssignments] = useState({})
  const [isSpinning, setIsSpinning] = useState(false)
  const [winnerId, setWinnerId] = useState(null)
  const [rotation, setRotation] = useState(0)
  const [autoAssignedPos, setAutoAssignedPos] = useState(null)
  const rafRef = useRef(null)

  const availablePositions = POSITIONS.filter(p => !usedIds.includes(p.id))

  const spin = useCallback(() => {
    if (isSpinning || availablePositions.length <= 1) return

    setIsSpinning(true)
    setWinnerId(null)

    const targetPosition = availablePositions[Math.floor(Math.random() * availablePositions.length)]
    const targetIndex = POSITIONS.findIndex(p => p.id === targetPosition.id)

    const baseAngle = 324 - targetIndex * SEGMENT_ANGLE
    const totalSpins = 3 + Math.floor(Math.random() * 2)
    const targetAngle = totalSpins * 360 + baseAngle

    let startTime = null
    const duration = 2000

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeOutCubic(progress)

      setRotation(easedProgress * targetAngle)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        setWinnerId(targetPosition.id)
        setIsSpinning(false)
      }
    }

    rafRef.current = requestAnimationFrame(animate)
  }, [isSpinning, availablePositions])

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const finishWithAllAssigned = (allAssignments) => {
    const finalAssignments = {}
    Object.keys(allAssignments).forEach(player => {
      finalAssignments[player] = allAssignments[player].name
    })
    onComplete(finalAssignments)
  }

  const confirmPosition = () => {
    const winner = POSITIONS.find(p => p.id === winnerId)
    const playerName = players[currentIndex]
    const newAssignments = { ...assignments, [playerName]: winner }
    const newUsedIds = [...usedIds, winnerId]

    setAssignments(newAssignments)
    setUsedIds(newUsedIds)
    setWinnerId(null)
    setRotation(0)

    const nextIndex = currentIndex + 1

    if (nextIndex < players.length) {
      setCurrentIndex(nextIndex)

      const remaining = POSITIONS.filter(p => !newUsedIds.includes(p.id))
      if (remaining.length === 1) {
        const lastPlayer = players[nextIndex]
        const lastPos = remaining[0]
        const finalAssignments = { ...newAssignments, [lastPlayer]: lastPos }
        setAssignments(finalAssignments)
        setAutoAssignedPos(lastPos)

        setTimeout(() => {
          finishWithAllAssigned(finalAssignments)
        }, 1200)
      }
    } else {
      finishWithAllAssigned(newAssignments)
    }
  }

  const winner = winnerId ? POSITIONS.find(p => p.id === winnerId) : null
  const isLastRemaining = availablePositions.length === 1 && !autoAssignedPos && !winnerId && !isSpinning

  return (
    <div className="max-w-lg mx-auto animate-scale-in">
      <div className="glass-strong rounded-[var(--radius-xl)] p-5 sm:p-8">
        <h2 className="text-2xl font-black text-white mb-2 text-center tracking-tight">Ruleta de Posiciones</h2>
        <p className="text-center mb-6 font-bold" style={{ color: winner?.color || '#888' }}>
          {autoAssignedPos ? (
            <>Posicion restante para: <span className="text-white">{players[currentIndex]}</span></>
          ) : isLastRemaining ? (
            <>Ultima posicion para: <span className="text-white">{players[currentIndex]}</span></>
          ) : (
            <>Turno de: <span className="text-white">{players[currentIndex]}</span></>
          )}
        </p>

        {/* Roulette */}
        <div className="flex justify-center mb-6">
          <div className="relative w-full max-w-[300px]" role="img" aria-label="Ruleta de posiciones">
            <svg viewBox="0 0 300 300" className="w-full h-auto drop-shadow-2xl">
              <circle cx="150" cy="150" r="148" fill="#0E0E0E" stroke="#333" strokeWidth="2" />
              <g style={{ transform: `rotate(${rotation}deg)`, transformOrigin: '150px 150px' }}>
                {POSITIONS.map((pos, index) => {
                  const startAngle = index * SEGMENT_ANGLE
                  const endAngle = (index + 1) * SEGMENT_ANGLE
                  const path = createSlicePath(startAngle, endAngle, 138)
                  const textPos = getTextPosition(startAngle, endAngle, 85)
                  const isUsed = usedIds.includes(pos.id)
                  const isWinner = pos.id === winnerId
                  const isAuto = autoAssignedPos?.id === pos.id

                  return (
                    <g key={pos.id}>
                      <path
                        d={path}
                        fill={pos.bg}
                        stroke={isWinner || isAuto ? pos.color : '#2A2A2A'}
                        strokeWidth={isWinner || isAuto ? 3 : 1}
                        opacity={isWinner || isAuto ? 1 : isUsed ? 0.15 : 1}
                        style={{ transition: 'opacity 0.4s ease, stroke-width 0.3s ease' }}
                      />
                      <text
                        x={textPos.x}
                        y={textPos.y - 8}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="26"
                        opacity={isWinner || isAuto ? 1 : isUsed ? 0.1 : 0.8}
                        style={{ pointerEvents: 'none', transition: 'opacity 0.4s ease' }}
                      >
                        {pos.icon}
                      </text>
                      <text
                        x={textPos.x}
                        y={textPos.y + 18}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="12"
                        fontWeight="900"
                        fill={pos.color}
                        opacity={isWinner || isAuto ? 1 : isUsed ? 0.1 : 0.9}
                        style={{ pointerEvents: 'none', transition: 'opacity 0.4s ease', letterSpacing: '0.05em' }}
                      >
                        {pos.name}
                      </text>
                    </g>
                  )
                })}
              </g>
              <circle cx="150" cy="150" r="30" fill="#0E0E0E" stroke="#333" strokeWidth="2" />
              <circle cx="150" cy="150" r="24" fill="#1A1A1A" stroke={winner?.color || '#444'} strokeWidth="2"                     style={{ transition: 'stroke 0.3s ease' }} />
              <text x="150" y="152" textAnchor="middle" dominantBaseline="middle" fontSize="20">🎯</text>
            </svg>

            <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-10">
              <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-[var(--color-yellow)] drop-shadow-lg" />
            </div>
          </div>
        </div>

        {/* Winner display */}
        {winner && (
          <div className="text-center mb-6 animate-result-reveal">
            <div
              className="inline-flex items-center gap-3 px-6 py-4 rounded-[var(--radius-xl)]"
              style={{
                background: `linear-gradient(135deg, ${winner.color}22 0%, ${winner.color}11 100%)`,
                border: `2px solid ${winner.color}66`,
                boxShadow: `0 0 20px ${winner.color}33, inset 0 1px 0 rgba(255,255,255,0.05)`,
              }}
            >
              <span className="text-3xl">{winner.icon}</span>
              <span className="text-2xl font-black" style={{ color: winner.color, textShadow: `0 0 15px ${winner.color}66` }}>
                {winner.name}
              </span>
            </div>
          </div>
        )}

        {/* Auto-assigned display */}
        {autoAssignedPos && (
          <div className="text-center mb-6 animate-result-reveal">
            <div
              className="inline-flex items-center gap-3 px-6 py-4 rounded-[var(--radius-xl)]"
              style={{
                background: `linear-gradient(135deg, ${autoAssignedPos.color}22 0%, ${autoAssignedPos.color}11 100%)`,
                border: `2px solid ${autoAssignedPos.color}66`,
                boxShadow: `0 0 20px ${autoAssignedPos.color}33, inset 0 1px 0 rgba(255,255,255,0.05)`,
              }}
            >
              <span className="text-3xl">{autoAssignedPos.icon}</span>
              <span className="text-2xl font-black" style={{ color: autoAssignedPos.color, textShadow: `0 0 15px ${autoAssignedPos.color}66` }}>
                {autoAssignedPos.name}
              </span>
            </div>
          </div>
        )}

        {/* Position badges - white text, no background, show player name when assigned */}
        <div className="flex justify-center gap-4 mb-6 flex-wrap" role="list" aria-label="Posiciones disponibles">
          {POSITIONS.map(pos => {
            const isUsed = usedIds.includes(pos.id)
            const isAuto = autoAssignedPos?.id === pos.id
            const assignedPlayer = Object.keys(assignments).find(player => assignments[player]?.id === pos.id)
            const isAssigned = isUsed || isAuto

            return (
              <div key={pos.id} className="text-center" role="listitem">
                <div
                  className="text-xs font-black tracking-wide transition-colors duration-300"
                  style={{
                    color: isAssigned ? pos.color : 'white',
                  }}
                >
                  {pos.icon} {pos.name}
                </div>
                {isAssigned && assignedPlayer && (
                  <div
                    className="text-[10px] font-bold mt-0.5 animate-fade-in-up"
                    style={{ color: pos.color }}
                  >
                    {assignedPlayer}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Buttons */}
        <div className="text-center">
          {!isSpinning && winnerId === null && !autoAssignedPos && availablePositions.length > 1 && (
            <button
              onClick={spin}
              className="btn-primary btn-shimmer px-10 py-4 rounded-[var(--radius-lg)] font-black text-lg tracking-wide min-h-[52px]"
            >
              GIRAR RULETA
            </button>
          )}
          {isSpinning && (
            <div className="inline-flex items-center gap-3 px-6 py-3 glass rounded-[var(--radius-lg)]">
              <div className="w-4 h-4 border-2 border-[var(--color-yellow)] border-t-transparent rounded-full animate-spin" />
              <span className="font-bold text-sm text-[var(--color-yellow)]">Girando...</span>
            </div>
          )}
          {winner && !isSpinning && (
            <button
              onClick={confirmPosition}
              className="btn-success btn-shimmer px-8 py-3 rounded-[var(--radius-md)] font-black text-sm tracking-wide min-h-[44px] animate-scale-in"
            >
              {currentIndex < players.length - 1 ? 'SIGUIENTE JUGADOR' : 'CONTINUAR'}
            </button>
          )}
          {autoAssignedPos && (
            <div className="inline-flex items-center gap-3 px-6 py-3 glass rounded-[var(--radius-lg)]">
              <div className="w-4 h-4 border-2 border-[var(--color-green)] border-t-transparent rounded-full animate-spin" />
              <span className="font-bold text-sm text-[var(--color-green)]">Posicion asignada automaticamente</span>
            </div>
          )}
        </div>

        {/* Progress */}
        <div className="mt-6 pt-4 border-t border-white/5">
          <div className="flex justify-center gap-2" role="list" aria-label="Progreso">
            {players.map((player, index) => (
              <div
                key={player}
                role="listitem"
                className="px-3 py-1 rounded-lg text-xs font-bold transition-all duration-200"
                style={{
                  background: index < currentIndex || (autoAssignedPos && index === players.length - 1)
                    ? 'rgba(155, 240, 25, 0.15)'
                    : index === currentIndex
                      ? 'rgba(2, 62, 138, 0.2)'
                      : '#1A1A1A',
                  color: index < currentIndex || (autoAssignedPos && index === players.length - 1)
                    ? '#9bf019'
                    : index === currentIndex
                      ? 'white'
                      : '#555',
                  border: `1px solid ${index < currentIndex || (autoAssignedPos && index === players.length - 1) ? 'rgba(155,240,25,0.25)' : index === currentIndex ? 'rgba(2,62,138,0.4)' : 'rgba(255,255,255,0.05)'}`,
                }}
              >
                {player}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
