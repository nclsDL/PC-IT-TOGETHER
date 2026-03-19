"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist-store";
import { useCartStore } from "@/store/cart-store";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";
import { StarRating } from "@/components/ui/star-rating";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-0 py-20 text-center">
        <p className="text-black/40">Loading wishlist...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-0 py-20 text-center">
        <Heart className="h-16 w-16 text-black/20 mx-auto mb-4" />
        <h1 className="font-display text-[40px] font-bold text-black mb-2">
          Your wishlist is empty
        </h1>
        <p className="text-base text-black/60 mb-8">
          Save items you love to your wishlist and come back to them anytime.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-brand text-white px-14 py-4 rounded-full font-medium hover:bg-brand-dark transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-0 py-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Wishlist" }]} />

      <h1 className="font-display text-[40px] font-bold text-black mt-6 mb-6">
        WISHLIST ({items.length})
      </h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {items.map((item) => (
          <div key={item.id} className="group">
            {/* Image */}
            <Link href={`/products/${item.slug}`} className="block">
              <div className="relative bg-surface-alt rounded-[20px] overflow-hidden aspect-square flex items-center justify-center p-6">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={280}
                  height={280}
                  className="object-contain max-h-full w-auto group-hover:scale-105 transition-transform"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    removeItem(item.id);
                    toast.success("Removed from wishlist");
                  }}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white text-sale transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </Link>

            {/* Info */}
            <div className="mt-4">
              <h3 className="font-bold text-base text-black leading-tight mb-2">
                <Link href={`/products/${item.slug}`} className="hover:text-black/60 transition-colors">
                  {item.name}
                </Link>
              </h3>
              <div className="mb-2">
                <StarRating rating={item.rating} size="sm" />
              </div>
              <div className="flex items-center gap-2.5 mb-4">
                <span className="font-bold text-2xl text-black">
                  {formatPrice(item.salePrice ?? item.price)}
                </span>
                {item.salePrice && (
                  <span className="font-bold text-2xl text-black/40 line-through">
                    {formatPrice(item.price)}
                  </span>
                )}
              </div>
              <button
                onClick={() => {
                  addItem({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    salePrice: item.salePrice,
                    image: item.image,
                    slug: item.slug,
                  });
                  toast.success("Added to cart");
                }}
                className="w-full bg-brand text-white font-medium text-sm py-3 rounded-full hover:bg-brand-dark transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
