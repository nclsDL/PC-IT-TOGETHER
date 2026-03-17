"use server";

import { prisma, withRetry } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });
  if (!dbUser || dbUser.role !== "ADMIN") throw new Error("Forbidden");
}

export async function createCoupon(data: {
  code: string;
  discountPercent: number;
  isActive: boolean;
  expiresAt?: string | null;
}) {
  await requireAdmin();

  const existing = await prisma.coupon.findUnique({
    where: { code: data.code.toUpperCase() },
  });
  if (existing) return { error: "Coupon code already exists" };

  await withRetry(() =>
    prisma.coupon.create({
      data: {
        code: data.code.toUpperCase(),
        discountPercent: data.discountPercent,
        isActive: data.isActive,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      },
    })
  );

  revalidatePath("/admin/coupons");
  return { success: true };
}

export async function updateCoupon(
  id: string,
  data: {
    code: string;
    discountPercent: number;
    isActive: boolean;
    expiresAt?: string | null;
  }
) {
  await requireAdmin();

  const existing = await prisma.coupon.findFirst({
    where: { code: data.code.toUpperCase(), NOT: { id } },
  });
  if (existing) return { error: "Coupon code already exists" };

  await withRetry(() =>
    prisma.coupon.update({
      where: { id },
      data: {
        code: data.code.toUpperCase(),
        discountPercent: data.discountPercent,
        isActive: data.isActive,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      },
    })
  );

  revalidatePath("/admin/coupons");
  return { success: true };
}

export async function deleteCoupon(id: string) {
  await requireAdmin();

  const orderCount = await prisma.order.count({ where: { couponId: id } });
  if (orderCount > 0) {
    return {
      error: `Cannot delete: coupon used in ${orderCount} order${orderCount > 1 ? "s" : ""}`,
    };
  }

  await withRetry(() => prisma.coupon.delete({ where: { id } }));

  revalidatePath("/admin/coupons");
  return { success: true };
}
