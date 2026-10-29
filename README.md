# Nour’s Order Desk

Author: Abbas Al Shab

Branch: `assignment-4-nour-order-desk`

A Next.js App Router assignment for recording one product line per order. Use fictional customer names and phone values only.

## Run locally

```sh
npm ci
npm run dev
```

Open http://localhost:3000. The order list starts empty. Add an order, open its details, edit its fields or status, and confirm deletion. Summary counts come from the orders returned by the API.

## Teaching catalogue

| Product | Suggested unit price (USD) |
| --- | --- |
| Vanilla Candle | 8.00 |
| Cedar Candle | 10.00 |
| Mini Gift Candle | 6.00 |

These are assignment data, not real brand prices. Unit prices remain editable. Each new order starts as Pending; updates may use Pending, Preparing, or Delivered.

## API and data

The client dashboard uses `fetch` to call the Next.js Route Handlers. The server validates fields, generates IDs, and calculates totals. It never trusts a client-supplied ID or total. Prices stay in dollars, and totals are quantity multiplied by unit price, rounded to two decimal places.

| Method | Endpoint | Success |
| --- | --- | --- |
| GET | `/api/orders` | 200 |
| GET | `/api/orders/[id]` | 200 |
| POST | `/api/orders` | 201 |
| PATCH | `/api/orders/[id]` | 200 |
| DELETE | `/api/orders/[id]` | 204, no response body |

Invalid input and malformed JSON return 400 with an `error` message. Missing orders return 404. PATCH validates all supplied editable fields before applying changes, preserves omitted fields, and rejects empty updates.

All handlers share the server-side in-memory store in `lib/orders.ts` within one running local process. Data can reset during development reloads or server restarts. Multiple server instances do not reliably share this store. Test locally; deployment does not provide persistence. There is no database, authentication, inventory, payment, or integration workflow.

## Checks

```sh
npm run lint
npx tsc --noEmit
npm run build
```

For manual verification, create three Vanilla Candles at USD 8.00, check the server returns total 24 and Pending, then PATCH quantity to 4 and status to Preparing and check total 32. Verify invalid updates leave the order unchanged, and deletion returns an empty 204 response. The dashboard includes initial loading, load retry, empty state, pending actions, API errors, and preservation of rejected form values.

See [review answers and acceptance results](docs/REVIEW.md) and the [screenshot evidence index](docs/evidence/README.md).
