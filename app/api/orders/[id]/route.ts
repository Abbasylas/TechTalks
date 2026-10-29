import { NextResponse } from "next/server";
import { deleteOrder, findOrder, updateOrder } from "@/lib/orders";
import {
  EDITABLE_ORDER_FIELDS,
  ORDER_STATUSES,
  type OrderChanges,
  type Status,
} from "@/lib/order-types";
import { isRecord, isValidPrice } from "@/lib/order-validation";

type RouteContext = { params: Promise<{ id: string }> };

// Await Next.js 16 route params before looking up an order by its ID.
export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  const order = findOrder(id);

  return order
    ? NextResponse.json(order, { status: 200 })
    : NextResponse.json({ error: "Order not found." }, { status: 404 });
}

// Validate the full patch before applying any part of it to stored data.
export async function PATCH(request: Request, { params }: RouteContext) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must contain valid JSON." },
      { status: 400 },
    );
  }
  if (!isRecord(body)) {
    return NextResponse.json(
      { error: "Update must be a JSON object." },
      { status: 400 },
    );
  }

  const fields = EDITABLE_ORDER_FIELDS.filter((field) => Object.hasOwn(body, field));
  if (fields.length === 0) {
    return NextResponse.json(
      { error: "Provide at least one editable field to update." },
      { status: 400 },
    );
  }

  const changes: OrderChanges = {};
  for (const field of fields) {
    const value = body[field];

    if (field === "customerName" || field === "productName" || field === "phone") {
      if (typeof value !== "string" || !value.trim()) {
        const label = field === "customerName"
          ? "Customer name"
          : field === "productName" ? "Product name" : "Phone";
        return NextResponse.json(
          { error: `${label} must be nonblank text.` },
          { status: 400 },
        );
      }
      changes[field] = value.trim();
      continue;
    }

    if (field === "quantity") {
      if (!Number.isInteger(value) || Number(value) < 1) {
        return NextResponse.json(
          { error: "Quantity must be a positive integer." },
          { status: 400 },
        );
      }
      changes.quantity = value as number;
      continue;
    }

    if (field === "unitPrice") {
      if (!isValidPrice(value)) {
        return NextResponse.json(
          { error: "Unit price must be finite, nonnegative, and have at most two decimal places." },
          { status: 400 },
        );
      }
      changes.unitPrice = value;
      continue;
    }

    if (field === "status") {
      if (typeof value !== "string" || !ORDER_STATUSES.includes(value as Status)) {
        return NextResponse.json(
          { error: "Status must be Pending, Preparing, or Delivered." },
          { status: 400 },
        );
      }
      changes.status = value as Status;
    }
  }

  const { id } = await params;
  const order = updateOrder(id, changes);
  return order
    ? NextResponse.json(order, { status: 200 })
    : NextResponse.json({ error: "Order not found." }, { status: 404 });
}

// Delete the order and send an empty body with the required 204 status.
export async function DELETE(_request: Request, { params }: RouteContext) {
  const { id } = await params;

  return deleteOrder(id)
    ? new Response(null, { status: 204 })
    : NextResponse.json({ error: "Order not found." }, { status: 404 });
}
