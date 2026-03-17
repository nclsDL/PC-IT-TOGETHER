import { prisma, withRetry } from "@/lib/db";
import { ProductForm } from "@/components/admin/product-form";
import { notFound } from "next/navigation";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product, categories] = await withRetry(() =>
    Promise.all([
      prisma.product.findUnique({ where: { id } }),
      prisma.category.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      }),
    ])
  );

  if (!product) notFound();

  return (
    <ProductForm
      product={{
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        salePrice: product.salePrice,
        images: product.images.length > 0 ? product.images : [""],
        categoryId: product.categoryId,
        brand: product.brand,
        stock: product.stock,
        isActive: product.isActive,
        isFeatured: product.isFeatured,
        isFlashDeal: product.isFlashDeal,
        isNewArrival: product.isNewArrival,
        componentType: product.componentType,
        socketType: product.socketType,
        memoryType: product.memoryType,
        formFactor: product.formFactor,
        wattage: product.wattage,
        specs: product.specs as Record<string, unknown> | null,
      }}
      categories={categories}
    />
  );
}
