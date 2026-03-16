export const dynamic = "force-dynamic";

import { prisma, withRetry } from "@/lib/db";
import { ProductsClient } from "@/components/products/products-client";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;

  let products: Array<{
    id: string;
    name: string;
    slug: string;
    price: number;
    salePrice: number | null;
    brand: string | null;
    images: string[];
    rating: number;
    reviewCount: number;
    isFlashDeal: boolean;
    isNewArrival: boolean;
    createdAt: Date;
    category: { id: string; name: string; slug: string };
  }> = [];
  let categories: Array<{ id: string; name: string; slug: string }> = [];

  try {
    [products, categories] = await Promise.all([
      withRetry(() =>
        prisma.product.findMany({
          where: { isActive: true },
          include: { category: true },
          orderBy: { createdAt: "desc" },
        })
      ),
      withRetry(() => prisma.category.findMany({ orderBy: { name: "asc" } })),
    ]);
  } catch {
    // DB not connected yet
  }

  return (
    <ProductsClient
      allProducts={JSON.parse(JSON.stringify(products))}
      categories={categories}
      initialSearch={params.q}
    />
  );
}
