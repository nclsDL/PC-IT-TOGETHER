export const revalidate = 300;

import { notFound } from "next/navigation";
import { prisma, withRetry } from "@/lib/db";
import { ProductDetail } from "@/components/products/product-detail";
import { ProductCard } from "@/components/products/product-card";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let product: Awaited<ReturnType<typeof prisma.product.findUnique<{ where: { slug: string }; include: { category: true } }>>> = null;
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
            categoryId: product!.categoryId,
            id: { not: product!.id },
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
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-0 py-6">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/products" },
            { label: product.category.name, href: `/products?category=${product.category.slug}` },
            { label: product.name },
          ]}
        />
      </div>

      <div className="h-px bg-black/10 mb-9" />

      <ProductDetail product={product} />

      {/* Tabs Section */}
      <div className="mt-16">
        <div className="flex items-center border-b border-black/10">
          <button className="px-8 py-3 text-xl font-medium text-black/60 hover:text-black transition-colors">
            Product Details
          </button>
          <button className="px-8 py-3 text-xl font-medium text-black border-b-2 border-black">
            Specifications
          </button>
          <button className="px-8 py-3 text-xl font-medium text-black/60 hover:text-black transition-colors">
            FAQs
          </button>
        </div>
      </div>

      {/* You Might Also Like */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-[48px] font-bold text-black text-center mb-14">
            YOU MIGHT ALSO LIKE
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
