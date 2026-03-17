import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { capturePayPalPayment } from "@/lib/paypal";
import { prisma, withRetry } from "@/lib/db";
import { syncUser } from "@/lib/supabase/sync-user";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure user exists in Prisma database
    await syncUser(user);

    const { orderId, items } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    const captureData = await capturePayPalPayment(orderId);

    if (captureData.status === "COMPLETED") {
      const total = items.reduce(
        (sum: number, item: { price: number; quantity: number }) =>
          sum + item.price * item.quantity,
        0
      );

      const order = await withRetry(() =>
        prisma.order.create({
          data: {
            userId: user.id,
            total,
            status: "COMPLETED",
            paypalOrderId: orderId,
            items: {
              create: items.map(
                (item: {
                  productId: string;
                  quantity: number;
                  price: number;
                }) => ({
                  productId: item.productId,
                  quantity: item.quantity,
                  price: item.price,
                })
              ),
            },
          },
        })
      );

      return NextResponse.json({ success: true, order });
    }

    return NextResponse.json(
      { error: "Payment not completed" },
      { status: 400 }
    );
  } catch (error) {
    console.error("PayPal capture error:", error);
    return NextResponse.json(
      { error: "Failed to capture payment" },
      { status: 500 }
    );
  }
}
