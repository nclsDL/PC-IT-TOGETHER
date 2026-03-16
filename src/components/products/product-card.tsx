"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number | null;
  images: string[];
  rating: number;
  reviewCount: number;
  isFlashDeal?: boolean;
  badge?: string;
}

export function ProductCard({
  id,
  name,
  slug,
  price,
  salePrice,
  images,
  rating,
  reviewCount,
  isFlashDeal,
  badge,
}: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(id);

  const discount = salePrice
    ? Math.round(((price - salePrice) / price) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem({
      id,
      name,
      price,
      salePrice,
      image: images[0] || "/placeholder.svg",
      slug,
    });
    toast.success(`${name} added to cart`);
  };

  const handleToggleWishlist = () => {
    toggleItem({
      id,
      name,
      price,
      salePrice,
      image: images[0] || "/placeholder.svg",
      slug,
      rating,
      reviewCount,
    });
    toast.success(inWishlist ? `Removed from wishlist` : `Added to wishlist`);
  };

  return (
    <div className="group block">
      <div className="relative bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
        {/* Badges */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          {isFlashDeal && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
              SALE
            </span>
          )}
          {badge && (
            <span className="bg-brand text-white text-[10px] font-bold px-2 py-0.5 rounded">
              {badge}
            </span>
          )}
          {discount > 0 && !isFlashDeal && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
              -{discount}%
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="absolute top-2 right-2 z-10 flex flex-col gap-1.5">
          <button
            onClick={handleToggleWishlist}
            className={`p-1.5 rounded-full bg-white shadow-sm hover:bg-gray-50 transition-colors ${
              inWishlist ? "text-red-500" : "text-gray-400"
            }`}
          >
            <Heart className="h-4 w-4" fill={inWishlist ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Image */}
        <Link href={`/products/${slug}`}>
          <div className="relative h-48 bg-gray-50 flex items-center justify-center p-4">
            <Image
              src={images[0] || "/placeholder.svg"}
              alt={name}
              width={180}
              height={180}
              className="object-contain h-full w-auto group-hover:scale-105 transition-transform"
            />
          </div>
        </Link>

        {/* Info */}
        <div className="p-3">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 min-h-[2.5rem] mb-1">
            <Link href={`/products/${slug}`} className="hover:text-brand transition-colors">
              {name}
            </Link>
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-brand font-bold font-mono text-base tracking-tight">
              {formatPrice(salePrice ?? price)}
            </span>
            {salePrice && (
              <span className="text-gray-400 text-xs font-mono line-through">
                {formatPrice(price)}
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < Math.floor(rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">({reviewCount})</span>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-1.5 bg-brand text-white text-sm font-medium py-2 rounded-md hover:bg-brand-dark transition-colors"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
