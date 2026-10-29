My screenshots
Abbas Al Shab

API requests

api/41-post-created-thunder-client.png: Added an order and got 201 with a new ID.
api/42-get-existing-thunder-client.png: Fetched that order and got 200.
api/43-invalid-url-thunder-client.png: The request URL was entered incorrectly. This is not an API 400 or 404.
api/44-post-created-postman.png: Added an order and got 201. Total and status are off-screen.
api/45-get-orders-postman.png: Fetched the order list and got 200. Part of the response is hidden.
api/46-get-existing-postman.png: Fetched one order and got 200 with the matching ID. Some fields are off-screen.
api/47-patch-quantity-postman.png: Changed quantity to 4. The response is 200 with total 32 and Pending.
api/48-patch-delivered-postman.png: Changed status to Delivered. Total stayed 32.
api/49-patch-protected-id-postman.png: Sent id 101 and quantity 10. Quantity changed, but the original ID stayed.
api/50-get-updated-order-postman.png: Fetched the saved order: quantity 10, price 8, total 80, Delivered.
api/51-post-created-postman.png: Added Demo Evidence and got 201 with quantity 3, price 8, total 24, and Pending.
api/52-get-orders-postman.png: Fetched the order list and got 200 with the saved order.
api/53-get-with-body-postman.png: Sent GET with quantity -2 in the body and got 200 with the saved quantity 3 and total 24. GET does not update the order, so this is not a rejected PATCH test.
api/54-post-method-not-allowed-postman.png: Sent POST to an order ID and got 405 Method Not Allowed. This is not a validation 400.
api/55-get-unchanged-order-postman.png: Fetched the same order and got 200. The name is still Demo Evidence, quantity 3, total 24, and Pending. The earlier attempt was POST, not PATCH.
api/56-delete-no-content-postman.png: Deleted the order and got 204 with an empty response body.
api/57-get-deleted-order-postman.png: Fetched the deleted order and got 404. The error message is not visible.
api/62-delete-before-browser-save-postman.png: Deleted the order used in the browser edit test and got 204 with an empty response body.
api/68-post-validation-order-postman.png: Added Demo Validation and got 201 with quantity 3, price 8, total 24, and Pending.
api/69-get-before-invalid-patch-postman.png: Fetched the order before the invalid PATCH and got 200 with the original name, quantity 3, and total 24.
api/71-patch-invalid-quantity-status-postman.png: Sent Should Not Save and quantity -2 using PATCH and got 400. The error text is not visible in this image.
api/72-patch-invalid-quantity-error-postman.png: The same PATCH returns 400 with Quantity must be a positive integer.
api/73-get-after-rejected-patch-postman.png: GET after the rejected PATCH returns 200. The same ID, Demo Validation, quantity 3, total 24, and Pending are unchanged.

Browser checks

browser/58-initial-load-blocked.png: Blocked /api/orders in DevTools. The requests failed and the load error heading is visible at the bottom. The retry button is off-screen.
browser/59-load-recovered.png: Removed the blocking rule. The requests returned 200 and the empty dashboard loaded. This image alone does not show whether Try again or reload was used.
browser/63-rejected-edit-values-kept.png: The edit form stays open with the entered values and Order not found. Screenshot 62 shows the same order was deleted. The selected request is an earlier GET 200, so the failed save status is not visible.
browser/64-delete-pending-3g.png: With 3G selected, the delete request is pending. The button shows Deleting... and the edit and delete actions are faded while it runs.
browser/65-save-pending-3g.png: With 3G selected, the save request is pending. The form keeps its values and the faded button shows Saving... while it runs.

Mobile layout

mobile/mobile-dashboard.png: Shows the dashboard on a 390 by 844 screen, with counts and an empty list.
mobile/66-populated-dashboard-380x844.png: Shows the mobile dashboard with two orders, two Pending, and zero Delivered. DevTools shows 380 by 844.
mobile/67-filled-order-form-380x844.png: Shows the mobile Add an order form with entered values and the Save order button. DevTools shows 380 by 844.

The thirty supplied screenshots are unchanged. Duplicate copies were skipped. The validation 400 and GET after a rejected PATCH are now included. Retry-click evidence is still missing. Screenshots 64 and 65 show pending actions under 3G. Screenshots 66 and 67 show the populated mobile dashboard and the filled form.
