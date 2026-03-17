export const revalidate = 300;

import { prisma, withRetry } from "@/lib/db";
import { HeroSection } from "@/components/home/hero-section";
import { BrandBar } from "@/components/home/brand-bar";
import { NewArrivals } from "@/components/home/new-arrivals";
import { BestSellingProducts } from "@/components/home/best-selling-products";
import { BrowseByCategory } from "@/components/home/browse-by-category";
import { HappyCustomers } from "@/components/home/happy-customers";

async function getHomeData() {
  try {
    const [categories, bestSelling, newArrivals] =
      await Promise.all([
        withRetry(() => prisma.category.findMany({ orderBy: { name: "asc" } })),
        withRetry(() =>
          prisma.product.findMany({
            where: { isFeatured: true, isActive: true },
            include: { category: true },
            take: 4,
            orderBy: { rating: "desc" },
          })
        ),
        withRetry(() =>
          prisma.product.findMany({
            where: { isNewArrival: true, isActive: true },
            include: { category: true },
            take: 4,
            orderBy: { createdAt: "desc" },
          })
        ),
      ]);

    return { categories, bestSelling, newArrivals };
  } catch {
    return {
      categories: [],
      bestSelling: [],
      newArrivals: [],
    };
  }
}

export default async function HomePage() {
  const { categories, bestSelling, newArrivals } =
    await getHomeData();

  return (
    <div>
      <HeroSection />
      <BrandBar />
      <NewArrivals products={newArrivals} />
      <BestSellingProducts products={bestSelling} />
      <BrowseByCategory categories={categories} />
      <HappyCustomers />
    </div>
  );
}
