---
name: ELMA Wiki public prototype
description: A calm, mobile-first product introduction and synthetic change-review demo.
---

# Overview
Product presentation with a task-oriented demo. The first approved concept supplies the homepage hierarchy; the other concepts inform the step-by-step demo and author story. A responsive website, not a device-framed mobile app. The user asked to combine the concepts into one navigable Site.

Approved on 2026-11-01: the website should bring new automation projects around ELMA and connected systems. The primary visitor is responsible for ELMA development at the customer. The main takeaway is the full journey from request to production. Collaboration starts by examining one task and takes it through release. The primary evidence is a completed task with its result in production. Start with a short explanation, then show the case. See `docs/POSITIONING_BRIEF.md` for the approved foundation and proposed narrative. Existing layouts are a baseline for concrete redesign; exact copy and composition are not yet approved. Author attribution belongs in the footer/about page.

# Colors
Ink #1f2328, secondary text #59636e, white canvas, surface #f6f8fa, border #d1d9e0. Primary action #1f883d; hover #1a7f37. Links and focus #0969da. Error #cf222e. Success surface #dafbe1. Palette follows the existing project's Primer direction.

# Typography
System UI sans-serif; Cyrillic support without remote fonts. Desktop hero 54px, mobile 36px, mobile page title 34px. Body 16px. Dense supporting UI 12-14px. Weight 600 for action and status. Restrained negative tracking on headings.

# Layout and spacing
1168px desktop container, 32px outer desktop margins, 24px mobile margins. Desktop hero has copy and interface sample in two columns, stacked below 800px. Reading content max width 820px. Spacing rhythm 8, 12, 16, 24, 32, 48, 72. No fixed-height page or phone bezel. Real page scrolling.

# Elevation and shape
Flat surfaces, 1px borders, 5-7px component radii. No decorative shadows or gradients. Native dialog overlay for reset confirmation only.

# Components
Shared header, RU/EN switch, mobile disclosure navigation, prominent green primary action, restrained product interface sample, five-step demo, condition form, process comparison, three boundary tests, two-role acceptance, local result record, contact form preview and launch explanation.
Octicons package supplies standard icons. No generated raster UI in the implementation. The wordmark is plain text as in the source concept.

Content expansion: shared section headings, question rows and a handoff record introduce the deeper story. Capabilities, scenarios and team pages use the same tokens and buttons. The signature remains a readable example of real work, not a decorative graphic. Scenario selectors and the workspace sample are local educational views. Their labels must identify sample content. Use document scrolling, stack reading columns on small screens and collapse the expanded header below 1050px. Runtime values remain owned by `src/styles.css`; `story.css` and `product-pages.css` reuse its CSS variables.

# Behavior and accessibility
48px primary targets, 44px minimum auxiliary targets. Visible keyboard focus, main-content skip link, named controls and native dialog. Hash navigation changes title and focuses main. Demo step changes focus the active panel. Responsive layouts at 320px and up. Reduced motion and forced colors supported. Errors are inline and announced. Acceptance requires all checks and both roles.

# Do and don't
Keep product claims concrete and connected to the project. Distinguish synthetic calculations from live AIWorks and ELMA integration. Preserve human responsibility for acceptance. Do not fabricate statistics, testimonials or sent-mail confirmations. Do not use real customer or repository data in the demo.

# Modules and requests

The local workspace adapts the actual Wiki anatomy: module composition, selected form/process and element details; request stage and next participant, context and discussion. Existing color tokens and typography remain canonical in styles.css. Workspace-specific selectors are scoped in src/workspace/*.css. Lists use compact working UI rather than marketing cards. On narrow widths, module panes stack; request tables prioritize number, title and stage, while detail retains the secondary metadata. Native selects keep platform-owned popup geometry.
