# Prototype Instructions

Canonical repository: `netbka/elma_wiki_public`. File public website PRs and issues here. `netbka/elma_wiki` is the separate internal application. The website uses synthetic data only. Keep its current Sites project identity and follow the approved choices in `docs/POSITIONING_BRIEF.md`; GitHub source changes do not automatically publish to Sites. See `docs/DEPLOYMENT.md` and `docs/REPOSITORY_MIGRATION.md`.

Owner direction 2026-10-31: expand the first website sketch into a substantive explanation of the product. Preserve the approved calm visual direction. Show recognizable work situations, contextual requests, package work, actual comparisons, role responsibilities and result-specific acceptance. Keep runnable demo behavior distinct from illustrative scenarios. Do not imply a universal self-service SaaS. Keep human approvals and deployment responsibilities visible. Final package acceptance roles are analyst and product owner.

Latest owner direction: continue code work in this repository; do not update the registered Sites publication unless explicitly asked again. Adopt the actual internal Wiki organization of modules and requests. Preserve module composition, form/process context, element-linked requests, stage/next participant and request detail anatomy, using synthetic browser-local data in the public project.

Owner direction 2026-11-01: pause further design/content expansion until the website's primary audience, goal, core demonstration and visitor outcome are discussed. Existing breadth is not an approved positioning brief. Keep the author's name out of the first screen; attribution belongs in the footer/about page. Do not treat proposed audiences or formats as approved decisions.

Owner clarification: the real ELMA Wiki workflow already works end to end, including release to production. Use this as the current product status; do not infer product incompleteness from the browser-local public demo or an earlier source review. When a user choice is needed, use the available interactive question tool, with no more than three questions per round.

Approved positioning choices 2026-11-01: the site should bring new automation projects; its primary visitor is the person responsible for ELMA development at the customer; its primary takeaway is the full journey from request to production. The owner selected all four recognizable customer situations: a growing change backlog, manual work around ELMA, requirements lost between participants and difficulty verifying results. Project scope is ELMA and connected systems. The first step toward collaboration is to examine one task; the engagement takes the task through release. Primary evidence is a completed task with its result in production. Visitors start with a short explanation, then the case. These fundamental choices are settled. Use `docs/POSITIONING_BRIEF.md` for the approved foundation and its proposed narrative. Continue with concrete case content and page structure; do not reask settled choices or treat the proposed exact copy/layout as already approved.

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.
