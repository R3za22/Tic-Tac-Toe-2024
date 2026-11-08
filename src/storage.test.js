import { describe, it, expect } from 'vitest'
import { createStorage, DEFAULT_SETTINGS, HISTORY_LIMIT } from './storage.js'

const memory = () => { const m = new Map(); return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) } }
const blocked = () => { const e = () => { throw new Error('SecurityError') }; return { getItem: e, setItem: e, removeItem: e } }
const game = (i) => ({ id: `g${i}`, at: 1, mode: 'ai', level: 'easy', winner: 'X', nameX: 'A', nameO: 'B', moves: 5 })

describe('storage', () => {
  it('returns defaults when empty', () => {
    const s = createStorage(memory())
    expect(s.loadSettings()).toEqual(DEFAULT_SETTINGS)
    expect(s.loadHistory()).toEqual([])
    expect(s.blocked).toBe(false)
  })
  it('round-trips settings and history through the backend', () => {
    const be = memory(); const s = createStorage(be)
    s.saveSettings({ ...DEFAULT_SETTINGS, lang: 'fa', theme: 'night' })
    s.addGame(game(1))
    const again = createStorage(be)
    expect(again.loadSettings().lang).toBe('fa')
    expect(again.loadHistory()).toHaveLength(1)
  })
  it('ignores corrupted JSON and unknown values', () => {
    const be = memory(); be.setItem('ttt:settings', '{nope'); be.setItem('ttt:history', '[1,"x",null]')
    const s = createStorage(be)
    expect(s.loadSettings()).toEqual(DEFAULT_SETTINGS)
    expect(s.loadHistory()).toEqual([])
    be.setItem('ttt:settings', JSON.stringify({ theme: 'neon', lang: 'fa', nameX: 'x'.repeat(40) }))
    const t = createStorage(be).loadSettings()
    expect(t.theme).toBe(DEFAULT_SETTINGS.theme)
    expect(t.lang).toBe('fa')
    expect(t.nameX.length).toBeLessThanOrEqual(12)
  })
  it('falls back to memory and flags blocked when storage throws', () => {
    const s = createStorage(blocked())
    expect(s.blocked).toBe(true)
    s.addGame(game(1))
    expect(s.loadHistory()).toHaveLength(1)
    s.saveSettings({ ...DEFAULT_SETTINGS, theme: 'night' })
    expect(s.loadSettings().theme).toBe('night')
  })
  it('caps history and supports clearing', () => {
    const s = createStorage(memory())
    for (let i = 0; i < HISTORY_LIMIT + 5; i++) s.addGame(game(i))
    expect(s.loadHistory()).toHaveLength(HISTORY_LIMIT)
    expect(s.loadHistory()[0].id).toBe(`g${HISTORY_LIMIT + 4}`)
    s.clearHistory()
    expect(s.loadHistory()).toEqual([])
  })
})
