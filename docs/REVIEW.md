# MVP review

Reviewed: 16 October 2026. Status: implemented and verified within the limits below.

## What was built

One dashboard at `/`, using Next.js, TypeScript, and Tailwind through PostCSS. The static page introduces Asta and Lucifero and uses the three supplied images. `components/training-plan.tsx` is the only Client Component: it contains completion, derived progress, and browser-local persistence. The fixed task content lives in `lib/training-tasks.ts`.

The successful POC interaction is reused: completed IDs are the source of truth, count is their length, and percentage is rounded count / 3 × 100. Loaded IDs are filtered through the three known tasks, so duplicate or unknown stored IDs cannot inflate the count. Browser saving is restored after hydration before controls are enabled; initial empty state never overwrites it.

## MVP acceptance results

| Criterion | Actual result | Evidence |
| --- | --- | --- |
| Introduces Asta’s goal and Lucifero’s threat briefly | Pass: named dashboard, opponent portrait, and brief confrontation/training introduction. | Browser content checks and screenshots. |
| Three tasks, descriptions, priorities | Pass: exact PRD text and fixed order; High, Medium, High. | Exact text assertions for all three cards. |
| Complete and undo every task | Pass: all eight combinations and 20 repeated toggles. | 42 state checks in both development and production. |
| Count and percentage match states | Pass: checked control count, visible count, percentage, fill width and accessible progress value agree. | All eight combinations checked in the state and MVP runners. |
| Starts at zero; never below 0% or above 100% | Pass: fresh browser starts at 0 / 3 and 0%; saved valid state restores for returning visitors. Duplicate/unknown IDs cannot inflate progress. | Initial, combination, and malformed-storage checks. |
| Explains preparation-plan completion | Pass: visible “Progress measures preparation-plan completion.” | Browser text assertion. |
| Keyboard and visible focus | Pass: Tab reaches skip link and all three checkboxes in order; Space toggles; focus remains; computed 3px outline. | Keyboard assertions and focus screenshot. |
| Readable around 360px and desktop | Pass in Chromium at 320px, 360px and 1440px, with no horizontal scrolling, 16px descriptions and minimum 44 × 44px control targets; screenshots inspected. | Three viewport checks and production screenshots. |
| Refresh matches PRD | Pass: completion and undo persist; corrupt or blocked storage does not crash and displays a warning; toggles remain usable. | State results. |
| No pretend decorative buttons | Pass: no dashboard buttons or extra navigation; only three task controls and a working skip link. | DOM assertions and source inspection. |
| No credentials in repository | No credentials found: source inspection, signature scan across text files, and no environment files in the application worktree. | Repository scan JSON. This scan is not a proof against every possible credential format or historical commit. |
| Agreed scope | Pass: one application page, no custom API routes, login, database, payments, chatbot, simulation, task editing, sorting or added actions. | Source inspection and route output. Next.js supplies its built-in not-found response. |

## Additional PRD checks

- Clear Complete / Incomplete status text, checked state, and checkmarks do not rely on colour alone.
- The progress bar is labelled and exposes minimum, maximum and current values; empty at 0%, full at 100%.
- Two toggles restore the prior state; independent tasks retain their values.
- Task checkbox names and descriptions are associated through labels and ARIA references.
- A polite, atomic live region contains the updated count and percentage. Markup was verified; actual spoken screen-reader output remains untested.
- Exactly three predefined tasks and no additional user actions were added.

## Commands actually run

- `npm run lint`: passed, no errors or warnings.
- `npm run build`: passed with Webpack; TypeScript and static page generation succeeded.
- `npm run dev`: fresh start succeeded and served the dashboard on port 3000. This command requires no extra compiler flags.
- `npm run start -- --hostname 127.0.0.1 --port 3001`: production server started and served the built dashboard.
- `node scripts/check-poc.cjs`: 42 state assertions passed against each server using the bundled Playwright module through NODE_PATH; 20 repeated toggles, all eight combinations, persistence, keyboard controls, corrupt data, duplicate/unknown IDs and blocked storage.
- `node scripts/check-mvp.cjs`: 12 check groups passed against each server, covering content, progress, keyboard/focus, accessibility markup, viewport layouts, controls, images and contrast. Zero page errors, console errors or failed HTTP responses in the successful runs.
- `node scripts/check-repository.cjs`: one page, one Client Component, Webpack scripts, no detected credential signatures or environment files.
- `git diff --check`: passed after removing an extra blank line.
- File hashes confirm the three local JPGs exactly match the supplied originals.

An initial production attempt reused old POC CSS despite reporting a successful build. Browser checks caught the resulting image overlap and blocked task clicks. Clearing generated `.next` output and rebuilding produced the current stylesheet; production interaction and visual checks then passed. No passing result is claimed for that initial attempt.

## Measured contrast

Opaque panels keep text independent of the background artwork. Measured ratios: primary text 16.51:1, secondary text 9.16:1, crimson text 5.35:1, and gold text 9.36:1 against the panel. Progress fill against its track is 3.35:1; unchecked checkbox boundary against the panel is 5.90:1. Focus uses gold against dark surfaces. Decorative panel and badge borders are not essential control boundaries.

## Evidence

- Desktop, production (historical evidence retained in Git history).
- 360px mobile, production (historical evidence retained in Git history).
- 320px mobile, production (historical evidence retained in Git history).
- Keyboard focus, production (historical evidence retained in Git history).
- Production MVP checks (historical evidence retained in Git history).
- Development MVP checks (historical evidence retained in Git history).
- 42 state assertions, production (historical evidence retained in Git history).
- Repository check (historical evidence retained in Git history).

## Not verified

Actual spoken screen-reader announcements, physical mobile devices, Firefox/Safari/Edge, every operating-system rendering, exhaustive credential formats or full Git history, and pixel-perfect equivalence to every Stitch detail were not verified. No user research or product validation is claimed. Storage remains local to this browser/site address; no cross-device or live cross-tab sync is included.

## Character layout follow-up (16 October 2026)

Implemented the newly requested Lucifero/Asta character sidebar with descriptions and two native disclosures. Task state and persistence code were not changed. Both disclosures open and close with Enter and have a visible focus outline. Automated layout checks place the sidebar left of the plan at 1440px and after the plan at 360px. No horizontal overflow was found at 320px, 360px or desktop width. The restored background loads at 1672 × 941 with no CSS blur, and all five image placements load successfully.

`npm run lint` and `npm run build` passed. The 42 state checks passed against production, and 14 UI check groups passed against development and production, with no page errors, console errors or failed HTTP responses in successful runs. The UI runner now waits for saved-state loading before making its refresh assertion.

New evidence is stored separately from the earlier MVP screenshots: [desktop](evidence/characters-desktop.png), [mobile](evidence/characters-mobile.png), development checks (historical evidence retained in Git history), and production checks (historical evidence retained in Git history). The restored image is an AI derivative; exact source detail preservation is not claimed. Previous screen-reader, browser and physical-device verification limitations still apply.

## Evidence cleanup

The canonical documentation now lives in this repository's `docs/` directory. The duplicate workspace-level documentation was removed. Six selected screenshots and their index remain in `docs/evidence/`; raw JSON test outputs and intermediate screenshots are retained only in earlier Git history. The recorded test results above describe runs that occurred before cleanup, not new test runs. Browser check scripts remain available to reproduce those results.
