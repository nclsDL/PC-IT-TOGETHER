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

export async function updateOrderStatus(
  id: string,
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED"
) {
  await requireAdmin();

  await withRetry(() =>
    prisma.order.update({ where: { id }, data: { status } })
  );

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  return { success: true };
}
