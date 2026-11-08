import Mark from './Mark.jsx'
import MoveLog from './MoveLog.jsx'
import { boardFromMoves, cellName } from '../game/logic.js'

function lineText(t, num, line) {
  const k = line.join()
  if (k === '0,4,8') return t.winLine.d1
  if (k === '2,4,6') return t.winLine.d2
  return line[1] - line[0] === 1 ? t.winLine.row(num(Math.floor(line[0] / 3) + 1)) : t.winLine.col(num(cellName(line[0]).col))
}

export default function Result({ t, num, game, result, names, set, round, onRematch, onChangeMode }) {
  const board = boardFromMoves(game.moves)
  const win = result.winner
  return (
    <section className="screen result" aria-labelledby="result-title">
      <header className="result-head" aria-live="polite">
        <span className={`pill ${win ? 'gold' : 'dashed'}`}>{t.roundOver(num(round))}</span>
        <h1 id="result-title" data-testid="result-title">{win ? t.wins(names[win.player]) : t.drawTitle}</h1>
        <p>{win ? `${lineText(t, num, win.line)}, ${t.inMoves(num(game.moves.length))}.` : t.drawBody}</p>
      </header>
      <div className="board mini" role="img" aria-label={t.finalBoard}>
        {board.map((v, i) => (
          <div key={i} className={`cell${win && win.line.includes(i) ? ' hit' : ''}`}>{v && <Mark player={v} set={set} />}</div>
        ))}
      </div>
      <MoveLog t={t} num={num} moves={game.moves} winnerCell={win ? game.moves.length - 1 : -1} />
      <div className="actions end">
        <button type="button" className="btn primary big" onClick={onRematch}>{t.rematch}</button>
        <button type="button" className="btn big" onClick={onChangeMode}>{t.changeMode}</button>
      </div>
    </section>
  )
}
