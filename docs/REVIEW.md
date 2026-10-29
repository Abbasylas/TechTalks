Nour's Order Desk review
Abbas Al Shab

1. Add Order flow
The form calls saveOrder, which sends POST /api/orders using fetch. The Route Handler validates the JSON and calls createOrder in lib/orders.ts. The server generates the ID, calculates the total, stores the order as Pending, and returns 201. The client checks response.ok and uses the saved response to update the list and counts. Errors keep the form values.

2. Total calculation
calculateTotal in lib/orders.ts multiplies quantity by the dollar unit price and rounds to two decimal places. The server calculates this on creation and updates so a client cannot override the total. Screenshot 47 shows 4 candles at USD 8 returning total 32.

3. Invalid request
PATCH /api/orders/<existing-id> with {"quantity":-2} returns 400: Quantity must be a positive integer. An automated local check confirmed that a following GET matched the order before the rejected update. The supplied screenshots do not include this API error; screenshot 43 only shows an invalid URL setup error.

4. PATCH versus replacement
PATCH changes only editable fields and doesnt change omitted fields. Sending only quantity does not remove the customer name. Replacing an entire object uses a complete replacement representation. This API supports partial updates and protects the ID and total.

5. Server restart
Orders are stored in process memory. Restarting the server clears them. Development reloads may also reset them, and separate server instances do not reliably share them. A restart test was not recorded.

6. AI suggestion verified
The AI explained that PATCH can update quantity while ignoring a supplied ID. Screenshot 49 sends id 101 and quantity 10, but the response keeps the original ID. Screenshot 50 confirms the saved quantity is 10 and total is 80. These images are in docs/evidence and described in its README.md.

Acceptance checks - 29 October 2026
All seven steps passed using automated HTTP requests against an isolated local server with fictional orders:

1. POST: 201, quantity 3 at USD 8, total 24.00, Pending.
2. PATCH quantity to 4: 200, total 32.00, customer name preserved.
3. PATCH status to Delivered: 200; total count 1, pending 0, delivered 1.
4. PATCH quantity to -2: 400; a following GET confirmed the entire order was unchanged.
5. PATCH valid quantity and price with total 0: 200; server returned total 32.
6. Create a second order: total 2, pending 1, delivered 1. DELETE returned 204 with no body; the list then contained only the first order, with counts 1, 0, and 1.
7. GET the deleted order: 404, Order not found.

Counts were checked from fresh API lists, not new dashboard screenshots. These automated checks are separate from the supplied Postman screenshots. Test orders were cleaned up, and no application code changes were needed.
