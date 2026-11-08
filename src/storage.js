// localStorage persistence with an in-memory fallback when the browser blocks storage.
export const HISTORY_LIMIT = 100
export const NAME_MAX = 12
const SETTINGS_KEY = 'ttt:settings'
const HISTORY_KEY = 'ttt:history'

export const DEFAULT_SETTINGS = {
  nameX: 'Player 1', nameO: 'Player 2',
  symbols: 'classic', sound: true, theme: 'system', lang: 'en',
}
const ENUMS = { symbols: ['classic', 'plus', 'block'], theme: ['light', 'night', 'system'], lang: ['en', 'fa'] }

export function sanitizeSettings(raw) {
  const s = { ...DEFAULT_SETTINGS }
  if (!raw || typeof raw !== 'object') return s
  for (const k of ['nameX', 'nameO']) if (typeof raw[k] === 'string' && raw[k].trim()) s[k] = raw[k].trim().slice(0, NAME_MAX)
  for (const k of Object.keys(ENUMS)) if (ENUMS[k].includes(raw[k])) s[k] = raw[k]
  if (typeof raw.sound === 'boolean') s.sound = raw.sound
  return s
}

const validGame = (g) => g && typeof g === 'object' && typeof g.id === 'string' && ['pvp', 'ai'].includes(g.mode)

export function createStorage(backend) {
  let blocked = false
  const mem = {}
  const read = (key) => {
    if (!blocked) { try { return backend.getItem(key) } catch { blocked = true } }
    return mem[key] ?? null
  }
  const write = (key, value) => {
    mem[key] = value
    if (blocked) return
    try { backend.setItem(key, value) } catch { blocked = true }
  }
  const parse = (key) => { try { return JSON.parse(read(key)) } catch { return null } }
  const api = {
    get blocked() { return blocked },
    loadSettings() { return sanitizeSettings(parse(SETTINGS_KEY)) },
    saveSettings(s) { write(SETTINGS_KEY, JSON.stringify(sanitizeSettings(s))) },
    loadHistory() { const h = parse(HISTORY_KEY); return Array.isArray(h) ? h.filter(validGame) : [] },
    addGame(g) { write(HISTORY_KEY, JSON.stringify([g, ...api.loadHistory()].slice(0, HISTORY_LIMIT))) },
    clearHistory() { write(HISTORY_KEY, '[]') },
  }
  api.loadSettings() // probe so `blocked` is known before first render
  return api
}

export function browserBackend() {
  try { return window.localStorage } catch { return { getItem() { throw new Error('blocked') }, setItem() { throw new Error('blocked') } } }
}
