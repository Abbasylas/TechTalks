Nour's Order Desk
Abbas Al Shab
Branch: assignment-4-nour-order-desk

I built this small Next.js dashboard to help Nour keep her candle orders in one place. She can add an order, view it, edit it, change its status, and delete a mistake. The counts show total, pending, and delivered orders.

To run it
Install Node.js, open this folder, then run:
npm ci
npm run dev

Open http://localhost:3000, or the address shown in the terminal.

The suggested prices are USD 8.00 for Vanilla Candle, USD 10.00 for Cedar Candle, and USD 6.00 for Mini Gift Candle. These are assignment prices. The price can be edited, and every order starts as Pending. Only fictional customer details should be used.

The dashboard calls the API using fetch. The server checks the data, creates IDs, and works out totals. There is no database: restarting the server loses the orders, development reloads may reset them, and separate servers do not share them reliably.

Checks
npm run lint
npx tsc --noEmit
npm run build

More details
[Plan](docs/PLAN.md)
[API](docs/API.md)
[Test results](docs/TESTING.md)
[Review answers](docs/REVIEW.md)
[Evidence](docs/evidence/README.md)
[Mobile screenshot](docs/evidence/mobile-dashboard.png)
