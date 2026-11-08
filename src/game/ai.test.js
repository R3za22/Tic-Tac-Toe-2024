import { describe, it, expect } from 'vitest'
import { chooseMove, minimaxMove } from './ai.js'
import { emptyBoard, legalMoves, winnerOf, isDraw } from './logic.js'

const b = (s) => s.split('').map((c) => (c === '.' ? null : c))
const seq = (...vals) => { let i = 0; return () => vals[i++ % vals.length] }

describe('ai', () => {
  it('easy only returns legal moves', () => {
    const board = b('XO.XO.X..')
    for (let i = 0; i < 30; i++) expect(legalMoves(board)).toContain(chooseMove(board, 'O', 'easy', Math.random))
  })
  it('medium takes an immediate win', () => {
    expect(chooseMove(b('OO.XX....'), 'O', 'medium', () => 0)).toBe(2)
  })
  it('medium blocks an immediate loss', () => {
    expect(chooseMove(b('XX.O.....'), 'O', 'medium', () => 0)).toBe(2)
  })
  it('medium sometimes errs when no threat exists (rng in mistake range)', () => {
    const board = b('X........')
    expect(legalMoves(board)).toContain(chooseMove(board, 'O', 'medium', seq(0.9, 0.5)))
  })
  it('unbeatable wins when possible and blocks otherwise', () => {
    expect(minimaxMove(b('OO.XX....'), 'O')).toBe(2)
    expect(minimaxMove(b('XX.O.....'), 'O')).toBe(2)
  })
  it('unbeatable answers a corner opening with the centre', () => {
    expect(minimaxMove(b('X........'), 'O')).toBe(4)
  })
  it('unbeatable (as O) never loses against any human sequence', () => {
    let games = 0
    const walk = (board, turn) => {
      const w = winnerOf(board)
      if (w) { expect(w.player).toBe('O'); games++; return }
      if (isDraw(board)) { games++; return }
      if (turn === 'X') for (const m of legalMoves(board)) { const nb = board.slice(); nb[m] = 'X'; walk(nb, 'O') }
      else { const nb = board.slice(); nb[minimaxMove(board, 'O')] = 'O'; walk(nb, 'X') }
    }
    walk(emptyBoard(), 'X')
    expect(games).toBeGreaterThan(100)
  })
  it('unbeatable (as X moving first) never loses either', () => {
    const walk = (board, turn) => {
      const w = winnerOf(board)
      if (w) { expect(w.player).toBe('X'); return }
      if (isDraw(board)) return
      if (turn === 'O') for (const m of legalMoves(board)) { const nb = board.slice(); nb[m] = 'O'; walk(nb, 'X') }
      else { const nb = board.slice(); nb[minimaxMove(board, 'X')] = 'X'; walk(nb, 'O') }
    }
    walk(emptyBoard(), 'X')
  })
})
