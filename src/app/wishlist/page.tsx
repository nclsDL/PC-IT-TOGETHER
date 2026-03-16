"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star, Trash2 } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist-store";
import { useCartStore } from "@/store/cart-store";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Your wishlist is empty
        </h1>
        <p className="text-gray-500 mb-6">
          Save items you love to your wishlist and come back to them anytime.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-brand text-white px-8 py-3 rounded-lg font-semibold hover:bg-brand-dark transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-brand transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">Wishlist</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Wishlist ({items.length})
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Remove */}
            <div className="flex justify-end p-2">
              <button
                onClick={() => {
                  removeItem(item.id);
                  toast.success("Removed from wishlist");
                }}
                className="p-1.5 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <Link href={`/products/${item.slug}`}>
              <div className="h-40 bg-gray-50 flex items-center justify-center px-4">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={150}
                  height={150}
                  className="object-contain h-full w-auto"
                />
              </div>
            </Link>

            <div className="p-3">
              <Link href={`/products/${item.slug}`}>
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 hover:text-brand transition-colors">
                  {item.name}
                </h3>
              </Link>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-brand font-bold font-mono tracking-tight">
                  {formatPrice(item.salePrice ?? item.price)}
                </span>
                {item.salePrice && (
                  <span className="text-gray-400 text-sm line-through font-mono tracking-tight">
                    {formatPrice(item.price)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(item.rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="text-xs text-gray-500">
                  ({item.reviewCount})
                </span>
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
                className="w-full flex items-center justify-center gap-1.5 bg-brand text-white text-sm font-medium py-2 rounded-md hover:bg-brand-dark transition-colors"
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
