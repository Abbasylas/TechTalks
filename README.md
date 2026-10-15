# Asta’s Preparation Dashboard — POC

A small Next.js experiment with three training tasks, completion toggles, calculated progress, and browser-local saving. The full fantasy dashboard design is not implemented yet.

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

See [POC results](docs/POC.md), [requirements](docs/PRD.md), and [design](docs/DESIGN.md). Completion is saved in localStorage for this browser and site address; no database is used.

The browser checker is `scripts/check-poc.cjs`. It requires Playwright to be available to Node (the documented runs use the bundled runtime via NODE_PATH). Set POC_BASE_URL to test a different server, for example http://127.0.0.1:3001 for production.
