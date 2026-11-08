import { useState } from 'react'
import { Seg } from './Setup.jsx'
import Mark from './Mark.jsx'
import { IconAlert, IconChevron } from './Icons.jsx'

function when(t, at, lang) {
  const day = 86400000, d = new Date(at), now = new Date()
  const diff = Math.round((new Date(now.getFullYear(), now.getMonth(), now.getDate()) - new Date(d.getFullYear(), d.getMonth(), d.getDate())) / day)
  if (diff <= 0) return t.today
  if (diff === 1) return t.yesterday
  return d.toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-GB', { day: 'numeric', month: 'short' })
}

export default function Stats({ t, num, lang, history, blocked, onClear, onPlay }) {
  const [filter, setFilter] = useState('all')
  const list = history.filter((g) => filter === 'all' || g.mode === filter)
  const won = list.filter((g) => g.winner === 'X').length
  const lost = list.filter((g) => g.winner === 'O').length
  const drawn = list.length - won - lost
  return (
    <section className="screen stats" aria-labelledby="stats-title">
      <header className="bar">
        <h1 id="stats-title">{t.stats}</h1>
        <button type="button" className="link" onClick={onClear} disabled={history.length === 0}>{t.clear}</button>
      </header>
      {blocked && (
        <div role="alert" className="banner"><IconAlert /><span><strong>{t.blockedTitle}</strong> {t.blockedBody}</span></div>
      )}
      <section aria-label={t.stats} className="totals" data-testid="totals">
        {[[t.played, list.length], [t.won, won], [t.drawn, drawn], [t.lost, lost]].map(([label, n]) => (
          <div key={label}><span>{label}</span><b>{num(n)}</b></div>
        ))}
      </section>
      <Seg label={t.filter} value={filter} onChange={setFilter} options={[['all', t.all], ['pvp', t.pvp], ['ai', t.ai]]} />
      {list.length === 0 ? (
        <div className="empty">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true"><path d="M19 6v44M37 6v44M6 19h44M6 37h44" /></svg>
          <strong>{t.noGames}</strong><span>{t.noGamesBody}</span>
          <button type="button" className="btn primary" onClick={onPlay}>{t.playAGame}</button>
        </div>
      ) : (
        <ul className="games" data-testid="games">
          {list.map((g) => (
            <li key={g.id}>
              <span className={`badge ${g.winner ? 'w' : 'd'}`}>{g.winner ? <Mark player={g.winner} /> : '='}</span>
              <span className="g-text">
                <strong>{g.winner ? t.gameWon(g.winner === 'X' ? g.nameX : g.nameO) : t.gameDraw}</strong>
                <small>{when(t, g.at, lang)} · {g.mode === 'ai' ? `${t.playedVs}, ${t[g.level]}` : t.pvp} · {t.inMoves(num(g.moves))}</small>
              </span>
              <IconChevron />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
