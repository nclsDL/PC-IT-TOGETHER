export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { prisma, withRetry } from "@/lib/db";
import { ProductDetail } from "@/components/products/product-detail";
import { ProductCard } from "@/components/products/product-card";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let product = null;
  let relatedProducts: Array<{
    id: string;
    name: string;
    slug: string;
    price: number;
    salePrice: number | null;
    images: string[];
    rating: number;
    reviewCount: number;
    isFlashDeal: boolean;
  }> = [];

  try {
    product = await withRetry(() =>
      prisma.product.findUnique({
        where: { slug },
        include: { category: true },
      })
    );

    if (product) {
      relatedProducts = await withRetry(() =>
        prisma.product.findMany({
          where: {
            categoryId: product.categoryId,
            id: { not: product.id },
            isActive: true,
          },
          take: 4,
        })
      );
    }
  } catch {
    // DB not connected
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <span>Home</span>
        <span className="mx-2">/</span>
        <span>{product.category.name}</span>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">{product.name}</span>
      </nav>

      <ProductDetail product={product} />

      {/* Related Items */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-4 h-8 bg-brand rounded" />
            <h2 className="text-2xl font-bold text-gray-900">Related Items</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
