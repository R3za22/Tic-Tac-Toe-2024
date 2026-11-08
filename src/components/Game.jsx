import Mark from './Mark.jsx'
import MoveLog from './MoveLog.jsx'
import { IconBack, IconRestart, IconUndo } from './Icons.jsx'
import { boardFromMoves } from '../game/logic.js'

export default function Game({ t, num, game, names, set, scores, round, status, thinking, canUndo, onCell, onUndo, onRestart, onBack }) {
  const board = boardFromMoves(game.moves)
  const subtitle = game.mode === 'ai' ? `${t[game.level]} · ${t.round(num(round))}` : t.round(num(round))
  return (
    <section className="screen game" aria-labelledby="game-title">
      <header className="bar">
        <button type="button" className="icon-btn" aria-label={t.back} onClick={onBack}><IconBack /></button>
        <div className="bar-title"><h1 id="game-title">{game.mode === 'ai' ? t.ai : t.pvp}</h1><span>{subtitle}</span></div>
      </header>
      <div className="game-grid">
        <div className="play-col">
          <div className={`status ${game.turn === 'X' ? 'x' : 'o'}`} aria-live="polite" data-testid="status"><span className="pill">{status}</span></div>
          <div role="group" aria-label={t.board} className="board" aria-busy={thinking}>
            {board.map((v, i) => {
              const r = Math.floor(i / 3) + 1, c = (i % 3) + 1
              return (
                <button key={i} type="button" className="cell" data-cell={i} disabled={v !== null || thinking}
                  aria-label={t.cell(num(r), num(c), v ?? t.empty)} onClick={() => onCell(i)}>
                  {v && <Mark player={v} set={set} />}
                </button>
              )
            })}
          </div>
        </div>
        <aside className="side">
          <section aria-label={t.score} className="scores">
            <div className="score x"><span>{names.X} (X)</span><b data-testid="score-x">{num(scores.X)}</b></div>
            <div className="score d"><span>{t.draws}</span><b data-testid="score-d">{num(scores.D)}</b></div>
            <div className="score o"><span>{names.O} (O)</span><b data-testid="score-o">{num(scores.O)}</b></div>
          </section>
          <MoveLog t={t} num={num} moves={game.moves} />
          <div className="actions">
            <button type="button" className="btn" disabled={!canUndo} onClick={onUndo}><IconUndo />{t.undo}</button>
            <button type="button" className="btn primary" onClick={onRestart}><IconRestart />{t.restart}</button>
          </div>
        </aside>
      </div>
    </section>
  )
}
