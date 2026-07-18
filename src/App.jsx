import { useState, useCallback } from 'react'
import PlayerSelector from './components/PlayerSelector'
import PositionRoulette from './components/PositionRoulette'
import ChampionSlots from './components/ChampionSlots'
import BuildPhase from './components/BuildPhase'
import ResultCards from './components/ResultCards'

function App() {
  const [phase, setPhase] = useState('players')
  const [players, setPlayers] = useState([])
  const [assignments, setAssignments] = useState({})

  const updateAssignments = useCallback((newData) => {
    setAssignments(prev => ({ ...prev, ...newData }))
  }, [])

  const handlePlayersComplete = (playerNames) => {
    setPlayers(playerNames)
    setPhase('positions')
  }

  const handlePositionsComplete = (positionAssignments) => {
    const updated = {}
    Object.keys(positionAssignments).forEach(player => {
      updated[player] = { position: positionAssignments[player] }
    })
    updateAssignments(updated)
    setPhase('champions')
  }

  const handleChampionsComplete = (championAssignments) => {
    const updated = {}
    Object.keys(championAssignments).forEach(player => {
      updated[player] = { ...(assignments[player] || {}), champion: championAssignments[player] }
    })
    updateAssignments(updated)
    setPhase('build')
  }

  const handleBuildComplete = (buildAssignments) => {
    const updated = {}
    Object.keys(buildAssignments).forEach(player => {
      updated[player] = { ...(assignments[player] || {}), ...buildAssignments[player] }
    })
    updateAssignments(updated)
    setPhase('results')
  }

  const handleRestart = () => {
    setPhase('players')
    setPlayers([])
    setAssignments({})
  }

  return (
    <div className="min-h-dvh" style={{ background: 'linear-gradient(180deg, #1A1A1A 0%, #282828 30%, #1E1E1E 100%)' }}>
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
        <header className="text-center mb-10 animate-fade-in-up">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight mb-3">
            <span className="text-[var(--color-blue)]" style={{ textShadow: '0 0 20px rgba(2,62,138,0.5), 0 0 40px rgba(2,62,138,0.2)' }}>WILD</span>
            <span className="text-white mx-3">RIFT</span>
            <span className="text-[var(--color-red)]" style={{ textShadow: '0 0 20px rgba(137,2,2,0.5), 0 0 40px rgba(137,2,2,0.2)' }}>RANDOMIZER</span>
          </h1>
          <p className="text-gray-400 text-lg font-medium">El reto definitivo para tu equipo</p>
          <div className="gaming-divider mt-6 mx-auto max-w-md" />
        </header>

        <main>
          {phase === 'players' && (
            <PlayerSelector onComplete={handlePlayersComplete} />
          )}
          {phase === 'positions' && (
            <PositionRoulette players={players} onComplete={handlePositionsComplete} />
          )}
          {phase === 'champions' && (
            <ChampionSlots players={players} assignments={assignments} onComplete={handleChampionsComplete} />
          )}
          {phase === 'build' && (
            <BuildPhase players={players} assignments={assignments} onComplete={handleBuildComplete} />
          )}
          {phase === 'results' && (
            <ResultCards assignments={assignments} onRestart={handleRestart} />
          )}
        </main>
      </div>
    </div>
  )
}

export default App
