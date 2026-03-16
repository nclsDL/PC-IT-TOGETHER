export const dynamic = "force-dynamic";

import { prisma, withRetry } from "@/lib/db";
import { HeroSection } from "@/components/home/hero-section";
import { FlashDeals } from "@/components/home/flash-deals";
import { BrowseByCategory } from "@/components/home/browse-by-category";
import { BestSellingProducts } from "@/components/home/best-selling-products";
import { GamingBanner } from "@/components/home/gaming-banner";
import { ExploreProducts } from "@/components/home/explore-products";
import { NewArrivals } from "@/components/home/new-arrivals";

async function getHomeData() {
  try {
    const [categories, flashDeals, bestSelling, featured, newArrivals] =
      await Promise.all([
        withRetry(() => prisma.category.findMany({ orderBy: { name: "asc" } })),
        withRetry(() =>
          prisma.product.findMany({
            where: { isFlashDeal: true, isActive: true },
            include: { category: true },
            take: 6,
          })
        ),
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
            where: { isActive: true },
            include: { category: true },
            orderBy: { rating: "desc" },
          })
        ),
        withRetry(() =>
          prisma.product.findMany({
            where: { isNewArrival: true, isActive: true },
            include: { category: true },
            take: 5,
            orderBy: { createdAt: "desc" },
          })
        ),
      ]);

    return { categories, flashDeals, bestSelling, featured, newArrivals };
  } catch {
    return {
      categories: [],
      flashDeals: [],
      bestSelling: [],
      featured: [],
      newArrivals: [],
    };
  }
}

export default async function HomePage() {
  const { categories, flashDeals, bestSelling, featured, newArrivals } =
    await getHomeData();

  return (
    <div>
      <HeroSection />
      <FlashDeals products={flashDeals} />
      <BrowseByCategory categories={categories} />
      <BestSellingProducts products={bestSelling} />
      <GamingBanner />
      <ExploreProducts products={featured} categories={categories} />
      <NewArrivals products={newArrivals} />
    </div>
  );
}
