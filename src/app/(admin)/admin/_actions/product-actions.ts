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

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export async function createProduct(data: {
  name: string;
  description: string;
  price: number;
  salePrice?: number | null;
  images: string[];
  categoryId: string;
  brand: string;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  isFlashDeal: boolean;
  isNewArrival: boolean;
  componentType?: string | null;
  socketType?: string | null;
  memoryType?: string | null;
  formFactor?: string | null;
  wattage?: number | null;
  specs?: Record<string, unknown> | null;
}) {
  await requireAdmin();

  const slug = slugify(data.name);

  // Check for duplicate slug
  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) {
    return { error: "A product with a similar name already exists" };
  }

  await withRetry(() =>
    prisma.product.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        price: data.price,
        salePrice: data.salePrice || null,
        images: data.images.filter(Boolean),
        categoryId: data.categoryId,
        brand: data.brand,
        stock: data.stock,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        isFlashDeal: data.isFlashDeal,
        isNewArrival: data.isNewArrival,
        componentType: data.componentType as never,
        socketType: data.socketType || null,
        memoryType: data.memoryType || null,
        formFactor: data.formFactor || null,
        wattage: data.wattage || null,
        specs: data.specs ? JSON.parse(JSON.stringify(data.specs)) : undefined,
      },
    })
  );

  revalidatePath("/admin/products");
  revalidatePath("/products");
  return { success: true };
}

export async function updateProduct(
  id: string,
  data: {
    name: string;
    description: string;
    price: number;
    salePrice?: number | null;
    images: string[];
    categoryId: string;
    brand: string;
    stock: number;
    isActive: boolean;
    isFeatured: boolean;
    isFlashDeal: boolean;
    isNewArrival: boolean;
    componentType?: string | null;
    socketType?: string | null;
    memoryType?: string | null;
    formFactor?: string | null;
    wattage?: number | null;
    specs?: Record<string, unknown> | null;
  }
) {
  await requireAdmin();

  const slug = slugify(data.name);

  // Check for duplicate slug (excluding current product)
  const existing = await prisma.product.findFirst({
    where: { slug, NOT: { id } },
  });
  if (existing) {
    return { error: "A product with a similar name already exists" };
  }

  await withRetry(() =>
    prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        slug,
        description: data.description,
        price: data.price,
        salePrice: data.salePrice || null,
        images: data.images.filter(Boolean),
        categoryId: data.categoryId,
        brand: data.brand,
        stock: data.stock,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        isFlashDeal: data.isFlashDeal,
        isNewArrival: data.isNewArrival,
        componentType: data.componentType as never,
        socketType: data.socketType || null,
        memoryType: data.memoryType || null,
        formFactor: data.formFactor || null,
        wattage: data.wattage || null,
        specs: data.specs ? JSON.parse(JSON.stringify(data.specs)) : undefined,
      },
    })
  );

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath(`/products/${slug}`);
  return { success: true };
}

export async function deleteProduct(id: string) {
  await requireAdmin();

  await withRetry(() => prisma.product.delete({ where: { id } }));

  revalidatePath("/admin/products");
  revalidatePath("/products");
  return { success: true };
}

export async function toggleProductStatus(id: string) {
  await requireAdmin();

  const product = await prisma.product.findUnique({
    where: { id },
    select: { isActive: true },
  });

  if (!product) return { error: "Product not found" };

  await withRetry(() =>
    prisma.product.update({
      where: { id },
      data: { isActive: !product.isActive },
    })
  );

  revalidatePath("/admin/products");
  revalidatePath("/products");
  return { success: true };
}
