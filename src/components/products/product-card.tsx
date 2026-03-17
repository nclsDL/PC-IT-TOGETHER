"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";
import { StarRating } from "@/components/ui/star-rating";

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
  badge,
}: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(id);

  const discount = salePrice
    ? Math.round(((price - salePrice) / price) * 100)
    : 0;

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem({
      id,
      name,
      price,
      salePrice,
      image: images[0] || "/placeholder.svg",
      slug,
      rating,
      reviewCount: 0,
    });
    toast.success(inWishlist ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <div className="group transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1">
      {/* Double Bezel — Outer Shell */}
      <div className="p-[3px] rounded-[1.5rem] bg-black/[0.02] ring-1 ring-black/[0.04] transition-shadow duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
        {/* Inner Core */}
        <div className="rounded-[calc(1.5rem-3px)] bg-white overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
          {/* Image */}
          <Link href={`/products/${slug}`} className="block relative">
            <div className="relative aspect-square flex items-center justify-center p-8 bg-gradient-to-b from-dust-grey-50/50 to-white">
              <Image
                src={images[0] || "/placeholder.svg"}
                alt={name}
                width={280}
                height={280}
                className="object-contain max-h-full w-auto transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
              />
              {/* Wishlist — Glass Circle */}
              <button
                onClick={handleToggleWishlist}
                className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 ${
                  inWishlist
                    ? "bg-sale/10 text-sale"
                    : "bg-white/60 text-dust-grey-400 hover:bg-white/80 hover:text-dust-grey-600"
                }`}
              >
                <Heart className="h-4 w-4" strokeWidth={1.5} fill={inWishlist ? "currentColor" : "none"} />
              </button>
            </div>
          </Link>

          {/* Info */}
          <div className="px-5 pb-5 pt-4">
            <h3 className="font-semibold text-[15px] text-dust-grey-900 leading-snug mb-2 line-clamp-2 min-h-[2.5rem]">
              <Link href={`/products/${slug}`} className="hover:text-brand transition-colors duration-300">
                {name}
              </Link>
            </h3>

            {/* Rating */}
            <div className="mb-3">
              <StarRating rating={rating} size="sm" />
            </div>

            {/* Price */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-bold text-xl text-dust-grey-900 tracking-[-0.02em]">
                {formatPrice(salePrice ?? price)}
              </span>
              {salePrice && (
                <span className="font-medium text-base text-dust-grey-300 line-through">
                  {formatPrice(price)}
                </span>
              )}
              {discount > 0 && (
                <span className="bg-sale/10 text-sale text-[11px] font-semibold px-2.5 py-1 rounded-full">
                  -{discount}%
                </span>
              )}
              {badge && !salePrice && (
                <span className="bg-brand/10 text-brand text-[11px] font-semibold px-2.5 py-1 rounded-full">
                  {badge}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
