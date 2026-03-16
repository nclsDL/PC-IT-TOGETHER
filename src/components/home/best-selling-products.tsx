import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { ProductCard } from "@/components/products/product-card";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice: number | null;
  images: string[];
  rating: number;
  reviewCount: number;
  isFlashDeal: boolean;
}

export function BestSellingProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-brand rounded p-1">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Best Selling Products
            </h2>
          </div>
          <Link href="/products?sort=rating" className="text-sm font-medium text-brand hover:underline">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
}
