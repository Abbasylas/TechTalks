"use client";

import { useEffect, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
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

export default function OrderDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState<OrderDraft>(emptyDraft);

  // Load the server's order list when the dashboard first appears.
  async function loadOrders() {
    const response = await fetch("/api/orders");
    if (!response.ok) throw new Error("Unable to load orders.");
    setOrders((await response.json()) as Order[]);
  }

  useEffect(() => {
    let isCurrent = true;

    fetch("/api/orders")
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load orders.");
        return response.json() as Promise<Order[]>;
      })
      .then((savedOrders) => {
        if (isCurrent) setOrders(savedOrders);
      })
      .catch(() => {
        if (isCurrent) setError("Unable to load orders. Please refresh and try again.");
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  const summary = {
    total: orders.length,
    pending: orders.filter((order) => order.status === "Pending").length,
    delivered: orders.filter((order) => order.status === "Delivered").length,
  };

  function startNewOrder() {
    setActiveOrder(null);
    setDraft({ ...emptyDraft });
    setError("");
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
    setError("");
    setIsEditing(true);
  }

  function handleOrderKeyDown(event: KeyboardEvent<HTMLTableRowElement>, order: Order) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setActiveOrder(order);
      setIsEditing(false);
    }
  }

  // Validate before sending; the API remains the final authority on order data.
  async function saveOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const hasValidText = Boolean(
      draft.customerName.trim() && draft.phone.trim() && draft.productName.trim(),
    );
    const hasValidQuantity = Number.isInteger(draft.quantity) && draft.quantity >= 1;
    const hasValidPrice = Number.isFinite(draft.unitPrice)
      && draft.unitPrice >= 0
      && Number(draft.unitPrice.toFixed(2)) === draft.unitPrice;

    if (!hasValidText || !hasValidQuantity || !hasValidPrice) {
      setError("Enter names, a positive whole quantity, and a price with up to two decimal places.");
      return;
    }

    const payload: OrderDraft = {
      ...draft,
      customerName: draft.customerName.trim(),
      phone: draft.phone.trim(),
      productName: draft.productName.trim(),
    };
    const response = await fetch(
      activeOrder ? `/api/orders/${activeOrder.id}` : "/api/orders",
      {
        method: activeOrder ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    const result = await response.json();

    if (!response.ok) {
      setError(result.error ?? "Unable to save this order.");
      return;
    }

    await loadOrders();
    setActiveOrder(result as Order);
    setIsEditing(false);
  }

  // Ask for confirmation before removing an order through the API.
  async function deleteOrder() {
    if (!activeOrder || !window.confirm(`Delete the order for ${activeOrder.customerName}?`)) {
      return;
    }

    const response = await fetch(`/api/orders/${activeOrder.id}`, { method: "DELETE" });
    if (!response.ok) {
      const result = await response.json();
      setError(result.error ?? "Unable to delete this order.");
      return;
    }

    setActiveOrder(null);
    await loadOrders();
  }

  async function changeStatus(status: Status) {
    if (!activeOrder) return;

    const response = await fetch(`/api/orders/${activeOrder.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const result = await response.json();

    if (!response.ok) {
      setError(result.error ?? "Unable to update this order.");
      return;
    }

    setActiveOrder(result as Order);
    await loadOrders();
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
            <button type="button" onClick={startNewOrder}>＋ New order</button>
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
          {error && <p className="error" role="alert">{error}</p>}

          <div className="table">
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
                    onClick={() => {
                      setActiveOrder(order);
                      setIsEditing(false);
                    }}
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
            {orders.length === 0 && (
              <div className="empty">
                <h3>No orders yet</h3>
                <p>Orders you add will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {(activeOrder || isEditing) && (
        <div className="shade" onClick={() => { setIsEditing(false); setActiveOrder(null); }}>
          <div
            className="panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-panel-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="x"
              type="button"
              aria-label="Close order panel"
              onClick={() => {
                setIsEditing(false);
                setActiveOrder(null);
              }}
            >
              ×
            </button>

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
                      value={draft.quantity}
                      onChange={(event) => setDraft({ ...draft, quantity: Number(event.target.value) })}
                    />
                  </label>
                  <label>
                    Unit price (USD)
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      value={draft.unitPrice}
                      onChange={(event) => setDraft({ ...draft, unitPrice: Number(event.target.value) })}
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
                  <button type="submit">{activeOrder ? "Save changes" : "Save order"}</button>
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
                    onChange={(event) => changeStatus(event.target.value as Status)}
                  >
                    {ORDER_STATUSES.map((status) => <option key={status}>{status}</option>)}
                  </select>
                </label>
                <h3>{activeOrder.productName}</h3>
                <p>Quantity {activeOrder.quantity} · Total {formatUSD(activeOrder.total)} USD</p>
                <footer className="panel-actions">
                  <button type="button" className="secondary" onClick={() => startEditing(activeOrder)}>
                    Edit order
                  </button>
                  <button type="button" className="danger" onClick={deleteOrder}>
                    Delete
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
