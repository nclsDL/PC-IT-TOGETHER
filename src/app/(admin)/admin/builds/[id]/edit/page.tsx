import { prisma, withRetry } from "@/lib/db";
import { BuildForm } from "@/components/admin/build-form";
import { notFound } from "next/navigation";

export default async function EditBuildPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [build, products] = await withRetry(() =>
    Promise.all([
      prisma.prebuiltBuild.findUnique({
        where: { id },
        include: { products: { select: { id: true } } },
      }),
      prisma.product.findMany({
        where: { isActive: true },
        select: { id: true, name: true, componentType: true, price: true },
        orderBy: { name: "asc" },
      }),
    ])
  );

  if (!build) notFound();

  return (
    <BuildForm
      build={{
        id: build.id,
        name: build.name,
        description: build.description,
        price: build.price,
        tier: build.tier,
        image: build.image,
        productIds: build.products.map((p) => p.id),
      }}
      products={products}
    />
  );
}
