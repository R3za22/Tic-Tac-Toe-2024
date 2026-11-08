// Post-build step for the demo: copy the banner next to the bundle and reference it from index.html.
import fs from 'node:fs'
fs.copyFileSync('demo/banner.js', 'dist-demo/demo-banner.js')
const f = 'dist-demo/index.html'
fs.writeFileSync(f, fs.readFileSync(f, 'utf8').replace('</body>', '<script src="/demos/tic-tac-toe/demo-banner.js"></script></body>'))
