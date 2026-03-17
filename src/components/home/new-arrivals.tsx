import Link from "next/link";
import { ArrowRight } from "lucide-react";
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

  return (
    <section className="py-28">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block rounded-full px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] font-medium bg-brand/10 text-brand mb-5">
            Just Landed
          </span>
          <h2 className="font-display text-[40px] lg:text-[52px] font-bold text-dust-grey-900 tracking-[-0.02em]">
            NEW ARRIVALS
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/products?sort=newest"
            className="group inline-flex items-center border border-black/10 text-dust-grey-900 font-medium text-[15px] pl-7 pr-2 py-2 rounded-full hover:border-brand hover:text-brand active:scale-[0.98] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
          >
            View All
            <span className="ml-3 w-9 h-9 rounded-full bg-black/[0.04] flex items-center justify-center group-hover:bg-brand/10 transition-colors duration-500">
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]" strokeWidth={1.5} />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
