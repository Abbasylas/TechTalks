My plan for Nour's Order Desk
Abbas Al Shab

Repository: Abbasylas/TechTalks
Branch: assignment-4-nour-order-desk

Nour keeps orders in different notes and messages, so it is easy to lose track. The goal is one simple dashboard where she can see what needs preparing.

The dashboard needs to list, view, add, edit, and delete orders. It also needs status changes, real summary counts, loading messages, useful errors, a retry button, and delete confirmation. Each order has one product and an editable USD price.

The endpoints
GET /api/orders: list orders.
GET /api/orders/[id]: view one order.
POST /api/orders: add an order.
PATCH /api/orders/[id]: edit an order.
DELETE /api/orders/[id]: delete an order.

The steps
1. Define the order fields and three statuses.
2. Keep the orders in one server-side memory store.
3. Build the Route Handlers, check inputs, and calculate totals on the server.
4. Connect the dashboard using fetch.
5. Add loading, error, mobile, and keyboard support.
6. Test the requests and save the results and screenshots.

This uses Next.js 16, TypeScript, and Tailwind CSS. It does not need accounts, payments, inventory, or a database. I added this summary after the app was built.
