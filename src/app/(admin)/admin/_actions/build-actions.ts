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

export async function createBuild(data: {
  name: string;
  description: string;
  price: number;
  tier: string;
  image?: string | null;
  productIds: string[];
}) {
  await requireAdmin();

  await withRetry(() =>
    prisma.prebuiltBuild.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        tier: data.tier as never,
        image: data.image || null,
        products: { connect: data.productIds.map((id) => ({ id })) },
      },
    })
  );

  revalidatePath("/admin/builds");
  return { success: true };
}

export async function updateBuild(
  id: string,
  data: {
    name: string;
    description: string;
    price: number;
    tier: string;
    image?: string | null;
    productIds: string[];
  }
) {
  await requireAdmin();

  await withRetry(() =>
    prisma.prebuiltBuild.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        tier: data.tier as never,
        image: data.image || null,
        products: {
          set: [],
          connect: data.productIds.map((id) => ({ id })),
        },
      },
    })
  );

  revalidatePath("/admin/builds");
  return { success: true };
}

export async function deleteBuild(id: string) {
  await requireAdmin();

  await withRetry(() => prisma.prebuiltBuild.delete({ where: { id } }));

  revalidatePath("/admin/builds");
  return { success: true };
}
