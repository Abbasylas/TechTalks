# Asta’s Preparation Dashboard

**Author: Abbas Al Shab**

**Current status:** The MVP supports three training tasks, completion and undo, calculated progress, and localStorage saving. Muhammad’s user test is recorded in the review. A live Stitch MCP call screenshot remains outstanding; existing evidence is preserved.

A single-screen training dashboard built with Next.js, TypeScript and Tailwind. It follows the reviewed Stitch design, uses the three supplied images, and tracks completion of a fixed preparation plan with browser-local saving.

## Run locally

From this directory:

```sh
npm install
npm run dev
```

Open http://localhost:3000. Both `npm run dev` and `npm run build` explicitly use Webpack. No Turbopack flags or CSS loader are required. Tailwind CSS uses the standard `@tailwindcss/postcss` integration.

## Production

```sh
npm run build
npm run start
```

## Checks and documentation

```sh
npm run lint
```

| Document | Contents |
| --- | --- |
| [REVIEW.md](docs/REVIEW.md) | Muhammad’s user test, acceptance results, and verification limits. |
| [MCP.md](docs/MCP.md) | Recorded Stitch calls, evidence, commit links, and screenshot limitation. |
| [Reflection](docs/QUESTIONS.md) | Abbas Al Shab’s assignment reflection. |
| [PRD](docs/PRD.md) | Current requirements and acceptance criteria. |
| [Design](docs/DESIGN.md) | Current design summary and labelled historical recommendations. |
| [POC](docs/POC.md) | Original experiment and later browser-saving update. |
| [Evidence index](docs/evidence/README.md) | Retained screenshots and links to historical records. |

Completion is saved in localStorage for this browser and site address; no database is used. Historical POC instructions about resetting on refresh and early design recommendations are superseded by the current implementation.

With a server running, the existing browser checks are:

```sh
node scripts/check-poc.cjs
node scripts/check-mvp.cjs
node scripts/check-repository.cjs
```

The browser runners require Playwright to be available to Node (the recorded runs use the bundled runtime through `NODE_PATH`). Set `POC_BASE_URL` to test another server, such as `http://127.0.0.1:3001` for production. Generated results and screenshots go to ignored `output/playwright/`. See [the current verification results](docs/REVIEW.md#final-assignment-verification).

## Repository

[Abbasylas/TechTalks](https://github.com/Abbasylas/TechTalks), branch `assignment-2-asta-mvp`. Make project changes and pushes on this branch. Pushing the final corrections requires the owner’s authorization.
