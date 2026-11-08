import { LINES, other, winnerOf, legalMoves } from './logic.js'

const pick = (arr, rng) => arr[Math.floor(rng() * arr.length) % arr.length]

// A cell that completes a line for `player`, or null.
function completing(board, player) {
  for (const [a, b, c] of LINES) {
    const cells = [a, b, c]
    const mine = cells.filter((i) => board[i] === player)
    const empty = cells.filter((i) => board[i] === null)
    if (mine.length === 2 && empty.length === 1) return empty[0]
  }
  return null
}

function score(board, me, turn, depth, alpha, beta) {
  const w = winnerOf(board)
  if (w) return w.player === me ? 10 - depth : depth - 10
  const moves = legalMoves(board)
  if (moves.length === 0) return 0
  let best = turn === me ? -Infinity : Infinity
  for (const m of moves) {
    board[m] = turn
    const s = score(board, me, other(turn), depth + 1, alpha, beta)
    board[m] = null
    if (turn === me) { best = Math.max(best, s); alpha = Math.max(alpha, s) }
    else { best = Math.min(best, s); beta = Math.min(beta, s) }
    if (beta <= alpha) break
  }
  return best
}

// Perfect play. Ties go to the lowest index, so the choice is deterministic.
export function minimaxMove(board, me) {
  const work = board.slice()
  let bestMove = -1, bestScore = -Infinity
  for (const m of legalMoves(work)) {
    work[m] = me
    const s = score(work, me, other(me), 1, -Infinity, Infinity)
    work[m] = null
    if (s > bestScore) { bestScore = s; bestMove = m }
  }
  return bestMove
}

// level: 'easy' (random), 'medium' (wins, usually blocks, else random), 'unbeatable' (minimax).
export function chooseMove(board, me, level, rng = Math.random) {
  const moves = legalMoves(board)
  if (moves.length === 0) return -1
  if (level === 'unbeatable') return minimaxMove(board, me)
  if (level === 'medium') {
    const win = completing(board, me)
    if (win !== null) return win
    const block = completing(board, other(me))
    if (block !== null && rng() < 0.75) return block
  }
  return pick(moves, rng)
}
