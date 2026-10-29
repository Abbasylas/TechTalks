My review
Abbas Al Shab

1. What happens when I add an order?
The form calls saveOrder and sends POST /api/orders using fetch. The Route Handler checks the data and calls createOrder in lib/orders.ts. The server creates an ID, calculates the total, saves the order as Pending, and returns 201. The dashboard checks response.ok and updates the list and counts from that response. If it fails, the form keeps its values.

2. Where is the total calculated?
calculateTotal in lib/orders.ts multiplies quantity by the dollar price and rounds to two decimals. The server does this so a user cannot send a fake total. Screenshot 47 shows 4 candles at USD 8 returning 32.

3. What invalid request was checked?
PATCH with {"customerName":"Should Not Save","quantity":-2} returned 400 because quantity must be a positive whole number. Screenshot 69 shows the saved order before the update. Screenshot 72 shows the request and quantity error. Screenshot 73 fetches the same order afterward: the name is still Demo Validation, quantity 3, total 24, and Pending. Neither change was saved. The earlier automated check also confirmed this behavior.

4. How is PATCH different from replacement?
PATCH changes only the fields sent, so changing quantity keeps the customer name. Replacing an object means sending its full replacement. This API uses PATCH and keeps the ID and total under server control.

5. What happens after a restart?
The orders are lost because they are only in server memory. Development reloads may also reset them, and separate servers do not reliably share them. A restart test was not recorded.

6. What AI suggestion was checked?
The AI said a PATCH can change quantity while ignoring a supplied ID. Screenshot 49 sends id 101 and quantity 10, but the original ID stays. Screenshot 50 confirms quantity 10 and total 80 were saved.

The seven acceptance steps also passed automated local checks on 29 October 2026: create at 24, edit to 32, mark Delivered, reject -2 without changing data, ignore total 0, delete an accidental order, and return 404 for the deleted ID. Counts were checked from API lists, not new dashboard screenshots. More details are in TESTING.md.

Screenshots 56 and 57 now show DELETE returning 204 with no body and GET returning 404 for that deleted order.

The new browser screenshots show blocked loading, a successful load after unblocking, and an edit form keeping its entered values with Order not found after the order was deleted. They do not show a retry click or the failed save status. The screenshots are now grouped in docs/evidence/api, docs/evidence/browser, and docs/evidence/mobile.

Screenshots 64 and 65 show the faded Deleting... and Saving... buttons while requests are pending under 3G.

Screenshots 66 and 67 show two pending orders on the mobile dashboard and the filled Add an order form at 380 by 844.
