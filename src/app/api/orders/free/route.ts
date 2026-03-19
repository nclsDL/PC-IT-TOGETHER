import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
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

    await syncUser(user);

    const { items, couponCode } = await request.json();

    const subtotal = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    );

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
          couponId,
          items: {
            create: items.map(
              (item: { productId: string; quantity: number; price: number }) => ({
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
  } catch (error) {
    console.error("Free order error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
