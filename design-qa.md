# Design QA

Latest implementation review: [approved project positioning in code, 2026-11-01](docs/qa/implementation-2026-11-01/README.md). Homepage, real cases, human decisions and .e365/AIWorks execution now follow the agreed brief. The earlier evidence below records the original baseline.

Follow-up to that review: page metadata matches the approved positioning and keeps the author's name out of search snippets; the AIWorks label on `#how` passes 4.5:1 on the surface colour; `#contact` no longer skips a heading level. Contrast and heading order were measured on all routes in desktop Chrome, and overflow on home, cases, how, contact and about at 11 widths from 320 to 1280 px in RU and EN.

final result: passed (original prototype review; migration verification recorded separately)

## Visual truth and evidence
- Source: the generated homepage concept, 853 x 1844 pixels, preserved as the left side of `docs/qa/home-comparison.jpg`. First concept selected as homepage direction when the owner asked to combine all concepts into one website.
- Source normalized to 390 x 844 for comparison. Portrait aspect rounding is below 0.1%.
- Implementation: `docs/qa/elma-home-mobile-v3.jpg`, 390 x 844, captured in the cloud browser using a real 390 x 844 CSS iframe viewport. Native scrollbar makes document content width 380 CSS px. The surrounding browser capture was cropped out, not treated as application content. Pixel-to-CSS comparison scale is 1:1.
- Combined full-view comparison: `docs/qa/home-comparison.jpg` (source left, implementation right).
- Combined focused interface-sample comparison: `docs/qa/sample-comparison.jpg`. This makes the actual labels, icon, dividers and action readable at native density.
- Desktop screenshot: `docs/qa/home-desktop.jpg`, 1353 x 929 pixels. Two-column hero with full navigation.
- Narrow layout: `docs/qa/home-320-final.jpg`, 320 x 844. Native scrollbar leaves 310 CSS px, with document scroll width also 310.
- State: light, Russian, homepage, initial sample; desktop and mobile use the same application. The temporary responsive test harness was removed before the production build.

## Findings and iteration history
1. [P2, fixed] Mobile headline wrapped into three lines at 390px and long introductory copy pushed the example out of the first viewport. Evidence: an earlier mobile capture, compared with the normalized source in one image input. Fix: concise source-aligned description, 33px mobile heading with adjusted tracking, reduced hero spacing. Recaptured as mobile v2, then v3.
2. [P2, fixed] Sample interface in v2 was too tall. It included an extra subtitle and oversized internal spacing. Fix: omit the redundant mobile subtitle, tighten sample padding/type, shorten truthful status copy. Post-fix evidence: both combined comparisons above. The source's sample reviewer name was intentionally removed because no such review occurs on the public homepage.
3. [P2, fixed] At 320px, a 320px body minimum plus the desktop scrollbar caused 10px horizontal overflow. Fix: remove body minimum, adjust the narrow margin and allow dense test rows to wrap. Browser DOM reports clientWidth = scrollWidth = 310. Recaptured narrow screenshot above.
4. [P2, fixed] Route-change focus scrolled the header out of view after navigation. Fix: focus main with preventScroll. Browser-confirmed header top = 0 after navigating from demo to home. Final desktop capture includes the header.
5. [P3, addressed] Contact preview replaced the form without a focus destination. Added focus to the preview heading and back to the first field on edit. Original empty-form errors already focused the first invalid field.

No actionable P0/P1/P2 findings remain.

## Required fidelity surfaces
- Fonts and typography: system sans family with Cyrillic fallback, restrained bold headings and regular body text. Mobile headline is two lines at 390px; at 320px it wraps naturally without clipping. Exact generated letterforms are not a font asset, so the system-font interpretation is intentional. Labels and button text remain readable.
- Spacing and layout: top-level order matches the selected concept. Hero, actions and product sample occupy comparable regions. Source sample begins around y404 and implementation around y410. Implementation sample is slightly taller because the live controls have practical target sizes. Desktop two-column structure is an intentional responsive extension. Mobile next section has a pale surface separating the longer narrative.
- Colors and tokens: Primer-like white/gray palette, restrained green action and success status, blue links, visible borders. Flat green replaces generated raster color noise. Focus is blue and errors are red; status is also conveyed in text.
- Image quality and assets: no photographic or illustrative assets in the chosen concept. Text wordmark, genuine UI and standard Octicons render sharply. No fabricated SVG artwork, screenshot-as-page, placeholder avatar or CSS illustration.
- Copy/content: concrete ELMA workflow. Homepage action opens the demo; no fake reviewer or success claim. The prepared analysis and local saving are identified as a simulation. Contact preview explicitly does not send. User-authored prose is kept as entered when interface language changes.

## Functional checks
- Desktop build and all four Sites Worker contract tests passed.
- Strict frontend audit passed with zero findings. Textarea styling is explicit, auto-growing with bounded edit area.
- Mobile menu opens, navigates and closes on selection. Shared nav, home, demo, how, about, contact and launch routes were exercised.
- Empty demo request shows an inline error and focuses the input.
- Changed threshold to 500,000; solution used that threshold. Tests at 499,999, 500,000 and 500,001 produced the expected standard/standard/finance routes.
- Acceptance disabled before checks; enabled only after three checks and both role confirmations. Result records request and threshold.
- Full navigation reload preserved the accepted result. Reset cancel retained it; reset confirm restored the initial scenario.
- Empty contact form identified email and message errors; valid synthetic data produced a preview with an explicit not-sent message.
- EN switch updated navigation, contact and form-preview labels; user-entered text remained unchanged.
- Console logs checked: no application errors/warnings. Browser-extension metadata errors were identified by chrome-extension URLs and excluded from app findings.
- No horizontal overflow in observed desktop and mobile document widths.

## Residual test gaps and intentional limits
Real iOS Safari and Russian carrier networks are not available in this browser environment. No live Gmail, AIWorks or ELMA connection exists. Local browser storage does not provide account-based or cross-device persistence. Site audience remains owner-private for review. These are scope limits, not unimplemented demo controls.

## Implementation checklist
- [x] Unify navigation and content
- [x] Implement synthetic interactive journey
- [x] Compare normalized source and browser render
- [x] Fix all P0/P1/P2 findings and recapture
- [x] Validate responsive widths, form errors, persistence and acceptance
- [x] Remove temporary QA harness
- [x] Original Sites version 1 published from `b248c6d456ca495f23bb747c1a48c3a03056cf86` (confirmed through Sites version metadata during migration).

## Contact form delivery

Browser check in desktop Chrome, 31 October 2026, against the running service with a stub mailer. Not checked: a real Gmail send, phone widths, iOS Safari.

- With `VITE_CONTACT_ENDPOINT`: empty form shows inline errors and focuses the first one. Submit disables the button and shows the sending label. A confirmed answer shows the received state and focuses its heading; the stub mailer received one mail.
- Service stopped: inline error, focus on the error, text kept in the form. After a restart the same text was accepted on retry.
- Without the variable: preview says nothing was sent, no honeypot field, zero `fetch` calls.

## Repository migration

Application source and runtime behavior are unchanged. This is the retained original visual review, not a new browser or iOS Safari test. Migration build and Worker results are recorded in the import PR. See `docs/REPOSITORY_MIGRATION.md`.
