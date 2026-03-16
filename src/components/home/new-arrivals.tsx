import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";
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

export function NewArrivals({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  const [featured, ...rest] = products;

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-brand rounded p-1">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">New Arrivals</h2>
          </div>
          <Link href="/products?sort=newest" className="text-sm font-medium text-brand hover:underline">
            View All →
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Featured Promo Card */}
          <Link
            href={`/products/${featured.slug}`}
            className="relative bg-gradient-to-br from-brand via-green-600 to-gray-900 rounded-2xl overflow-hidden flex flex-col justify-between min-h-[400px] group"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.1),transparent_60%)]" />
            <div className="relative z-10 p-8 flex-1 flex flex-col justify-between">
              <div>
                <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                  NEW ARRIVAL
                </span>
                <h3 className="text-white text-3xl sm:text-4xl font-bold leading-tight mb-2">
                  {featured.name}
                </h3>
                <p className="text-white/70 text-sm max-w-xs">
                  Discover the latest addition to our collection
                </p>
              </div>
              <div className="flex items-end justify-between mt-6">
                <span className="text-white/90 text-sm font-semibold group-hover:underline">
                  Shop Now →
                </span>
                <Image
                  src={featured.images[0] || "/placeholder.svg"}
                  alt={featured.name}
                  width={220}
                  height={220}
                  className="object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] max-h-[200px] w-auto"
                />
              </div>
            </div>
          </Link>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-2 gap-4">
            {rest.slice(0, 4).map((product) => (
              <ProductCard key={product.id} {...product} badge="NEW" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
