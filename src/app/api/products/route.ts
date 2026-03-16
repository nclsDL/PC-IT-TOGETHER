import { NextRequest, NextResponse } from "next/server";
import { prisma, withRetry } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const q = searchParams.get("q");
    const sort = searchParams.get("sort");
    const componentType = searchParams.get("componentType");

    const where: Record<string, unknown> = { isActive: true };

    if (category) {
      where.category = { slug: category };
    }

    if (componentType) {
      where.componentType = componentType;
    }

    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { brand: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }

    let orderBy: Record<string, string> = { createdAt: "desc" };
    if (sort === "price-asc") orderBy = { price: "asc" };
    if (sort === "price-desc") orderBy = { price: "desc" };
    if (sort === "name") orderBy = { name: "asc" };
    if (sort === "rating") orderBy = { rating: "desc" };

    const products = await withRetry(() =>
      prisma.product.findMany({
        where,
        orderBy,
        include: { category: true },
      })
    );

    return NextResponse.json(products);
  } catch (error) {
    console.error("Products fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
