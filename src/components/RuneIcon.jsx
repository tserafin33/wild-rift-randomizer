import { useState } from 'react'

const PATH_COLORS = {
  Precision: '#FF3745',
  Domination: '#890202',
  Sorcery: '#4B5C71',
  Resolve: '#9bf019',
  Inspiration: '#023E8A',
}

export default function RuneIcon({ rune, size = 'md' }) {
  const [imgError, setImgError] = useState(false)
  const color = rune.color || PATH_COLORS[rune.path] || '#888'
  const sizeClass = size === 'xl' ? 'w-14 h-14 text-base' : size === 'lg' ? 'w-9 h-9 text-sm' : 'w-7 h-7 text-[10px]'
  const initial = rune.name_es?.charAt(0) || '?'

  if (imgError) {
    return (
      <div
        className={`${sizeClass} rounded-lg flex items-center justify-center font-black text-white flex-shrink-0`}
        style={{
          backgroundColor: `${color}30`,
          border: `1px solid ${color}50`,
          boxShadow: `0 0 8px ${color}20`,
        }}
        title={rune.name_es}
      >
        {initial}
      </div>
    )
  }

  return (
    <img
      src={rune.image}
      alt={rune.name_es}
      className={`${sizeClass} rounded-lg flex-shrink-0`}
      style={{ border: '1px solid rgba(255,255,255,0.08)' }}
      loading="lazy"
      title={rune.name_es}
      onError={() => setImgError(true)}
    />
  )
}
