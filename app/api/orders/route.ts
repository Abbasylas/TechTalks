import { NextResponse } from "next/server";
import { create, list } from "./store";

// Return the current server-side order list to the dashboard.
export async function GET() {
  return NextResponse.json(list());
}

// Check submitted order fields before saving, then return the saved order.
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const valid = data.customer?.trim() && data.phone?.trim() && data.product?.trim()
      && Number.isInteger(data.quantity) && data.quantity > 0
      && Number.isFinite(data.unitPrice) && data.unitPrice >= 0;
    if (!valid) {
      return NextResponse.json({ error: "Please enter valid order details." }, { status: 400 });
    }
    return NextResponse.json(create(data), { status: 201 });
  } catch {
    return NextResponse.json({ error: "Please enter valid order details." }, { status: 400 });
  }
}
