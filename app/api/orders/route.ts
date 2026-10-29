import { NextResponse } from "next/server";
import { createOrder, listOrders } from "@/lib/orders";
import type { CreateOrderFields } from "@/lib/order-types";
import { isRecord, isValidPrice } from "@/lib/order-validation";

// Return all orders as the collection JSON response.
export async function GET() {
  return NextResponse.json(listOrders(), { status: 200 });
}

// Validate the submitted fields before creating an order in the shared store.
export async function POST(request: Request) {
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
      { error: "Order details must be a JSON object." },
      { status: 400 },
    );
  }
  if (typeof body.customerName !== "string" || !body.customerName.trim()) {
    return NextResponse.json({ error: "Customer name is required." }, { status: 400 });
  }
  if (typeof body.phone !== "string" || !body.phone.trim()) {
    return NextResponse.json({ error: "Phone must be a nonblank text value." }, { status: 400 });
  }
  if (typeof body.productName !== "string" || !body.productName.trim()) {
    return NextResponse.json({ error: "Product name is required." }, { status: 400 });
  }
  if (!Number.isInteger(body.quantity) || Number(body.quantity) < 1) {
    return NextResponse.json(
      { error: "Quantity must be a positive integer." },
      { status: 400 },
    );
  }
  if (!isValidPrice(body.unitPrice)) {
    return NextResponse.json(
      { error: "Unit price must be finite, nonnegative, and have at most two decimal places." },
      { status: 400 },
    );
  }

  const fields: CreateOrderFields = {
    customerName: body.customerName.trim(),
    phone: body.phone.trim(),
    productName: body.productName.trim(),
    quantity: body.quantity as number,
    unitPrice: body.unitPrice,
  };

  // The server generates the ID and total and sets every new order to Pending.
  return NextResponse.json(createOrder(fields), { status: 201 });
}
