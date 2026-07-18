import { useState, useRef, useEffect } from 'react'

const POSITIONS = ['Top', 'Jungle', 'Mid', 'ADC', 'Support']

export default function PlayerSelector({ onComplete }) {
  const [playerCount, setPlayerCount] = useState(0)
  const [playerNames, setPlayerNames] = useState([])
  const [currentInput, setCurrentInput] = useState(0)
  const inputRef = useRef(null)

  useEffect(() => {
    if (playerCount > 0 && inputRef.current) {
      inputRef.current.focus()
    }
  }, [currentInput, playerCount])

  const handleCountSelect = (count) => {
    setPlayerCount(count)
    setPlayerNames(Array(count).fill(''))
    setCurrentInput(0)
  }

  const handleNameChange = (index, name) => {
    const newNames = [...playerNames]
    newNames[index] = name
    setPlayerNames(newNames)
  }

  const handleNext = () => {
    if (currentInput < playerCount - 1) {
      setCurrentInput(prev => prev + 1)
    } else {
      const validNames = playerNames.map((name, i) => name.trim() || `Jugador ${i + 1}`)
      onComplete(validNames)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleNext()
  }

  const canProceed = playerNames[currentInput]?.trim() || currentInput !== playerNames.findIndex(n => !n.trim())

  return (
    <div className="max-w-lg mx-auto animate-scale-in">
      <div className="glass-strong rounded-[var(--radius-xl)] p-5 sm:p-8">
        <h2 className="text-2xl font-black text-white mb-6 text-center tracking-tight">
          Cuantos jugadores?
        </h2>

        {/* Player count buttons */}
        <div className="flex justify-center gap-3 mb-8 stagger-children" role="radiogroup" aria-label="Numero de jugadores">
          {[1, 2, 3, 4, 5].map(count => (
            <button
              key={count}
              onClick={() => handleCountSelect(count)}
              role="radio"
              aria-checked={playerCount === count}
              aria-label={`${count} jugador${count > 1 ? 'es' : ''}`}
              className={`w-14 h-14 rounded-xl text-xl font-black transition-all duration-200 min-h-[44px] min-w-[44px] ${
                playerCount === count
                  ? 'bg-[var(--color-blue)] text-white border border-[var(--color-blue)] shadow-[0_0_20px_rgba(2,62,138,0.4)]'
                  : 'bg-[#1A1A1A] text-gray-400 border border-white/5 hover:bg-[#222] hover:text-white hover:border-white/10'
              }`}
            >
              {count}
            </button>
          ))}
        </div>

        {/* Name inputs */}
        {playerCount > 0 && (
          <div className="space-y-3 animate-fade-in-up">
            <p className="text-gray-500 text-center text-sm mb-4 font-bold">
              Jugador {currentInput + 1} de {playerCount}
            </p>

            {playerNames.map((name, index) => (
              <div
                key={index}
                  className={`transition-opacity duration-200 ${
                  index === currentInput
                    ? 'opacity-100'
                    : index < currentInput
                      ? 'opacity-50'
                      : 'opacity-25'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm"
                    style={{
                      background: index === currentInput
                        ? 'linear-gradient(135deg, #023E8A 0%, #012d6b 100%)'
                        : '#1A1A1A',
                      color: index === currentInput ? 'white' : index < currentInput ? '#666' : '#555',
                      border: `1px solid ${index === currentInput ? '#023E8A66' : '#333'}`,
                      boxShadow: index === currentInput ? '0 0 12px rgba(2,62,138,0.3)' : 'none',
                    }}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <input
                      ref={index === currentInput ? inputRef : null}
                      type="text"
                      value={name}
                      onChange={(e) => handleNameChange(index, e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={`Jugador ${index + 1}`}
                      disabled={index !== currentInput}
                      aria-label={`Nombre del jugador ${index + 1}`}
                      className="w-full px-4 py-3 rounded-xl bg-[#1A1A1A] text-white placeholder-gray-600 border border-white/5 focus:border-[var(--color-blue)] focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)]/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed font-medium"
                    />
                  </div>
                  {index < currentInput && (
                    <div className="flex-shrink-0 text-gray-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div className="pt-4 flex justify-center">
              <button
                onClick={handleNext}
                disabled={!canProceed}
                className="btn-primary btn-shimmer px-8 py-3 rounded-xl font-black text-sm tracking-wide disabled:opacity-30 disabled:cursor-not-allowed min-h-[44px]"
              >
                {currentInput < playerCount - 1 ? 'SIGUIENTE' : 'COMENZAR EL RETO'}
              </button>
            </div>
          </div>
        )}

        {/* Position preview */}
        {playerCount > 0 && (
          <div className="mt-8 pt-6 border-t border-white/5 animate-fade-in-up">
            <p className="text-gray-600 text-xs mb-3 text-center font-bold tracking-widest uppercase">Posiciones</p>
            <div className="flex flex-wrap justify-center gap-2">
              {POSITIONS.map(pos => (
                <span key={pos} className="px-3 py-1.5 bg-[#1A1A1A] text-gray-400 rounded-lg text-xs font-bold border border-white/5">
                  {pos}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
