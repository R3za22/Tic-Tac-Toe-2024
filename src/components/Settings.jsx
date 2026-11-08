import { useState } from 'react'
import { Seg } from './Setup.jsx'
import Mark from './Mark.jsx'
import { NAME_MAX } from '../storage.js'

export default function Settings({ t, settings, onChange, onSaveNames, onDone }) {
  const [x, setX] = useState(settings.nameX)
  const [o, setO] = useState(settings.nameO)
  const bad = (v) => v.trim().length === 0 || v.trim().length > NAME_MAX
  const [showErr, setShowErr] = useState(false)
  function save() {
    if (bad(x) || bad(o)) { setShowErr(true); return }
    onSaveNames(x.trim(), o.trim())
    onDone()
  }
  const field = (id, label, v, set) => (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} type="text" value={v} maxLength={NAME_MAX + 8} aria-invalid={showErr && bad(v)} onChange={(e) => set(e.target.value)} />
      {showErr && bad(v) && <span className="err">{t.nameError}</span>}
    </div>
  )
  return (
    <section className="screen settings" aria-labelledby="settings-title">
      <header className="bar"><h1 id="settings-title">{t.settings}</h1></header>
      <div className="block">
        <h2>{t.players}</h2>
        <div className="fields">{field('px', t.player1, x, setX)}{field('po', t.player2, o, setO)}</div>
        <span className="hint">{t.nameHint}</span>
      </div>
      <div className="block">
        <h2>{t.symbols}</h2>
        <div role="group" aria-label={t.symbolSet} className="symbol-sets">
          {['classic', 'plus', 'block'].map((s) => (
            <button key={s} type="button" aria-pressed={settings.symbols === s} onClick={() => onChange({ symbols: s })}>
              <span className="pair"><Mark player="X" set={s} /><Mark player="O" set={s} /></span>{t.sets[s]}
            </button>
          ))}
        </div>
      </div>
      <div className="block row">
        <span><strong>{t.soundLabel}</strong><small>{t.soundHint}</small></span>
        <button type="button" role="switch" aria-checked={settings.sound} aria-label={t.soundLabel} className="switch" onClick={() => onChange({ sound: !settings.sound })}><span><i /></span></button>
      </div>
      <div className="block">
        <h2>{t.appearance}</h2>
        <Seg label={t.theme} value={settings.theme} onChange={(theme) => onChange({ theme })} options={[['light', t.light], ['night', t.night], ['system', t.system]]} />
        <Seg label={t.language} value={settings.lang} onChange={(lang) => onChange({ lang })} options={[['en', 'English'], ['fa', 'فارسی']]} />
      </div>
      <button type="button" className="btn primary big" onClick={save}>{t.save}</button>
    </section>
  )
}
