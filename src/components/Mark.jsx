// Symbol glyphs per set. Colours come from CSS (.mark-x / .mark-o).
export default function Mark({ player, set = 'classic' }) {
  const x = player === 'X'
  return (
    <svg className={x ? 'mark mark-x' : 'mark mark-o'} viewBox="0 0 40 40" aria-hidden="true" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {x && set === 'classic' && <path d="M8 8L32 32M32 8L8 32" strokeWidth="6" />}
      {x && set === 'plus' && <path d="M20 6v28M6 20h28" strokeWidth="6" />}
      {x && set === 'block' && <rect x="8" y="8" width="24" height="24" rx="4" strokeWidth="6" />}
      {!x && set === 'classic' && <circle cx="20" cy="20" r="12" strokeWidth="6" />}
      {!x && set === 'plus' && <path d="M20 7l13 24H7z" strokeWidth="6" />}
      {!x && set === 'block' && <circle cx="20" cy="20" r="7" strokeWidth="6" className="fill" />}
    </svg>
  )
}
