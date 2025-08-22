# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands (npm)
- Install dependencies: npm ci (or npm install)
- Start dev server: npm start (CRACO + CRA dev server at http://localhost:3000)
- Build production bundle: npm run build (outputs to build/)
- Run all tests (Jest via CRA): npm test
- Run a single test file: npm test -- src/App.test.tsx
- Run a single test by name: npm test -- -t "name or pattern"
- Run coverage (non-interactive): CI=true npm test -- --coverage
- Type-check only: npx tsc --noEmit
- Lint (no package script defined): npx eslint src --ext .ts,.tsx [--fix]

## Architecture and high-level structure
- Tooling
  - Create React App + CRACO (webpack alias '@' -> src)
  - TypeScript
  - TailwindCSS with PostCSS (tailwind.config.js, postcss.config.js)
  - UI primitives under src/components/ui (Button, Input, Card, Alert, Separator, ScrollArea) using class-variance-authority and tailwind-merge
- Entry and composition
  - src/index.tsx renders <App/>
  - src/App.tsx currently mounts TAVIPrototype. A second variant exists (SAVIPrototype). To switch, update App.tsx to import and render the other prototype.
- Conversational prototypes (TAVI/SAVI)
  - Flow managed by a Step union type: welcome → auth → menu → transfer.* → authorize → processing → success | error
  - Messages are accumulated as React nodes and rendered in a chat layout with QuickReplies for guided actions
  - AmountSelector encapsulates amount input, validation, and quick chips; CollectQR builds a payment payload and renders a QR (qrcode.react) for “cobro” flows
  - SelfTestPanel performs in-component sanity checks (CEP generation, currency formatting, payload structure)
  - Network awareness (navigator.onLine) gates operations; success overlay UI/sonification is produced on completion
- NLU and acknowledgements (src/lib/nlu.ts)
  - interpret(text): returns a normalized { intent, recipient, amount, concept }
    - If REACT_APP_GEMINI_API_KEY is set, calls Google Generative Language API (model from REACT_APP_GEMINI_MODEL, default gemini-1.5-flash) and parses JSON-only responses
    - Otherwise falls back to a Spanish regex parser (supports send_money, check_balance, collect, share_qr, add_contact, help)
  - generateReply(...): short, formal Spanish acknowledgement; uses LLM when key is present, otherwise deterministic templates
- Styling/tokens
  - Tailwind utilities + custom design tokens live in src/index.css
  - TAVI-specific tokens/classes are defined; prototype-specific classnames (e.g., TAVI-*, SANTI-*) rely on these utilities. When switching prototypes, ensure the expected token set/classes exist in index.css.
- Configuration
  - craco.config.js sets '@' → src (mirrored by tsconfig paths)
  - Jest setup via src/setupTests.ts with @testing-library/jest-dom

## Environment
- Create a root-level .env (CRA reads env at project root) with:
  - REACT_APP_GEMINI_API_KEY=YOUR_KEY
  - REACT_APP_GEMINI_MODEL=gemini-1.5-flash (or another Gemini model)
- Behavior: if REACT_APP_GEMINI_API_KEY is not set, NLU uses the regex fallback and the app remains fully usable.
- Note: a file at src/.env may exist in this repo; CRA does not load env files from src/.env. Prefer .env or .env.local at the project root and avoid committing secrets.

## Key paths
- src/App.tsx — choose which prototype (TAVI/SAVI) is mounted
- src/TAVIPrototype.tsx, src/SAVIPrototype.tsx — main conversational flows and UI
- src/lib/nlu.ts — intent parsing + acknowledgement text (LLM integration with regex fallback)
- src/components/ui/* — reusable UI primitives (shadcn-style)
- craco.config.js — webpack alias configuration

## Notes
- CRA defaults from README.md apply (start, test, build)
- The default CRA sample test (src/App.test.tsx) remains; update it as needed to reflect the current UI

