import { useEffect, useMemo, useRef, useState } from 'react'
import Setup from './components/Setup.jsx'
import Game from './components/Game.jsx'
import Result from './components/Result.jsx'
import Stats from './components/Stats.jsx'
import Settings from './components/Settings.jsx'
import { IconPlay, IconSettings, IconStats, Logo } from './components/Icons.jsx'
import { STRINGS, numFmt } from './i18n.js'
import { createStorage, browserBackend, DEFAULT_SETTINGS } from './storage.js'
import { boardFromMoves, isDraw, nextPlayer, winnerOf } from './game/logic.js'
import { chooseMove } from './game/ai.js'
import { beep } from './sound.js'

const AI_DELAY_MS = 450

function newGame(setup) {
  let first = 'X'
  if (setup.mode === 'ai') first = setup.who === 'computer' ? 'O' : setup.who === 'random' ? (Math.random() < 0.5 ? 'X' : 'O') : 'X'
  return { mode: setup.mode, level: setup.level, first, moves: [] }
}

export default function App() {
  const [storage] = useState(() => createStorage(browserBackend()))
  const [settings, setSettings] = useState(() => storage.loadSettings())
  const [history, setHistory] = useState(() => storage.loadHistory())
  const [view, setView] = useState('play')
  const [setup, setSetup] = useState({ mode: 'pvp', level: 'medium', who: 'you' })
  const [phase, setPhase] = useState('setup')
  const [game, setGame] = useState(null)
  const [result, setResult] = useState(null)
  const [scores, setScores] = useState({ X: 0, O: 0, D: 0 })
  const [round, setRound] = useState(1)

  const t = STRINGS[settings.lang]
  const num = useMemo(() => numFmt(settings.lang), [settings.lang])

  useEffect(() => {
    const root = document.documentElement
    root.lang = settings.lang
    root.dir = settings.lang === 'fa' ? 'rtl' : 'ltr'
    if (settings.theme === 'system') root.removeAttribute('data-theme')
    else root.dataset.theme = settings.theme
    document.title = settings.lang === 'fa' ? 'دوز' : 'Tic-Tac-Toe'
  }, [settings.lang, settings.theme])

  const nameOf = (v, def) => (v === DEFAULT_SETTINGS[def === 'defaultX' ? 'nameX' : 'nameO'] ? t[def] : v)
  const names = { X: nameOf(settings.nameX, 'defaultX'), O: game?.mode === 'ai' ? t.aiName : nameOf(settings.nameO, 'defaultO') }

  function updateSettings(patch) {
    const next = { ...settings, ...patch }
    setSettings(next)
    storage.saveSettings(next)
  }

  function commit(moves) {
    const board = boardFromMoves(moves)
    const w = winnerOf(board)
    const draw = !w && isDraw(board)
    setGame((g) => ({ ...g, moves }))
    if (settings.sound) beep(w ? 'win' : draw ? 'draw' : moves[moves.length - 1].player.toLowerCase())
    if (!w && !draw) return
    const winner = w ? w.player : null
    storage.addGame({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, at: Date.now(), mode: game.mode, level: game.mode === 'ai' ? game.level : null,
      winner, nameX: names.X, nameO: names.O, moves: moves.length,
    })
    setHistory(storage.loadHistory())
    setScores((s) => ({ ...s, [winner ?? 'D']: s[winner ?? 'D'] + 1 }))
    setResult({ winner: w })
    setPhase('over')
  }
  const latest = useRef()
  latest.current = { commit }

  const turn = game ? nextPlayer(game.first, game.moves) : 'X'
  const computerTurn = phase === 'game' && game.mode === 'ai' && turn === 'O'
  useEffect(() => {
    if (!computerTurn) return undefined
    const id = setTimeout(() => {
      const cell = chooseMove(boardFromMoves(game.moves), 'O', game.level)
      latest.current.commit([...game.moves, { player: 'O', cell }])
    }, AI_DELAY_MS)
    return () => clearTimeout(id)
  }, [computerTurn, game])

  function start() {
    setGame(newGame(setup)); setScores({ X: 0, O: 0, D: 0 }); setRound(1); setResult(null); setPhase('game'); setView('play')
  }
  function rematch() { setGame(newGame(setup)); setRound((r) => r + 1); setResult(null); setPhase('game') }
  function restart() { setGame(newGame(setup)) }
  function toSetup() { setPhase('setup'); setResult(null) }
  function onCell(cell) {
    if (phase !== 'game' || computerTurn) return
    commit([...game.moves, { player: turn, cell }])
  }
  function undo() {
    const moves = game.moves.slice()
    if (game.mode === 'pvp') moves.pop()
    else while (moves.length && moves.pop().player !== 'X');
    setGame({ ...game, moves })
  }
  const canUndo = phase === 'game' && !computerTurn && game.moves.some((m) => (game.mode === 'ai' ? m.player === 'X' : true))

  const status = !game ? '' : game.mode === 'ai'
    ? (turn === 'X' ? t.turn(names.X) : t.thinking)
    : t.turnOf(names[turn], turn)

  let body
  if (view === 'stats') {
    body = <Stats t={t} num={num} lang={settings.lang} history={history} blocked={storage.blocked}
      onClear={() => { storage.clearHistory(); setHistory([]) }} onPlay={() => setView('play')} />
  } else if (view === 'settings') {
    body = <Settings key={settings.lang} t={t} settings={settings} onChange={updateSettings}
      onSaveNames={(nameX, nameO) => updateSettings({ nameX, nameO })} onDone={() => setView('play')} />
  } else if (phase === 'setup') {
    body = <Setup t={t} setup={setup} onChange={(p) => setSetup((s) => ({ ...s, ...p }))} onStart={start} />
  } else if (phase === 'over') {
    body = <Result t={t} num={num} game={game} result={result} names={names} set={settings.symbols} round={round} onRematch={rematch} onChangeMode={toSetup} />
  } else {
    body = <Game t={t} num={num} game={{ ...game, turn }} names={names} set={settings.symbols} scores={scores} round={round}
      status={status} thinking={computerTurn} canUndo={canUndo} onCell={onCell} onUndo={undo} onRestart={restart} onBack={toSetup} />
  }

  const navItem = (id, label, Icon) => (
    <button type="button" className="nav-item" aria-current={view === id ? 'page' : undefined} onClick={() => setView(id)}><Icon />{label}</button>
  )
  return (
    <div className="app">
      <header className="topbar">
        <span className="brand"><Logo />{t.appName}</span>
      </header>
      <nav aria-label={t.mainNav} className="nav">
        {navItem('play', t.play, IconPlay)}{navItem('stats', t.stats, IconStats)}{navItem('settings', t.settings, IconSettings)}
      </nav>
      <main>{body}</main>
    </div>
  )
}
