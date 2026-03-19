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

    const { orderId, items, couponCode } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    const captureData = await capturePayPalPayment(orderId);

    if (captureData.status === "COMPLETED") {
      const subtotal = items.reduce(
        (sum: number, item: { price: number; quantity: number }) =>
          sum + item.price * item.quantity,
        0
      );

      // Apply coupon discount
      let total = subtotal;
      let couponId: string | null = null;
      if (couponCode) {
        const coupon = await prisma.coupon.findUnique({
          where: { code: couponCode },
        });
        const notExpired = !coupon?.expiresAt || new Date(coupon.expiresAt) > new Date();
        if (coupon && coupon.isActive && notExpired) {
          total = subtotal - subtotal * (coupon.discountPercent / 100);
          couponId = coupon.id;
        }
      }

      const order = await withRetry(() =>
        prisma.order.create({
          data: {
            userId: user.id,
            total,
            status: "COMPLETED",
            paypalOrderId: orderId,
            couponId,
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
