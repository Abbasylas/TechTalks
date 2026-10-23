# Interview

## Looking back at my predictions

- I got the request locations right: server for the profile and preview, browser for the button request.
- My reason about privacy was wrong. This API data is public, and the profile is visible in the browser.
- Local storage is not used here. The page shell stays visible while each section loads.
- Suspense is not limited to the first render. It handles work that suspends during rendering, but it does not automatically watch a click handler’s fetch.
- I was wrong about HTTP errors. A 503 does not make fetch throw by itself. Our response check throws `ApiError`.

## 1. Where does each request run?

The profile and preview requests run on the server. The explorer’s Success and Slow requests run in the browser after a click. HTTP error and Empty create local responses instead of calling the API.

I checked the component boundaries and fetch calls. I also checked the streamed response and tested that the click handler made no requests before a click. Browser Network-panel counting was not tested.

## 2. Why fetch the profile on the server and posts from the button in the browser?

The profile should load when the page opens, without asking the user to click. The explorer should wait until the user asks for posts, so its click handler and loading state belong in a Client Component.

## 3. What activates the preview’s fallback?

The async preview waits for a request, pauses for two seconds, and fetches posts. While that child is waiting, its Suspense boundary shows the fallback.

The click handler runs separately from rendering. It updates React state to show loading; Suspense does not track that request automatically.

## 4. What if the boundary wrapped the whole dashboard?

If that were the only boundary, the loading message could replace the whole dashboard while the preview waits. The title and other sections would no longer stay visible. Keeping the smaller boundaries would still let those sections load separately.

## 5. How does the custom error help?

`ApiError` keeps the message and HTTP status together. `instanceof ApiError` lets the catch code tell an HTTP error from other failures.

`super(message)` calls the normal Error constructor so it stores the message.

## 6. How are HTTP failure, network failure, and empty results different?

- HTTP failure: a response arrived, but its status was unsuccessful. We check `response.ok` and throw our error.
- Network failure: fetch rejected without a usable response. There may be no HTTP status.
- Empty result: the request succeeded and returned `[]`. We show “No posts found”.

## 7. What if employee 1 changes to 2 everywhere?

The requests would use `/users/2` and `/posts?userId=2`. The employee and post records would change, but the requests would still run in the same places.

There are two details to update: the fixed “Demo contributor 01” label and the fan notes. Notes only cover post IDs 1–10, so other IDs use the generic fallback note. I have not tested employee 2.

## 8. What did I verify instead of assuming?

I checked that the preview delay did not hold up the whole page. On a fresh request, the shell arrived at 127 ms and the preview at 2,130 ms. I also captured the loading message while the rest of the page stayed visible. The screenshot shows the state; the streamed response gave me the timing.
