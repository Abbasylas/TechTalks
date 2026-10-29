// Keep shared field names in one place for the API and interactive form.
export const ORDER_STATUSES = ["Pending", "Preparing", "Delivered"] as const;
export const EDITABLE_ORDER_FIELDS = [
  "customerName",
  "phone",
  "productName",
  "quantity",
  "unitPrice",
  "status",
] as const;

export type Status = (typeof ORDER_STATUSES)[number];

export type Order = {
  id: string;
  customerName: string;
  phone: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  status: Status;
};

export type CreateOrderFields = Omit<Order, "id" | "total" | "status">;
export type EditableOrderFields = Omit<Order, "id" | "total">;
export type OrderChanges = Partial<EditableOrderFields>;
