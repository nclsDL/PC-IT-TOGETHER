import { prisma, withRetry } from "@/lib/db";
import { ProductForm } from "@/components/admin/product-form";

export default async function NewProductPage() {
  const categories = await withRetry(() =>
    prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    })
  );

  return <ProductForm categories={categories} />;
}
