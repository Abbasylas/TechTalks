# Training progress proof of concept

## Summary

- **Question:** Does progress stay correct when tasks are checked, unchecked, and changed repeatedly?
- **Result:** The first experiment passed 36 state checks, so development continued to the MVP.
- **What changed later:** Browser saving was added. The latest version passed 42 state checks, including refresh and invalid saved data.
- **Decision:** Keep the task-state logic from the POC. See [REVIEW.md](REVIEW.md) for the latest results and [README.md](../README.md) to run the app.

The notes below start with the original plain screen, where progress still reset on refresh.

## Historical experiment — 16 October 2026

Decision: **Continue**.

## Question

Will the count and percentage stay correct when tasks are completed, undone, or changed several times?

## Approach

The first test used a plain Next.js screen with three tasks, native checkboxes, status text, a count, and a percentage. All tasks started incomplete. Artwork, full styling, a database, and browser saving were left for later.

The task array held the completion state. Checking a box updated that task, then the count and percentage were calculated from the completed tasks using `Math.round(completed / total * 100)`. Keeping these values together avoided separate totals falling out of sync.

## Actual test results

The local app was tested in headless Chromium using the bundled Playwright library because the CLI launcher was unavailable. The script, `scripts/check-poc.cjs`, checks that the displayed count and percentage match the checked boxes after each action.

| Action | Actual result | Outcome |
| --- | --- | --- |
| Start with no tasks complete | 0 / 3 and 0% | Pass |
| Complete Sword control | 1 / 3 and 33% | Pass |
| Complete Physical endurance | 2 / 3 and 67% | Pass |
| Complete Team coordination | 3 / 3 and 100% | Pass |
| Undo Sword control | 2 / 3 and 67% | Pass |
| Toggle Sword control 20 times | Alternates between 3 / 3, 100% and 2 / 3, 67%; every result matches checkbox states | Pass |
| Exercise all eight completion combinations | Each count and percentage matches checked tasks, including every one-task and two-task combination | Pass |
| Refresh | Resets to 0 / 3 and 0% | Pass |
| Space completes and undoes a focused checkbox | 1 / 3, 33%, then 0 / 3, 0% | Pass |
| View at 320px | No horizontal page overflow | Pass |

All **36 state checks passed**, with no page errors during the successful run. Lint, TypeScript, and the Webpack production build also passed.

## What went wrong during setup

The default Turbopack server returned HTTP 500 after its CSS worker failed to start with an access-denied error. Retrying outside the sandbox did not help. Switching to Webpack allowed the page to load and the browser checks to pass. Basic CSS kept the experiment readable while this was being resolved. The problem came from the build setup; task-state checks passed once the page was running.

Rounding gives 33% for one task and 67% for two. Adding 33 for every task would stop at 99%, so progress is recalculated from the completed count each time.

## Decision

**Continue** to the MVP. Completion, undo, repeated changes, and all task combinations worked. The next step was to reuse this logic in the agreed design and resolve the development setup. The POC only tested that interaction; it did not cover the full design, spoken screen-reader output, other browsers, or user testing.

## Run and reproduce

From `asta/`, run `npm run dev` and open http://127.0.0.1:3000. Webpack is already selected. Remember that the table above describes the first experiment; the current app remembers progress after a refresh.

To repeat the automated checks, make Playwright available to Node and run `node scripts/check-poc.cjs`. The recorded run used the bundled runtime through `NODE_PATH`. Screenshots and JSON results go to `output/playwright/`; no test dependency was added to the app.

## Evidence and Git history

- Initial state screenshot (historical evidence retained in Git history).
- [After undo screenshot](evidence/poc-after-undo.png): two checked tasks, 2 / 3 completed, 67%.
- 320px screenshot (historical evidence retained in Git history).
- Actual browser results (historical evidence retained in Git history).

![POC after undoing Sword control](evidence/poc-after-undo.png)

The repository is in `asta/`, on `assignment-2-asta-mvp`. See the [original POC commit](https://github.com/Abbasylas/TechTalks/commit/0901dc329dd632c114d1499077ecea49909b111c) and the [browser-saving update](https://github.com/Abbasylas/TechTalks/commit/0ab57097b306b0a6297c5ee2fa0454e203ba87cf). The project documentation lives in `docs/`.


## Follow-up: browser persistence (16 October 2026)

After the first POC, the owner asked for progress to survive a refresh without adding a database. Browser saving replaced the original reset behaviour.

Completed task IDs are saved in localStorage under `asta-training-completion-v1`. After the page loads in the browser, it restores saved progress before enabling the checkboxes. This prevents the empty starting state from overwriting earlier progress. The count and percentage still come from the task states. New visitors start with no tasks complete.

If saving fails, the tasks still work and the page shows a warning. Progress stays in the same browser and site address. Clearing browser data or using private browsing can remove it. It is not shared across devices or updated live between tabs.

### Actual follow-up results

- All **41 state checks passed**, including the original completion/undo/repeated-toggle combinations.
- Refresh after full completion restored 3 / 3 and 100%.
- Refresh after undo restored 2 / 3 and 67%.
- Keyboard completion and undo still worked after saved progress was restored.
- Invalid saved JSON did not crash the app; changing a task repaired it, and the new state survived refresh.
- When storage was blocked, tasks stayed usable and the saving warning appeared.
- No browser page errors; no horizontal overflow at 320px.
- Lint and TypeScript checks passed.

The saved-progress screenshot and follow-up results remain in Git history, alongside the original screenshots and test results.

Decision: **Continue** with browser saving. This step added neither a database nor the full design.

## Standard commands without Turbopack (16 October 2026)

The package scripts were updated to use Webpack for both `npm run dev` and `npm run build`. The Turbopack CSS rules and `@tailwindcss/turbopack` dependency were removed. Tailwind now uses `@tailwindcss/postcss`, and the npm lockfile was updated. The development setup accepts both localhost and 127.0.0.1.

The development server started, the production build completed, and `npm run start` served the built app. All 41 state checks passed in both development and production, including saving, undo, repeated changes, invalid saved data, and blocked storage. Lint passed without warnings, and neither successful browser run reported page errors.

The Webpack development and production results are preserved in Git history. They covered the POC at that stage; the later MVP checks are recorded in [REVIEW.md](REVIEW.md).

Use `npm run dev` from `asta/`. The earlier extra `--webpack` flag is no longer needed.

## MVP reuse (16 October 2026)

The dashboard reuses the POC logic in `components/training-plan.tsx`, including browser saving, the same storage key, independent checkboxes, and calculated progress. The static page supplies task labels, descriptions, and priorities from `lib/training-tasks.ts`. An extra check confirms that duplicate or unknown saved IDs cannot inflate progress, bringing the total to 42 passing state checks in development and production. See [REVIEW.md](REVIEW.md) for the results and what still needs checking.
