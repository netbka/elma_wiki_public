# UX contract

## Scope
RU/EN marketing site, synthetic contract-approval walkthrough, author introduction, contact preview and launch notes. Frontend only. Private Sites preview until the owner chooses a public launch.

## Primary journey
Home -> Try -> Context -> editable request and threshold -> prepared solution -> before/after + three boundary checks -> two-role acceptance -> result. A changed threshold determines the synthetic routing condition. Request prose is preserved verbatim and is not interpreted by an AI.

## State ownership
- Demo component persists synthetic progress in `localStorage` under `elma-wiki-public-demo-v1`; bounded validation and storage-failure feedback. No cross-device persistence or authentication.
- Contact fields are component memory only. Preview explicitly says not sent. No network call or Gmail integration.
- Language is page-session state; demo user-authored text is not translated or overwritten.
- Hash route is shareable and browser back works. Shared header/footer identify all pages.

## Product explanation

Additional routes: `#capabilities`, `#examples`, `#team`. They explain the product and use synthetic examples. Workspace and scenario selectors change local page state only; they do not create a request or call AIWorks. Choices expose pressed state and retain keyboard focus. The runnable approval example remains at `#demo`; other scenarios are labeled illustrative. Language switches update all explanatory content without changing demo records. Roles in acceptance are analyst and product owner.

## Capability ownership
Form: labeled native inputs with inline errors, first error focus, max lengths and numeric threshold constraints. Success is preview only.
Scrollbar: global themed scrollbar, no nested cosmetic scroll containers, document owns scroll. Textarea grows with content up to a bounded editing size.
Toast: no transient toast. Inline live status persists next to the demo and explains save availability.
Navigation: main landmark, focus on route change, accessible current page, mobile disclosure with Escape and focus return.
Dialog: native modal, explicit cancel and reset; reset only deletes this browser's sample progress.

## Verification
Build and worker contract tests; browser checks for mobile/desktop, navigation, RU/EN, validation, full demo, disabled acceptance, reload persistence and reset cancel/confirm. Compare actual home render to source visual. Record evidence in design-qa.md.
