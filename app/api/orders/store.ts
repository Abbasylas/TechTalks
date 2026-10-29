export type Order = {
  id: string;
  customer: string;
  phone: string;
  product: string;
  quantity: number;
  unitPrice: number;
  status: "Pending" | "Preparing" | "Delivered";
  notes: string;
};

// Keep orders in server memory for this database-free first version.
// The list starts empty and is reset when the server process restarts.
const sharedState = globalThis as typeof globalThis & { orders?: Order[] };
sharedState.orders ??= [];

// Give API routes access to the same list for the life of the server.
export const list = () => sharedState.orders!;

// Look up one order by its generated ID.
export const get = (id: string) => list().find((order) => order.id === id);

// Create an order with a unique ID and the required starting status.
export function create(data: Partial<Order>) {
  const order: Order = {
    id: crypto.randomUUID(),
    customer: data.customer!.trim(),
    phone: data.phone!.trim(),
    product: data.product!,
    quantity: data.quantity!,
    unitPrice: data.unitPrice!,
    status: "Pending",
    notes: data.notes || "",
  };
  list().unshift(order);
  return order;
}

// Apply the changed fields to an existing order and return it, if found.
export function patch(id: string, changes: Partial<Order>) {
  const order = get(id);
  if (order) Object.assign(order, changes);
  return order;
}

// Remove an order by ID and report whether it existed.
export function remove(id: string) {
  const index = list().findIndex((order) => order.id === id);
  if (index < 0) return false;
  list().splice(index, 1);
  return true;
}
