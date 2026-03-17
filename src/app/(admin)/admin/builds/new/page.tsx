import { prisma, withRetry } from "@/lib/db";
import { BuildForm } from "@/components/admin/build-form";

export default async function NewBuildPage() {
  const products = await withRetry(() =>
    prisma.product.findMany({
      where: { isActive: true },
      select: { id: true, name: true, componentType: true, price: true },
      orderBy: { name: "asc" },
    })
  );

  return <BuildForm products={products} />;
}
