let ctx
export function beep(kind) {
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)()
    const o = ctx.createOscillator(), g = ctx.createGain()
    o.frequency.value = { x: 520, o: 400, win: 780, draw: 260 }[kind] || 440
    g.gain.value = 0.05
    o.connect(g); g.connect(ctx.destination)
    o.start(); o.stop(ctx.currentTime + (kind === 'win' ? 0.3 : 0.1))
  } catch { /* audio unavailable: stay silent */ }
}
