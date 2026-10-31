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

## Modules and requests workspace

Routes: `#modules`, `#modules/<id>`, `#requests`, `#requests/<id>`, `#requests/new`. Canonical data and state are in `src/workspace/model.mjs`; synthetic configuration is in `modules-data.mjs`. All public workflow data is local, separate from the original acceptance demo key.

| Capability | Owner | Observable contract |
| --- | --- | --- |
| Navigation | Workspace.jsx and Site.jsx | Module/place selection and list filters live in the hash query. Query-only updates preserve focus and scroll; a new page focuses main. Detail links retain list filters |
| Search and filters | Requests.jsx | Local search with explicit clear and result count, native module/stage select, show-closed toggle; no remote search or simulated identity |
| Form | RequestEditor | Native selects accept OS popup geometry. Concrete module/place, title and context required. Changes require expected behavior; questions may keep optional context. Invalid input focuses the first field; errors retain entered text |
| Storage | model.mjs / useWorkspace.js | Validated versioned localStorage; read before write rejects a stale revision; corrupt data loads samples with a notice. Storage failure keeps current-tab work in memory and warns that refresh will lose it |
| Create | Workspace.jsx | A new local request appears in the owning list, highlighted and linked to its exact canonical module element |
| Comment | RequestDetail / model.mjs | Plain text local comment, recorded with time, no implied AI execution or stage transition |
| Feedback | Workspace banner / inline notices | Persistent local-only notice, storage/conflict feedback, field errors and comment result; no transient toast |
| Table | Requests.jsx / Modules.jsx | Semantic columns; horizontal scroll belongs to the table frame on narrow screens |
| Selection | Modules.jsx | Form, process, place and request selection are URL-backed. Sample fields select context; they do not edit ELMA business records |

Unknown module/request routes show a recovery link. No sign-in or permission simulation is introduced. Sample stage/turn labels share one mapping; users cannot falsely mark a live result accepted. Source anatomy and exclusions: `docs/WORKSPACE_ADAPTATION.md`.

Workspace state is owned by App so memory-only records survive navigation to explanatory pages. Unsaved request drafts are retained in tab memory per origin module/place across browser Back/Forward. Anchor navigation offers an app-owned discard dialog; explicit discard or successful create clears the draft. Refresh still uses the browser unload warning for an unsaved draft.

### Canonical UI Map

| Capability | Canonical owner | Source of truth | Allowed variants | Verification |
| --- | --- | --- | --- | --- |
| Select/Listbox | Requests.jsx native select | UX-CONTRACT.md | OS-owned module, stage and place choices | Browser selection and keyboard |
| Form | RequestEditor and RequestDetail | model.mjs validation | Create request, add comment | workspace.test.mjs and browser flow |
| CRUD | Workspace.jsx / useWorkspace.js | model.mjs | Local create and comment only | workspace.test.mjs and reload |
| Scrollbar | styles.css and table frames | DESIGN.md | Document scroll; table overflow | Narrow viewport inspection |
| Navigation | Site.jsx / Workspace.jsx | Hash paths and queries | List, detail, module, element | Browser back, filters, focus |
| Feedback | Workspace banner and inline regions | UX-CONTRACT.md | Persistent status and field errors | Failure tests and browser validation |
