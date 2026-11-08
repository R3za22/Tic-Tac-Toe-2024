import { describe, it, expect } from 'vitest'
import { LINES, emptyBoard, winnerOf, isDraw, legalMoves, boardFromMoves, nextPlayer, cellName } from './logic.js'

describe('game logic', () => {
  it('has 8 winning lines', () => expect(LINES).toHaveLength(8))
  it('empty board has no winner and 9 legal moves', () => {
    expect(winnerOf(emptyBoard())).toBeNull()
    expect(legalMoves(emptyBoard())).toHaveLength(9)
  })
  it('detects every line for both players', () => {
    for (const line of LINES) for (const p of ['X', 'O']) {
      const b = emptyBoard(); line.forEach((i) => (b[i] = p))
      expect(winnerOf(b)).toEqual({ player: p, line })
    }
  })
  it('detects draws only when full without a winner', () => {
    expect(isDraw('XOXXOOOXX'.split(''))).toBe(true)
    expect(isDraw(['X', 'X', 'X', 'O', 'O', null, null, null, null])).toBe(false)
    expect(isDraw(['X', 'X', 'X', 'O', 'O', 'X', 'O', 'O', 'X'])).toBe(false)
  })
  it('builds a board from moves and alternates players from the first mover', () => {
    const moves = [{ player: 'O', cell: 4 }, { player: 'X', cell: 0 }]
    expect(boardFromMoves(moves)[4]).toBe('O')
    expect(nextPlayer('X', [])).toBe('X')
    expect(nextPlayer('O', [])).toBe('O')
    expect(nextPlayer('O', moves.slice(0, 1))).toBe('X')
  })
  it('names cells in 1-based row and column', () => {
    expect(cellName(0)).toEqual({ row: 1, col: 1 })
    expect(cellName(5)).toEqual({ row: 2, col: 3 })
    expect(cellName(8)).toEqual({ row: 3, col: 3 })
  })
})
