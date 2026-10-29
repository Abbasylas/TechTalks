import { NextResponse } from "next/server";
import { get, patch, remove, type Order } from "../store";

type Context = { params: Promise<{ id: string }> };

// Return the requested order, or a 404 response when its ID is unknown.
export async function GET(_request: Request, { params }: Context) {
  const order = get((await params).id);
  return order
    ? NextResponse.json(order)
    : NextResponse.json({ error: "Not found" }, { status: 404 });
}

// Validate editable fields, save them, and return the updated order.
export async function PATCH(request: Request, { params }: Context) {
  try {
    const changes = await request.json() as Partial<Order>;
    const validStatus = ["Pending", "Preparing", "Delivered"].includes(changes.status ?? "Pending");
    const invalidQuantity = changes.quantity !== undefined
      && (!Number.isInteger(changes.quantity) || changes.quantity < 1);
    const invalidPrice = changes.unitPrice !== undefined
      && (!Number.isFinite(changes.unitPrice) || changes.unitPrice < 0);
    if (invalidQuantity || invalidPrice || !validStatus) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const order = patch((await params).id, changes);
    return order
      ? NextResponse.json(order)
      : NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}

// Delete an order by ID and report when no matching order exists.
export async function DELETE(_request: Request, { params }: Context) {
  return remove((await params).id)
    ? NextResponse.json({ ok: true })
    : NextResponse.json({ error: "Not found" }, { status: 404 });
}
