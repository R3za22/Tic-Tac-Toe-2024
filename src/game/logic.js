// Pure game rules. Board is an array of 9 cells: 'X' | 'O' | null (row-major).
export const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
]

export const other = (p) => (p === 'X' ? 'O' : 'X')
export const emptyBoard = () => Array(9).fill(null)

export function winnerOf(board) {
  for (const line of LINES) {
    const [a, b, c] = line
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return { player: board[a], line }
  }
  return null
}

export const legalMoves = (board) => board.flatMap((v, i) => (v === null ? [i] : []))
export const isDraw = (board) => !winnerOf(board) && legalMoves(board).length === 0

// moves: [{ player, cell }] in play order.
export function boardFromMoves(moves) {
  const board = emptyBoard()
  for (const m of moves) board[m.cell] = m.player
  return board
}

export const nextPlayer = (first, moves) => (moves.length % 2 === 0 ? first : other(first))

export const cellName = (cell) => ({ row: Math.floor(cell / 3) + 1, col: (cell % 3) + 1 })
