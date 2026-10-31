# Prototype Instructions

Canonical repository: `netbka/elma_wiki_public`. File public website PRs and issues here. `netbka/elma_wiki` is the separate internal application. The website uses synthetic data only. Keep its current Sites project identity and audience; GitHub source changes do not automatically publish to Sites. See `docs/DEPLOYMENT.md` and `docs/REPOSITORY_MIGRATION.md`.

Owner direction 2026-10-31: expand the first website sketch into a substantive explanation of the product. Preserve the approved calm visual direction. Show recognizable work situations, contextual requests, package work, actual comparisons, role responsibilities and result-specific acceptance. Keep runnable demo behavior distinct from illustrative scenarios. Do not imply a universal self-service SaaS or completed autonomous production delivery. Final package acceptance roles are analyst and product owner.

Latest owner direction: continue code work in this repository; do not update the registered Sites publication unless explicitly asked again. Adopt the actual internal Wiki organization of modules and requests. Preserve module composition, form/process context, element-linked requests, stage/next participant and request detail anatomy, using synthetic browser-local data in the public project.

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.
