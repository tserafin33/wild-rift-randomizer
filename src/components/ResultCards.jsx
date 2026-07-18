import RuneIcon from './RuneIcon'

const POSITIONS = {
  'Top': { color: '#FF1744', icon: '🗡️' },
  'Jungle': { color: '#39FF14', icon: '🌿' },
  'Mid': { color: '#FFD700', icon: '⚡' },
  'ADC': { color: '#9C27B0', icon: '🏹' },
  'Support': { color: '#2979FF', icon: '💚' }
}

export default function ResultCards({ assignments, onRestart }) {
  const players = Object.keys(assignments)

  return (
    <div className="max-w-6xl mx-auto px-1 sm:px-0 animate-scale-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Builds Completados</h2>
        <p className="text-gray-500 font-medium">Los builds aleatorios para tu equipo</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 stagger-children">
        {players.map((player, index) => {
          const build = assignments[player]
          const posData = POSITIONS[build.position] || { color: '#888', icon: '❓' }
          const posColor = posData.color

          return (
            <div
              key={player}
              className="rounded-[var(--radius-xl)] p-5 card-lift"
              style={{
                background: `linear-gradient(135deg, ${posColor}12 0%, ${posColor}06 100%)`,
                border: `1px solid ${posColor}30`,
                boxShadow: `0 0 20px ${posColor}15, inset 0 1px 0 rgba(255,255,255,0.04)`,
                backdropFilter: 'blur(12px)',
              }}
            >
              {/* Header - position color, large position text */}
              <div className="text-center mb-4">
                <h3 className="text-xl font-black text-white mb-1">{player}</h3>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl">{posData.icon}</span>
                  <span
                    className="font-black text-lg tracking-wide"
                    style={{ color: posColor, textShadow: `0 0 10px ${posColor}40` }}
                  >
                    {build.position}
                  </span>
                </div>
              </div>

              {/* Champion */}
              <div
                className="rounded-xl p-3 mb-3"
                style={{
                  background: 'rgba(14, 14, 14, 0.7)',
                  border: `1px solid ${posColor}20`,
                }}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={build.champion?.image || `https://ddragon.leagueoflegends.com/cdn/16.14.1/img/champion/${build.champion?.id || 'Garen'}.png`}
                    alt={build.champion?.name_es || 'Champion'}
                    className="w-14 h-14 rounded-xl"
                    style={{
                      border: `2px solid ${posColor}40`,
                      boxShadow: `0 0 10px ${posColor}15`,
                    }}
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = 'https://ddragon.leagueoflegends.com/cdn/16.14.1/img/champion/Garen.png'
                    }}
                  />
                  <div>
                    <p className="text-white font-black">{build.champion?.name_es || 'Campeon'}</p>
                    <p className="text-gray-500 text-xs font-bold">{build.champion?.roles_es?.join(' / ') || 'Luchador'}</p>
                  </div>
                </div>
              </div>

              {/* Boots + Enchantment */}
              <div className="mb-3">
                <p className="text-xs font-black mb-1.5 tracking-wide" style={{ color: posColor }}>BOTAS + ENCANT.</p>
                <div className="grid grid-cols-2 gap-1">
                  {build.boots?.map((item, idx) => (
                    <div key={idx} className="text-center">
                      <img
                        src={item.image}
                        alt={item.name_es}
                        className="w-9 h-9 mx-auto rounded-lg"
                        style={{
                          background: '#141414',
                          border: '1px solid rgba(255,255,255,0.06)',
                        }}
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = 'https://ddragon.leagueoflegends.com/cdn/16.14.1/img/item/1001.png'
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Combat Items */}
              <div className="mb-3">
                <p className="text-xs font-black mb-1.5 tracking-wide" style={{ color: posColor }}>ITEMS</p>
                <div className="grid grid-cols-5 gap-1 sm:gap-1.5">
                  {build.combat?.map((item, idx) => (
                    <div key={idx} className="text-center">
                      <img
                        src={item.image}
                        alt={item.name_es}
                        className="w-9 h-9 mx-auto rounded-lg"
                        style={{
                          background: '#141414',
                          border: '1px solid rgba(255,255,255,0.06)',
                        }}
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = 'https://ddragon.leagueoflegends.com/cdn/16.14.1/img/item/1001.png'
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Runes */}
              <div className="mb-3 overflow-hidden">
                <p className="text-xs font-black mb-1.5 tracking-wide" style={{ color: posColor }}>RUNAS</p>
                <div className="flex items-center gap-2 min-w-0">
                  {build.runes?.keystone && (
                    <RuneIcon rune={build.runes.keystone} size="lg" />
                  )}
                  <div className="flex gap-1 min-w-0">
                    {build.runes?.minor?.map((rune, idx) => (
                      <RuneIcon key={idx} rune={rune} size="sm" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Spells */}
              <div>
                <p className="text-xs font-black mb-1.5 tracking-wide" style={{ color: posColor }}>HECHIZOS</p>
                <div className="flex flex-wrap gap-2">
                  {build.spells?.map((spell, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1 rounded-lg px-2 py-1"
                      style={{
                        background: 'rgba(14, 14, 14, 0.7)',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <img src={spell.image} alt={spell.name_es} className="w-7 h-7 rounded" loading="lazy" />
                      <span className="text-white text-xs font-bold">{spell.name_es}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="text-center">
        <button
          onClick={onRestart}
          className="btn-danger btn-shimmer px-8 py-4 rounded-xl font-black text-sm tracking-wide min-h-[52px]"
        >
          JUGAR DE NUEVO
        </button>
      </div>
    </div>
  )
}
