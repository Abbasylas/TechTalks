How the API works

Use http://localhost:3000, or the port shown in the terminal. Send request bodies as JSON with Content-Type: application/json. All prices are USD.

The endpoints
GET /api/orders returns 200 and an array. An empty list is [].
GET /api/orders/[id] returns 200 and one order, or 404 if it is missing.
POST /api/orders returns 201 and the new order, or 400 for bad input.
PATCH /api/orders/[id] returns 200 and the updated order, 400 for bad input, or 404 for a missing order when the update is valid.
DELETE /api/orders/[id] returns 204 with no body, or 404 if it is missing.

Add an order
POST /api/orders
{"customerName":"Demo Customer","phone":"DEMO-001","productName":"Vanilla Candle","quantity":3,"unitPrice":8}

Example response, status 201:
{"id":"generated-id","customerName":"Demo Customer","phone":"DEMO-001","productName":"Vanilla Candle","quantity":3,"unitPrice":8,"total":24,"status":"Pending"}

Use the real returned ID instead of generated-id. GET by that ID returns the order; GET /api/orders returns orders inside an array.

Edit the order
PATCH /api/orders/<returned-id>
{"quantity":4,"status":"Preparing"}

This returns 200 with the same ID and customer details, quantity 4, status Preparing, and total 32.

Delete it
DELETE /api/orders/<returned-id>
A successful response is 204 with nothing to parse.

The rules
Names, phone, and product must be text and cannot be blank. Extra spaces at the start and end are removed. Phone stays text.
Quantity must be a whole number of at least 1.
Unit price must be a finite number, zero or more, with at most two decimal places.
Status can be Pending, Preparing, or Delivered. New orders start Pending.
The server creates the ID and calculates quantity times unit price, rounded to two decimals. Sending an ID or total cannot override those values.
PATCH only changes supplied editable fields. It keeps the other fields and rejects an empty update. If any supplied editable field is invalid, nothing is saved.

Error examples
400: {"error":"Quantity must be a positive integer."}
400 for malformed JSON: {"error":"Request body must contain valid JSON."}
404: {"error":"Order not found."}
Non-object JSON bodies also return 400.

Orders only stay in the running server's memory. They are not saved permanently.
