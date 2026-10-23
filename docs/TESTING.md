# Testing

This demo uses Next.js 16.3.6 and React 19.2.8.

## Check the preview

1. Reload the dashboard directly in the browser.
2. The page title, introduction, and explorer should appear while recent posts load.
3. The preview shows its loading message for at least two seconds, then up to three titles. Network time can make it take longer.
4. The profile has a separate request and loading message. It can finish before or after the preview.
5. Click **Load posts**. This makes a separate browser request without the artificial delay.

The two-second pause is an intentional learning simulation kept in `components/recent-posts.tsx`. `await connection()` runs before it so this work waits for a real request instead of finishing during prerendering. The existing fetch caching settings are unchanged. Navigation and prefetching can affect what you see, so test with a direct reload.

## Why a manual boundary?

The manual Suspense boundary replaces only the preview while its child waits. The async work happens inside that child, not at the top of the page.

A `loading.tsx` file shows a loading screen while a page loads. A shared layout, such as the site header, can stay visible above it.

Here, only the posts preview needs to wait. A manual Suspense boundary lets us show a loading message just there. Both options are useful; the choice depends on how much of the page should show a loading message.

A request started by a client click handler uses React loading state. Suspense does not track that handler's fetch.

## Failure checks

- If the profile fails, its friendly message should appear without replacing the title or posts.
- If the preview fails, only the preview should show an error.
- If the explorer fails, **Try again** should allow another request.

## Check the client request

1. Open the browser’s Network panel, select Fetch/XHR, and filter by `jsonplaceholder.typicode.com`.
2. Reload the page. No direct API request should appear there yet. The profile and preview requests run on the server, so their API calls are not listed in the browser’s Network panel.
3. Click **Load posts**. One GET request to `https://jsonplaceholder.typicode.com/posts?userId=1` should appear. Open its Initiator details to trace it back to the client click handler.
4. Use network throttling to see the loading message and disabled button. Repeated clicks must not start another request while it is running.
5. A successful response shows titles and bodies. The journal uses original English fan notes for display because the API text is placeholder Latin.
6. Use a local response override with `[]` to check the exact message **No posts found**.
7. After the profile and preview have loaded, block the posts URL and click **Load posts** again. Only the explorer should show an error. Unblock it and click **Try again** to check recovery.

## Code checks

Run `npm run lint` and `npx tsc --noEmit`. Repeat the preview checks with a production build too. Setup and run commands are in the [README](../README.md).
