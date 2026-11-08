import { IconDuo, IconRobot, Logo } from './Icons.jsx'

function Seg({ label, value, options, onChange, className = '' }) {
  return (
    <div role="group" aria-label={label} className={`seg ${className}`}>
      {options.map(([v, text]) => (
        <button key={v} type="button" aria-pressed={value === v} onClick={() => onChange(v)}>{text}</button>
      ))}
    </div>
  )
}
export { Seg }

export default function Setup({ t, setup, onChange, onStart }) {
  return (
    <section className="screen setup" aria-labelledby="setup-title">
      <header className="hero">
        <Logo />
        <h1 id="setup-title">{t.appName}</h1>
      </header>
      <div className="block">
        <h2>{t.chooseMode}</h2>
        <button type="button" className="mode-card" aria-pressed={setup.mode === 'pvp'} onClick={() => onChange({ mode: 'pvp' })}>
          <IconDuo /><span><strong>{t.pvp}</strong><small>{t.pvpHint}</small></span>
        </button>
        <button type="button" className="mode-card" aria-pressed={setup.mode === 'ai'} onClick={() => onChange({ mode: 'ai' })}>
          <IconRobot /><span><strong>{t.ai}</strong><small>{t.aiHint}</small></span>
        </button>
      </div>
      {setup.mode === 'ai' && (
        <>
          <div className="block">
            <h2>{t.difficulty}</h2>
            <Seg label={t.difficulty} value={setup.level} onChange={(level) => onChange({ level })}
              options={[['easy', t.easy], ['medium', t.medium], ['unbeatable', t.unbeatable]]} />
            <p className="hint">{t.levelHint[setup.level]}</p>
          </div>
          <div className="block">
            <h2>{t.whoStarts}</h2>
            <Seg label={t.whoStarts} value={setup.who} onChange={(who) => onChange({ who })}
              options={[['you', t.you], ['computer', t.computer], ['random', t.random]]} />
          </div>
        </>
      )}
      <button type="button" className="btn primary big" onClick={onStart}>{t.startGame}</button>
    </section>
  )
}
