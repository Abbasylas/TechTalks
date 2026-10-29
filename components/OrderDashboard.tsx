"use client";

import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, SubmitEvent } from "react";
import { ORDER_STATUSES, type Order, type Status } from "@/lib/order-types";

type OrderDraft = {
  customerName: string;
  phone: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  status: Status;
};

const suggestedPrices: Record<string, number> = {
  "Vanilla Candle": 8,
  "Cedar Candle": 10,
  "Mini Gift Candle": 6,
};

const emptyDraft: OrderDraft = {
  customerName: "",
  phone: "",
  productName: "Vanilla Candle",
  quantity: 1,
  unitPrice: suggestedPrices["Vanilla Candle"],
  status: "Pending",
};

const formatUSD = (value: number) => `$${value.toFixed(2)}`;

// Read useful API errors, with a fallback if the response is not JSON.
async function responseError(response: Response, fallback: string): Promise<string> {
  try {
    const body = await response.json() as { error?: unknown };
    return typeof body.error === "string" ? body.error : fallback;
  } catch {
    return fallback;
  }
}

async function fetchOrders(): Promise<Order[]> {
  const response = await fetch("/api/orders", { cache: "no-store" });
  if (!response.ok) {
    throw new Error(await responseError(response, "Could not load orders. Please try again."));
  }
  return response.json();
}

