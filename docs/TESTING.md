# Testing


The main checks passed. The profile loaded, the preview showed its loading message, and the client handled success, errors, empty results, and retries. The page also worked at 360px wide.



## Results

**Server profile**

- Expected: Showing full employee details.
- Actual: Leanne Graham, Sincere@april.biz, and Romaguera-Crona from `/users/1`.
- Result: Pass.

**Server preview**

- Expected: A loading message while the rest of the page stays visible.
- Actual: The shell arrived at 127 ms. Three titles arrived at 2,130 ms.
- Result: Pass.

**Client idle**

- Expected: No fetch before clicking.
- Actual: The code test counted zero requests before clicking, even after changing the selector.
- Result: Pass in the code test. Browser request counting was not tested.

**Client slow**

- Expected: Loading feedback and no duplicate requests.
- Actual: The controls were disabled, then 10 posts appeared. Two rapid clicks made one request in the code test.
- Result: Pass.

**Client success**

- Expected: Post titles and bodies.
- Actual: Saw 10 English fan notes after the real API request.
- Result: Pass.

**HTTP failure**

- Expected: Catch the custom error and offer Retry.
- Actual: The local 503 showed an error and Retry. The code test confirmed `ApiError` with status 503.
- Result: Pass.

**Empty response**

- Expected: “No posts found” without an error.
- Actual: Saw that message after the local empty response. No error appeared.
- Result: Pass.

**Recovery**

- Expected: Retry successfully after an error.
- Actual: Switched from HTTP error to Success and clicked Retry. Posts appeared and the error cleared.
- Result: Pass.

**Section independence**

- Expected: The server sections stay when the client fails.
- Actual: The profile and three preview titles stayed visible during the client error.
- Result: Pass.

**Usability**

- Expected: Labels, visible keyboard focus, and a readable page at 360px.
- Actual: Labels and focus were visible. Text wrapped without sideways scrolling.
- Result: Pass.

Request counts used a fake fetch in a code test. The visible states were checked in the running browser. The English fan notes replace the API’s placeholder Latin.

## Commands

**npm run lint**

- Expected: No lint errors.
- Actual: Passed on the host with exit code 0. npm was unavailable in the sandbox.
- Result: Pass.

**npm run build**

- Expected: Build without errors.
- Actual: Finished with exit code 0 using Turbopack.
- Result: Pass.

Both commands were run for this report.

## Screenshots and steps

These are screenshots of the running app. Timing was measured separately: the preview through a fresh HTTP response, and Slow mode through the code test. Slow waited 2,006 ms before fetching. A screenshot alone cannot prove timing.

### Normal

Reloaded `/` and waited for the profile and three preview titles. Left the client explorer idle.

![Normal dashboard](screenshots/normal.jpg)

### Server-preview loading

Reloaded `/` and captured the loading message. The rest of the page stayed visible. The two-second pause is an intentional learning simulation.

![Server preview loading](screenshots/server-preview-loading.jpg)

### Client error

Selected HTTP error and clicked Load posts. The 503 was created locally. The server sections stayed visible.

![Client HTTP error](screenshots/client-error.jpg)

### Empty

Selected Empty and clicked the action button. The empty response was created locally, not returned by JSONPlaceholder.

![Empty client result](screenshots/empty.jpg)

### Mobile keyboard focus

At 360px, Shift+Tab focused Load posts. Tab then moved to Demo scenario. Both had a visible focus outline.

![Mobile keyboard focus](screenshots/mobile-focus.jpg)

## Not tested

- Counting requests in the browser’s Network panel.
- A real API outage or a real 503 from JSONPlaceholder.
- Screen-reader output and other browsers.

## Why a manual boundary?

`loading.tsx` shows a loading screen while a page loads. A shared header can stay visible above it.

Here, a manual Suspense boundary shows loading only in the preview. `await connection()` makes the demo wait for a real request. I used direct reloads because navigation and prefetching can change what appears.

Neither option is always better. A click request uses its own React loading state; Suspense does not watch the click handler’s fetch.
