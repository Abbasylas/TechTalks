Test results
Abbas Al Shab
29 October 2026

Lint, TypeScript, and the Webpack production build passed. This does not confirm the default Turbopack build.

The automated local API run passed 41 checks. It covered valid requests, missing and blank fields, bad quantities and prices, malformed JSON, invalid status, empty updates, protected IDs and totals, and missing orders.

A separate acceptance run passed these seven steps:
1. Add 3 Vanilla Candles at USD 8: 201, total 24, Pending.
2. Change quantity to 4: 200, total 32, customer name kept.
3. Mark Delivered: 200; counts became total 1, pending 0, delivered 1.
4. Send quantity -2: 400. A GET afterward showed the order had not changed.
5. Send total 0 with valid quantity and price: the server still returned 32.
6. Add a second order, then delete it: 201, then 204 with no body. The list and counts went back to one delivered order.
7. Fetch the deleted order: 404.

These were Node fetch checks on a separate local server, not Postman screenshots. Counts came from fresh API lists. The fictional test orders were cleaned up.

Browser checks also covered adding, editing, changing status, deletion, the empty state, and keyboard focus. The mobile screenshot is evidence/mobile-dashboard.png. The supplied screenshots show GET, POST, PATCH, and an unchanged ID. Their descriptions are in evidence/README.md.

Still missing
DELETE 204, validation 400, and unknown-ID 404 screenshots.
Recorded browser tests for load failure/retry and rejected submissions.
A restart test, a multi-server test, and a full accessibility check.
There is no recording or deployed demo.

To repeat the tests, run npm ci and npm run dev, then use the shown address in Postman. Use fictional details and copy the returned ID for the next requests.
