import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createPayPalOrder } from "@/lib/paypal";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { total } = await request.json();

    if (!total || total <= 0) {
      return NextResponse.json({ error: "Invalid total" }, { status: 400 });
    }

    const orderId = await createPayPalOrder(total);

    return NextResponse.json({ orderId });
  } catch (error) {
    console.error("PayPal create order error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
