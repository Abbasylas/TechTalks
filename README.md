# Vinland Saga Fan Journal

A small Next.js dashboard with English fan notes about Vinland Saga. It uses Next.js 16.3.6, React 19.2.8, and TypeScript.

The demo profile and post records come from JSONPlaceholder for employee 1. Original English fan notes replace the API’s placeholder post text.

## Run locally

Install dependencies and start the app:

```bash
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). The dashboard is at `/`.

## Production build

```bash
npm run build
npm start
```

If Turbopack cannot start its compiler processes on your machine, build with Webpack instead:

```bash
npm run build -- --webpack
npm start
```

## Checks

```bash
npm run lint
npx tsc --noEmit
```

See [TESTING.md](docs/TESTING.md) for the preview and failure checks.

## What to expect

- The profile loads on the server in its own Suspense boundary.
- The server preview shows up to three titles. Its two-second delay is an intentional learning simulation kept in the demo.
- **Load all posts** fetches full posts in the browser after a click.

Reload the page directly to see the preview’s loading message. Navigation and prefetching can change what you observe.
