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
  return user;
}

export async function updateUserRole(
  userId: string,
  role: "USER" | "ADMIN"
) {
  const currentUser = await requireAdmin();

  // Cannot change own role
  if (currentUser.id === userId) {
    return { error: "Cannot change your own role" };
  }

  await withRetry(() =>
    prisma.user.update({ where: { id: userId }, data: { role } })
  );

  revalidatePath("/admin/users");
  return { success: true };
}
