# Vinland Saga Fan Journal

Full name: Abbas Al Shab

An Employee Explorer dashboard at `/`, themed around Vinland Saga. It uses Next.js 16.3.6, React 19.2.8, and TypeScript.

The demo profile and post records come from JSONPlaceholder for employee 1. Post titles and bodies remain the API data; original English fan notes appear separately when available.

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
- **Load posts** fetches full posts in the browser after a click.

Reload the page directly to see the preview’s loading message. Navigation and prefetching can change what you observe.

## Demo scenarios

The client explorer’s **Demo scenario** selector applies to the next **Load posts** or **Retry** click. Changing it does not fetch anything or affect the server profile or preview.

| Scenario | What happens |
| --- | --- |
| Success | Makes the real JSONPlaceholder posts request. |
| Slow | Waits two seconds, then makes the real request. |
| HTTP error | Creates a local `Response` with status 503. |
| Empty | Creates a local successful JSON `Response` containing `[]`. |

These are deliberate learning simulations. JSONPlaceholder does not return the local 503 or empty response. Every response uses the same HTTP check and JSON parser. Only Success and Slow make an API request.

To check recovery, select **HTTP error**, click **Load posts**, then select **Success** and click **Retry**. The last-attempt label shows which scenario produced the visible result.

## Limitations

- Real profile and posts requests need an internet connection and a working JSONPlaceholder API.
- The optional English fan notes cover post IDs 1–10. Other post IDs display the API data without a fan note.
- The contributor number in the profile is a fixed demo label.
- The delays and local responses are kept for learning. They do not describe the API’s real speed or reliability.
- Browser request counting, other browsers, and screen-reader output were not verified in the current environment. The testing report explains the limitation.
