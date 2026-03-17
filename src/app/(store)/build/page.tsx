export const revalidate = 300;

import { prisma, withRetry } from "@/lib/db";
import { BuilderClient } from "@/components/builder/builder-client";

async function getBuilderData() {
  try {
    const [products, prebuilts] = await Promise.all([
      withRetry(() =>
        prisma.product.findMany({
          where: {
            isActive: true,
            componentType: { not: "PREBUILT" },
          },
          orderBy: { price: "asc" },
        })
      ),
      withRetry(() =>
        prisma.prebuiltBuild.findMany({
          include: { products: true },
          orderBy: { price: "asc" },
        })
      ),
    ]);
    return { products, prebuilts };
  } catch {
    return { products: [], prebuilts: [] };
  }
}

export default async function BuildPage() {
  const { products, prebuilts } = await getBuilderData();

  return <BuilderClient products={products} prebuilts={prebuilts} />;
}
