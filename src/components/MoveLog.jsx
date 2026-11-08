import { cellName } from '../game/logic.js'

export default function MoveLog({ t, num, moves, winnerCell }) {
  return (
    <section className="log" aria-label={t.moveLog}>
      <h2>{t.moveLog}</h2>
      <ol data-testid="move-log">
        {moves.map((m, i) => {
          const { row, col } = cellName(m.cell)
          return (
            <li key={i}>
              <span className="n">{num(i + 1)}</span>
              <span className="who"><b className={m.player === 'X' ? 'x' : 'o'}>{m.player}</b> {t.pos[m.cell]}{winnerCell === i ? `, ${t.winsMove}` : ''}</span>
              <span className="rc">{`R${num(row)} C${num(col)}`}</span>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
