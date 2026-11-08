# Tic-Tac-Toe (2024)

A two-player tic-tac-toe game with editable player names, a move log, win/draw detection and rematch.

> **Course project.** Built in 2024 while following the project from a React course (React - The Complete Guide, "Tic-Tac-Toe" section). The design and structure come from the course; I typed it through, fixed a file-name casing bug that broke Linux builds, and bundled the fonts locally.

**Stack:** React 18, Vite 4, plain CSS.

## Run

```sh
npm install
npm run dev          # development
npm run build:demo   # static build to dist-demo/, base path /demos/tic-tac-toe/, with a demo banner
```

## Assets and licences

- Fonts Caprasimo and Roboto Slab, bundled from Fontsource (SIL OFL 1.1; licence files in `src/assets/fonts/`).
- `public/game-logo.png`, `bg-pattern*.png` come from the course's starter files.
