import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ error: "Invalid promo code" }, { status: 404 });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({ error: "Promo code has expired" }, { status: 410 });
    }

    return NextResponse.json({
      code: coupon.code,
      discountPercent: coupon.discountPercent,
    });
  } catch {
    return NextResponse.json({ error: "Failed to validate" }, { status: 500 });
  }
}
