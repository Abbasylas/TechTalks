import "server-only";
import type { CreateOrderFields, Order, OrderChanges } from "@/lib/order-types";

// Share one order list across route handlers in this local server process.
// Temporary orders can reset during development reloads or server restarts.
const sharedState = globalThis as typeof globalThis & {
  nourOrderDeskOrders?: Order[];
};
sharedState.nourOrderDeskOrders ??= [];

export function listOrders(): Order[] {
  return sharedState.nourOrderDeskOrders!;
}

export function findOrder(id: string): Order | undefined {
  return listOrders().find((order) => order.id === id);
}

// Multiply dollar values directly and round the resulting total to two decimals.
function calculateTotal(quantity: number, unitPrice: number): number {
  return Number((quantity * unitPrice).toFixed(2));
}

// Generate the ID and total on the server and start each new order as Pending.
export function createOrder(fields: CreateOrderFields): Order {
  const order: Order = {
    id: crypto.randomUUID(),
    ...fields,
    total: calculateTotal(fields.quantity, fields.unitPrice),
    status: "Pending",
  };
  listOrders().unshift(order);
  return order;
}

// Apply validated fields together, then recalculate the total from saved values.
export function updateOrder(id: string, changes: OrderChanges): Order | undefined {
  const order = findOrder(id);
  if (!order) return undefined;

  const updated = { ...order, ...changes };
  updated.total = calculateTotal(updated.quantity, updated.unitPrice);
  Object.assign(order, updated);
  return order;
}

export function deleteOrder(id: string): boolean {
  const index = listOrders().findIndex((order) => order.id === id);
  if (index < 0) return false;
  listOrders().splice(index, 1);
  return true;
}
