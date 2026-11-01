# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Public RU/EN marketing site and scripted demo for ELMA Wiki: a frontend-only React 19 + Vite SPA. This repository (`netbka/elma_wiki_public`) is the canonical home for the site's source, PRs and issues. `netbka/elma_wiki` is a separate internal application; do not file website work there.

## Commands

Node.js 22 and npm.

```sh
npm ci                # install
npm run dev           # Vite dev server
npm run build         # vite build, then scripts/prepare-sites-build.mjs
npm run preview       # serve the built client
npm run test:sites    # node:test worker and packaging contract; run after build
npm run test:workspace # workspace contract
npm run test:contact  # contact service and form client; needs no build
npm run server        # contact service; needs the env settings in docs/DEPLOYMENT.md
node --test --test-name-pattern="falls back" tests/sites-worker.test.mjs   # single test
```

- `test:sites` fails without a prior `npm run build`: its last test checks for files in `dist/`.
- CI (`.github/workflows/ci.yml`) runs `npm ci`, `build`, `test:sites`, `test:workspace`, `test:contact`. There is no linter, and no component tests for the UI in `src/`; UI behaviour is verified in a browser against `UX-CONTRACT.md`, with evidence recorded in `design-qa.md`.
- Run the dev server yourself and check the page in a browser instead of telling the user to start it.

## Architecture

**Routing and language live in `src/Site.jsx`.** `App` (re-exported through `src/App.jsx`) holds the `lang` and `page` state. Pages are hash routes (`#home`, `#demo`, `#how`, `#about`, `#contact`, `#launch`), rendered by `page === '...'` conditionals, so static hosting needs no server routing. A route change closes the mobile menu, scrolls to top and moves focus to `main`.

**Copy is inline, not in a dictionary.** Translations are written at the call site as `t('русский', 'English')`, and `App` passes `t` down as a prop. Every visible string needs both languages. Language is session state and is not persisted.

**`src/` is written very densely.** `Site.jsx`, `Demo.jsx`, `Contact.jsx` and `styles.css` have 10-35 very long lines each (about 20 KB in `Site.jsx`), so search for a string instead of reading by line number, and expect a whole page's JSX on one line. `Demo.jsx` and `Contact.jsx` import the `Intro`/`Link` helpers back from `Site.jsx`, which imports them: a circular import that works because the helpers are only used at render time.

**State ownership (see `UX-CONTRACT.md`).**
- The demo persists to `localStorage` under `elma-wiki-public-demo-v1`. `readDemo()` in `Demo.jsx` validates the stored shape and falls back to `INITIAL`; update that validation when the shape changes. Storage failure is reported inline.
- Contact fields stay in component memory until submit. `VITE_CONTACT_ENDPOINT` is read at build time: unset, the form only previews, says it was not sent and makes no network call; set, it posts to the contact service. Sites has no such service, so the variable must stay unset there.
- The demo is a prepared scenario with synthetic data. It never calls ELMA or AIWorks, and request text is kept verbatim rather than interpreted.

**Two hosting outputs from one build.** `dist/client/` is the static site and is all that ordinary static hosting needs. For OpenAI Sites, `prepare-sites-build.mjs` also copies `worker/index.js` to `dist/server/index.js` and `.openai/hosting.json` to `dist/.openai/hosting.json`. The Worker serves assets and falls back to `index.html` only for 404s on HTML GET/HEAD requests, so missing API or write requests stay 404.

**Contact service (`server/`) is a separate Node process, not part of the Worker.** `contact-handler.mjs` works on Web `Request`/`Response` with injected store and mailer, so the host-specific parts are `app.mjs` (node:http), `file-store.mjs` and `smtp-mailer.mjs`. The order matters: validate, recognise a repeated id, rate-limit, store durably, then mail. A mail failure still answers 202 because the request is safe on disk; `retryPending` delivers it later, and `purgeExpired` removes delivered requests older than `CONTACT_RETENTION_DAYS`. The client-generated UUID makes retries idempotent, so `Contact.jsx` reuses it for unchanged text and drops it on any edit.

## Constraints

- Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs` and `tests/sites-worker.test.mjs` intact: they are the Sites handoff. Preserve the `project_id` in `hosting.json`, and never create a second Site for a normal update.
- A push to GitHub does not publish. The live prototype (owner-only, https://elma-wiki-peter-preview.netbka.chatgpt.site/) is updated by hand through Sites; see `docs/DEPLOYMENT.md`. Changing its audience is the owner's decision.
- This repository is public and the site uses synthetic data only: no real customer or repository data in the demo, and no fabricated statistics, testimonials or sent-mail confirmations (`DESIGN.md`).
- Follow `DESIGN.md` for visual work: Primer-based palette, system fonts, flat surfaces with 1px borders, Octicons for icons, document-owned scrolling, no toasts. Accessibility behaviour in `UX-CONTRACT.md` (focus handling, inline errors, native dialog) is part of the contract.
- When implementing from a selected generated mock, treat the image as the source of truth for layout and visual detail.
- Record durable design feedback from the user in `AGENTS.md`.
