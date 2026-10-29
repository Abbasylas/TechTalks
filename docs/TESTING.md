Test results
Abbas Al Shab
29 October 2026

Lint, TypeScript, and the Webpack production build passed. This does not confirm the default Turbopack build.

The automated local API run passed 41 checks. It covered valid requests, missing and blank fields, bad quantities and prices, malformed JSON, invalid status, empty updates, protected IDs and totals, and missing orders.

A separate source review reported 34 passing handler assertions using native Request/Response and a small NextResponse adapter. That review did not run a full Next.js server, browser, lint, or build check. It is separate from the earlier checks above.

A separate acceptance run passed these seven steps:
1. Add 3 Vanilla Candles at USD 8: 201, total 24, Pending.
2. Change quantity to 4: 200, total 32, customer name kept.
3. Mark Delivered: 200; counts became total 1, pending 0, delivered 1.
4. Send quantity -2: 400. A GET afterward showed the order had not changed.
5. Send total 0 with valid quantity and price: the server still returned 32.
6. Add a second order, then delete it: 201, then 204 with no body. The list and counts went back to one delivered order.
7. Fetch the deleted order: 404.

These were Node fetch checks on a separate local server, not Postman screenshots. Counts came from fresh API lists. The fictional test orders were cleaned up.

Browser checks also covered adding, editing, changing status, deletion, the empty state, and keyboard focus. The mobile screenshot is evidence/mobile/mobile-dashboard.png. The supplied screenshots show GET, POST, PATCH, DELETE 204 with no body, a deleted-order 404, and an unchanged ID. Their descriptions are in evidence/README.md. Evidence is sorted into api, browser, and mobile folders.

Screenshots 51 to 57 were added on 30 October 2026. Screenshot 54 shows POST to an order ID returning 405, not PATCH returning 400. Screenshot 55 shows the saved order unchanged afterward, but it does not prove a rejected PATCH left it unchanged. Screenshot 53 also uses GET, so its negative quantity body is not an update test. Four duplicate copies were skipped.

Screenshot 58 shows blocked orders requests and the load error heading; the retry button is off-screen. Screenshot 59 shows requests returning 200 and the empty dashboard after blocking was removed, but does not show a retry click. Screenshot 62 shows the edit-test order being deleted with 204. Screenshot 63 shows Order not found while the edit form keeps its entered values. The failed save status is not selected in DevTools, so it is not visible.

Screenshots 64 and 65 show the delete and save requests pending with 3G selected. The buttons show Deleting... and Saving... and are faded while the requests run. Edit is also faded during deletion. These images capture the waiting state, not the final responses.

Screenshots 66 and 67 show the mobile dashboard with two pending orders and the Add an order form with entered values. DevTools shows 380 by 844, rather than 390 by 844. The repeated copy of screenshot 65 was skipped.

Screenshots 68 and 69 show the new Demo Validation order and its saved values. Screenshots 71 and 72 show PATCH with customerName Should Not Save and quantity -2 returning 400. Screenshot 72 shows the useful quantity error. Screenshot 73 fetches the same ID afterward and shows the original name, quantity 3, total 24, and Pending. Neither requested change was saved. Duplicate copies of screenshots 69 and 73 were skipped.

Still missing
A visible retry button and evidence that clicking it recovered the page, rather than reloading.
A restart test, a multi-server test, and a full accessibility check.
There is no recording or deployed demo.

To repeat the tests, run npm ci and npm run dev, then use the shown address in Postman. Use fictional details and copy the returned ID for the next requests.
