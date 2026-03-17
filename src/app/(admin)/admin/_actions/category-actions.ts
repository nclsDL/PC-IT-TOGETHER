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

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export async function createCategory(data: {
  name: string;
  description?: string;
  image?: string;
}) {
  await requireAdmin();
  const slug = slugify(data.name);

  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) return { error: "A category with this name already exists" };

  await withRetry(() =>
    prisma.category.create({
      data: {
        name: data.name,
        slug,
        description: data.description || null,
        image: data.image || null,
      },
    })
  );

  revalidatePath("/admin/categories");
  revalidatePath("/products");
  return { success: true };
}

export async function updateCategory(
  id: string,
  data: { name: string; description?: string; image?: string }
) {
  await requireAdmin();
  const slug = slugify(data.name);

  const existing = await prisma.category.findFirst({
    where: { slug, NOT: { id } },
  });
  if (existing) return { error: "A category with this name already exists" };

  await withRetry(() =>
    prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        slug,
        description: data.description || null,
        image: data.image || null,
      },
    })
  );

  revalidatePath("/admin/categories");
  revalidatePath("/products");
  return { success: true };
}

export async function deleteCategory(id: string) {
  await requireAdmin();

  const productCount = await prisma.product.count({
    where: { categoryId: id },
  });
  if (productCount > 0) {
    return {
      error: `Cannot delete: ${productCount} product${productCount > 1 ? "s" : ""} in this category`,
    };
  }

  await withRetry(() => prisma.category.delete({ where: { id } }));

  revalidatePath("/admin/categories");
  return { success: true };
}
