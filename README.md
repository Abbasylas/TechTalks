# Asta’s Preparation Dashboard

**Author: Abbas Al Shab**

**Current status:** The dashboard is working. You can complete or undo three training tasks, see your progress, and pick up where you left off after a refresh. The docs include Muhammad’s user test and [screenshots of the successful Stitch call](docs/MCP.md#native-call-screenshots).

Asta’s Preparation Dashboard keeps a small training plan in one place. It was built with Next.js, TypeScript, and Tailwind, using the reviewed Stitch design and supplied artwork. Progress is saved in your browser.

## Run locally

Run these commands from this directory:

```sh
npm install
npm run dev
```

Open http://localhost:3000. Development and production builds already use Webpack, so you don’t need any extra flags. Tailwind runs through `@tailwindcss/postcss`.

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
| [REVIEW.md](docs/REVIEW.md) | How Muhammad used the site, what passed testing, and what still needs checking. |
| [MCP.md](docs/MCP.md) | What Stitch returned, screenshots of the call, and links to earlier commits. |
| [Reflection](docs/QUESTIONS.md) | Abbas Al Shab’s assignment reflection. |
| [PRD](docs/PRD.md) | What the dashboard should do and how to check it. |
| [Design](docs/DESIGN.md) | The current layout and the earlier ideas that led to it. |
| [POC](docs/POC.md) | The first task-progress test and the later browser-saving update. |
| [Evidence index](docs/evidence/README.md) | Screenshots, saved results, and earlier records. |

The app uses localStorage to remember completed tasks in the same browser at the same site address. Earlier notes about progress resetting on refresh describe the original experiment, before saving was added.

Start the server, then run the checks:

```sh
node scripts/check-poc.cjs
node scripts/check-mvp.cjs
node scripts/check-repository.cjs
```

The browser checks need Playwright. The recorded runs used the bundled copy through `NODE_PATH`. To check a different server, set `POC_BASE_URL`, for example to `http://127.0.0.1:3001` for production. Results and screenshots are written to the ignored `output/playwright/` folder. See [the latest results](docs/REVIEW.md#final-assignment-verification).

## Repository

The project is in [Abbasylas/TechTalks](https://github.com/Abbasylas/TechTalks) on `assignment-2-asta-mvp`. Keep changes and pushes on this branch. Ask the owner before pushing the final corrections.
