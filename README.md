# Tic-Tac-Toe

A tic-tac-toe game for two players or against the computer, with a move log, stats history, English and Persian (RTL) support, and light and night themes.

Credit: the original board was built following the Academind React course, then extended.

## Features

- **Modes:** 2 players (pass the phone) or vs computer.
- **AI levels:** Easy (random moves), Medium (wins when it can, usually blocks), Unbeatable (minimax, never loses). Choose who starts: you, the computer, or random.
- **Move log:** every move with its position, plus the winning move and line on the result screen.
- **Stats:** played, won, drawn and lost totals, a filterable game list, and clear history. History and settings are kept in `localStorage`. If the browser blocks storage, the app falls back to in-memory state and shows a warning on the Stats screen.
- **Settings:** player names, symbol sets, move and win sounds, theme (light, night or system), and language (English or فارسی with RTL layout).

## Scripts

```sh
npm install
npm run dev          # development server
npm run build        # production build to dist/
npm run lint         # eslint
npm test             # unit tests (vitest)
npm run e2e          # end-to-end tests (playwright, starts its own dev server on port 5199)
npm run build:demo   # static demo build to dist-demo/, base path /demos/tic-tac-toe/, with a demo banner
```

The first e2e run needs `npx playwright install chromium`.

## Structure

- `src/App.jsx`: top-level state, game flow, settings and navigation.
- `src/components/`: screens (Setup, Game, Result, Stats, Settings) and small pieces (MoveLog, Mark, Icons).
- `src/game/logic.js`: board helpers, winner and draw detection.
- `src/game/ai.js`: computer move selection for each level.
- `src/storage.js`: localStorage persistence with an in-memory fallback when storage is blocked.
- `src/i18n.js`: English and Persian strings.
- `e2e/`: Playwright flow tests. `src/**/*.test.js`: Vitest unit tests.

## Assets

Fonts are bundled from Fontsource (Bricolage Grotesque and Vazirmatn, SIL Open Font License 1.1).