export default function OrderDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [actionError, setActionError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [draft, setDraft] = useState<OrderDraft>(emptyDraft);
  const isBusy = isSaving || isDeleting || isUpdatingStatus || isLoadingDetails;
  const panelRef = useRef<HTMLDivElement>(null);
  const isPanelOpen = Boolean(activeOrder || isEditing);

  // Put focus inside the dialog, then return it to the control that opened it.
  useEffect(() => {
    if (!isPanelOpen) return;
    const opener = document.activeElement as HTMLElement | null;
    panelRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
    return () => { opener?.focus(); };
  }, [isPanelOpen]);

  // Load through the collection Route Handler; ignore results after unmounting.
  useEffect(() => {
    let isCurrent = true;
    fetchOrders()
      .then((data) => { if (isCurrent) setOrders(data); })
      .catch((error: unknown) => {
        if (isCurrent) setLoadError(error instanceof Error ? error.message : "Could not load orders.");
      })
      .finally(() => { if (isCurrent) setIsLoading(false); });
    return () => { isCurrent = false; };
  }, []);

  async function retryLoading() {
    setLoadError("");
    setIsLoading(true);
    try {
      setOrders(await fetchOrders());
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Could not load orders.");
    } finally {
      setIsLoading(false);
    }
  }

  const summary = {
    total: orders.length,
    pending: orders.filter((order) => order.status === "Pending").length,
    delivered: orders.filter((order) => order.status === "Delivered").length,
  };

  function startNewOrder() {
    setActiveOrder(null);
    setDraft({ ...emptyDraft });
    setActionError("");
    setIsEditing(true);
  }

  function startEditing(order: Order) {
    setDraft({
      customerName: order.customerName,
      phone: order.phone,
      productName: order.productName,
      quantity: order.quantity,
      unitPrice: order.unitPrice,
      status: order.status,
    });
    setActionError("");
    setIsEditing(true);
  }

  // Read full details from the individual-order Route Handler before showing them.
  async function viewOrder(order: Order) {
    if (isBusy) return;
    setActiveOrder(order);
    setIsEditing(false);
    setActionError("");
    setIsLoadingDetails(true);
    try {
      const response = await fetch(`/api/orders/${order.id}`, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(await responseError(response, "Could not load this order."));
      }
      const savedOrder: Order = await response.json();
      setActiveOrder(savedOrder);
      setOrders((current) => current.map((item) => item.id === savedOrder.id ? savedOrder : item));
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Could not load this order.");
    } finally {
      setIsLoadingDetails(false);
    }
  }

  // Keep a pending request attached to its panel until the server responds.
  function closePanel() {
    if (isBusy) return;
    setIsEditing(false);
    setActiveOrder(null);
  }

  // Keep keyboard navigation inside the modal and support Escape to close it.
  function handlePanelKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") closePanel();
    if (event.key !== "Tab") return;
    const controls = panelRef.current?.querySelectorAll<HTMLElement>(
      "button:not(:disabled), input:not(:disabled), select:not(:disabled)",
    );
    if (!controls?.length) return;
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function handleOrderKeyDown(event: KeyboardEvent<HTMLTableRowElement>, order: Order) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      void viewOrder(order);
    }
  }

  // Validate before sending; the API remains the final authority on order data.
  async function saveOrder(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isBusy) return;
    setActionError("");

    const hasValidText = Boolean(
      draft.customerName.trim() && draft.phone.trim() && draft.productName.trim(),
    );
    const hasValidQuantity = Number.isInteger(draft.quantity) && draft.quantity >= 1;
    const hasValidPrice = Number.isFinite(draft.unitPrice)
      && draft.unitPrice >= 0
      && Number(draft.unitPrice.toFixed(2)) === draft.unitPrice;

    if (!hasValidText || !hasValidQuantity || !hasValidPrice) {
      setActionError("Enter names, a positive whole quantity, and a price with up to two decimal places.");
      return;
    }

    const payload: OrderDraft = {
      ...draft,
      customerName: draft.customerName.trim(),
      phone: draft.phone.trim(),
      productName: draft.productName.trim(),
    };
    setIsSaving(true);
    try {
      // The server validates the request, stores the order, and calculates its total.
      const response = await fetch(activeOrder ? `/api/orders/${activeOrder.id}` : "/api/orders", {
        method: activeOrder ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setActionError(await responseError(response, "Could not save this order."));
        return;
      }

      // Only the saved API response updates the dashboard; rejected forms stay open.
      const savedOrder: Order = await response.json();
      setOrders((currentOrders) => activeOrder
        ? currentOrders.map((order) => order.id === savedOrder.id ? savedOrder : order)
        : [savedOrder, ...currentOrders]);
      setActiveOrder(savedOrder);
      setIsEditing(false);
    } catch {
      setActionError("Could not save this order. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  // Ask for confirmation before removing an order through the API.
  async function removeOrder() {
    if (isBusy) return;
    if (!activeOrder || !window.confirm(`Delete the order for ${activeOrder.customerName}?`)) {
      return;
    }

    setActionError("");
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/orders/${activeOrder.id}`, { method: "DELETE" });
      if (!response.ok) {
        setActionError(await responseError(response, "Could not delete this order."));
        return;
      }

      // A successful DELETE returns 204, so there is no JSON body to parse.
      setOrders((currentOrders) => currentOrders.filter((order) => order.id !== activeOrder.id));
      setActiveOrder(null);
    } catch {
      setActionError("Could not delete this order. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  async function changeStatus(status: Status) {
    if (!activeOrder || isBusy) return;

    setActionError("");
    setIsUpdatingStatus(true);
    try {
      const response = await fetch(`/api/orders/${activeOrder.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        setActionError(await responseError(response, "Could not update this order."));
        return;
      }

      const savedOrder: Order = await response.json();
      setActiveOrder(savedOrder);
      setOrders((currentOrders) => currentOrders.map((order) =>
        order.id === savedOrder.id ? savedOrder : order,
      ));
    } catch {
      setActionError("Could not update this order. Please try again.");
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  return (
    <main>
      <aside aria-label="Main navigation">
        <div className="brand">
          <b className="logo">n.</b>
          <span>Nour’s desk</span>
        </div>
        <p>WORKSPACE</p>
        <div className="nav" aria-current="page">
          ▦　Orders <i>{summary.total}</i>
        </div>
      </aside>

      <section>
        <header>Workspace / Orders</header>
        <div className="wrap">
          <div className="title">
            <div>
              <small>YOUR BUSINESS, IN ONE PLACE</small>
              <h1>Orders</h1>
              <p>Keep every candle order moving, from request to delivery.</p>
            </div>
            <button type="button" onClick={startNewOrder} disabled={isLoading || Boolean(loadError)}>
              ＋ New order
            </button>
          </div>

          <div className="stats">
            {[
              ["Total orders", summary.total],
              ["Pending", summary.pending],
              ["Delivered", summary.delivered],
            ].map(([label, count]) => (
              <div className="stat" key={label}>
                <small>{label}</small>
                <b>{count}</b>
              </div>
            ))}
          </div>

          <h2>All orders <small>{orders.length}</small></h2>
          <p>Manage and track customer requests</p>
          <div className="table">
            {isLoading ? (
              <p className="loading-state" role="status">Loading orders…</p>
            ) : loadError ? (
              <div className="empty">
                <h3>We couldn’t load your orders</h3>
                <p className="error" role="alert">{loadError}</p>
                <button type="button" onClick={retryLoading}>Try again</button>
              </div>
            ) : orders.length === 0 ? (
              <div className="empty">
                <h3>No orders yet</h3>
                <p>Orders you add will appear here.</p>
                <button type="button" onClick={startNewOrder}>＋ Add your first order</button>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th scope="col">CUSTOMER</th>
                    <th scope="col">PRODUCT</th>
                    <th scope="col">QTY</th>
                    <th scope="col">TOTAL</th>
                    <th scope="col">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      tabIndex={0}
                      aria-label={`View order for ${order.customerName}`}
                      onClick={() => viewOrder(order)}
                      onKeyDown={(event) => handleOrderKeyDown(event, order)}
                    >
                      <td>{order.customerName}<small>{order.phone}</small></td>
                      <td>{order.productName}</td>
                      <td>{order.quantity}</td>
                      <td>{formatUSD(order.total)}</td>
                      <td><span className={`badge ${order.status.toLowerCase()}`}>{order.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>

      {(activeOrder || isEditing) && (
        <div className="shade" onClick={closePanel}>
          <div
            ref={panelRef}
            className="panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-panel-title"
            aria-busy={isBusy}
            onClick={(event) => event.stopPropagation()}
            onKeyDown={handlePanelKeyDown}
          >
            <button
              className="x"
              type="button"
              aria-label="Close order panel"
              onClick={closePanel}
            >
              ×
            </button>
            {actionError && <p className="error" role="alert">{actionError}</p>}
            {isLoadingDetails && <p role="status">Loading order details…</p>}

            {isEditing ? (
              <>
                <h2 id="order-panel-title">{activeOrder ? "Edit order" : "Add an order"}</h2>
                <form onSubmit={saveOrder}>
                  <label>
                    Customer name
                    <input
                      required
                      value={draft.customerName}
                      onChange={(event) => setDraft({ ...draft, customerName: event.target.value })}
                    />
                  </label>
                  <label>
                    Phone number
                    <input
                      required
                      value={draft.phone}
                      onChange={(event) => setDraft({ ...draft, phone: event.target.value })}
                    />
                  </label>
                  <label>
                    Product
                    <select
                      value={draft.productName}
                      onChange={(event) => {
                        const productName = event.target.value;
                        setDraft({ ...draft, productName, unitPrice: suggestedPrices[productName] });
                      }}
                    >
                      {Object.keys(suggestedPrices).map((productName) => (
                        <option key={productName}>{productName}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Quantity
                    <input
                      type="number"
                      min="1"
                      step="1"
                      required
                      value={Number.isNaN(draft.quantity) ? "" : draft.quantity}
                      onChange={(event) => setDraft({ ...draft, quantity: event.target.valueAsNumber })}
                    />
                  </label>
                  <label>
                    Unit price (USD)
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      value={Number.isNaN(draft.unitPrice) ? "" : draft.unitPrice}
                      onChange={(event) => setDraft({ ...draft, unitPrice: event.target.valueAsNumber })}
                    />
                  </label>
                  {activeOrder && (
                    <label>
                      Status
                      <select
                        value={draft.status}
                        onChange={(event) => setDraft({ ...draft, status: event.target.value as Status })}
                      >
                        {ORDER_STATUSES.map((status) => <option key={status}>{status}</option>)}
                      </select>
                    </label>
                  )}
                  <button type="submit" disabled={isSaving}>
                    {isSaving ? "Saving…" : activeOrder ? "Save changes" : "Save order"}
                  </button>
                </form>
              </>
            ) : activeOrder ? (
              <>
                <h2 id="order-panel-title">{activeOrder.customerName}</h2>
                <p>{activeOrder.phone}</p>
                <label>
                  Status
                  <select
                    value={activeOrder.status}
                    disabled={isBusy}
                    onChange={(event) => changeStatus(event.target.value as Status)}
                  >
                    {ORDER_STATUSES.map((status) => <option key={status}>{status}</option>)}
                  </select>
                </label>
                <h3>{activeOrder.productName}</h3>
                <p>Order ID: {activeOrder.id}</p>
                <p>Unit price {formatUSD(activeOrder.unitPrice)} USD</p>
                <p>Quantity {activeOrder.quantity} · Total {formatUSD(activeOrder.total)} USD</p>
                <footer className="panel-actions">
                  <button type="button" className="secondary" disabled={isBusy} onClick={() => startEditing(activeOrder)}>
                    Edit order
                  </button>
                  <button type="button" className="danger" onClick={removeOrder} disabled={isBusy}>
                    {isDeleting ? "Deleting…" : "Delete"}
                  </button>
                </footer>
              </>
            ) : null}
          </div>
        </div>
      )}
    </main>
  );
}
