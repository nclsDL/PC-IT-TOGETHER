"use client";

import Image from "next/image";
import { useState } from "react";
import { Minus, Plus, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";
import { StarRating } from "@/components/ui/star-rating";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice: number | null;
  images: string[];
  brand: string;
  stock: number;
  rating: number;
  reviewCount: number;
  specs: unknown;
  componentType: string | null;
  category: { name: string };
}

export function ProductDetail({ product }: { product: Product }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(product.id);

  const discount = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const specs = product.specs as Record<string, string> | null;
  const specEntries = specs ? Object.entries(specs) : [];

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        salePrice: product.salePrice,
        image: product.images[0] || "/placeholder.svg",
        slug: product.slug,
      },
      quantity
    );
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Image Gallery — Double Bezel */}
      <div className="flex gap-3.5">
        {/* Thumbnails */}
        <div className="flex flex-col gap-3">
          {product.images.slice(0, 3).map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedImage(i)}
              className={`p-[2px] rounded-[1rem] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                selectedImage === i
                  ? "ring-2 ring-brand bg-brand/5"
                  : "bg-black/[0.02] ring-1 ring-black/[0.04] hover:ring-black/10"
              }`}
            >
              <div className="w-[130px] h-[140px] rounded-[calc(1rem-2px)] bg-white overflow-hidden flex items-center justify-center p-3">
                <Image
                  src={img}
                  alt={`${product.name} thumbnail ${i + 1}`}
                  width={130}
                  height={140}
                  className="object-contain w-full h-full"
                />
              </div>
            </button>
          ))}
        </div>

        {/* Main Image — Double Bezel */}
        <div className="flex-1 p-[3px] rounded-[1.5rem] bg-black/[0.02] ring-1 ring-black/[0.04]">
          <div className="bg-white rounded-[calc(1.5rem-3px)] flex items-center justify-center p-10 min-h-[400px] lg:min-h-[480px] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
            <Image
              src={product.images[selectedImage] || "/placeholder.svg"}
              alt={product.name}
              width={500}
              height={500}
              className="object-contain max-h-[400px]"
            />
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="py-2">
        <h1 className="font-display text-[36px] lg:text-[42px] font-bold text-dust-grey-900 leading-[1] tracking-[-0.02em] mb-4">
          {product.name}
        </h1>

        {/* Rating */}
        <div className="flex items-center gap-4 mb-5">
          <StarRating rating={product.rating} size="md" />
          <span className="text-[15px] text-dust-grey-400">
            ({product.reviewCount} reviews)
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-3 mb-6">
          <span className="font-bold text-[32px] text-dust-grey-900 tracking-[-0.02em]">
            {formatPrice(product.salePrice ?? product.price)}
          </span>
          {product.salePrice && (
            <>
              <span className="font-medium text-[24px] text-dust-grey-300 line-through">
                {formatPrice(product.price)}
              </span>
              <span className="bg-sale/10 text-sale font-semibold text-sm px-3 py-1 rounded-full">
                -{discount}%
              </span>
            </>
          )}
        </div>

        {/* Description */}
        <p className="text-[15px] text-dust-grey-500 leading-[1.7] mb-7">
          {product.description}
        </p>

        <div className="h-px bg-gradient-to-r from-dust-grey-200 to-transparent mb-7" />

        {/* Key Specs — Pill chips with inner shadow */}
        {specEntries.length > 0 && (
          <>
            <p className="text-[13px] uppercase tracking-[0.15em] font-medium text-dust-grey-400 mb-4">Key Specifications</p>
            <div className="flex flex-wrap gap-2.5 mb-7">
              {specEntries.slice(0, 6).map(([key, value]) => (
                <span
                  key={key}
                  className="bg-surface ring-1 ring-black/[0.04] text-dust-grey-600 text-[14px] px-4 py-2 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]"
                >
                  {key}: {String(value)}
                </span>
              ))}
            </div>
            <div className="h-px bg-gradient-to-r from-dust-grey-200 to-transparent mb-7" />
          </>
        )}

        {/* Brand & Category */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-7 text-[14px] text-dust-grey-400">
          <span>Brand: <strong className="text-dust-grey-900">{product.brand}</strong></span>
          <span>Category: <strong className="text-dust-grey-900">{product.category.name}</strong></span>
          {product.stock > 0 ? (
            <span className="text-brand font-medium">In Stock ({product.stock})</span>
          ) : (
            <span className="text-sale font-medium">Out of Stock</span>
          )}
        </div>

        <div className="h-px bg-gradient-to-r from-dust-grey-200 to-transparent mb-7" />

        {/* Quantity + Add to Cart */}
        <div className="flex items-center gap-4">
          {/* Quantity — Glass Pill */}
          <div className="p-[2px] rounded-full bg-black/[0.03] ring-1 ring-black/[0.04]">
            <div className="flex items-center bg-white rounded-full">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3.5 hover:bg-black/[0.03] rounded-l-full transition-colors duration-300"
              >
                <Minus className="h-4 w-4 text-dust-grey-600" strokeWidth={1.5} />
              </button>
              <span className="w-10 text-center font-medium text-[15px] text-dust-grey-900">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="p-3.5 hover:bg-black/[0.03] rounded-r-full transition-colors duration-300"
              >
                <Plus className="h-4 w-4 text-dust-grey-600" strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* Add to Cart — Button-in-Button */}
          <button
            onClick={handleAddToCart}
            className="group flex-1 flex items-center justify-center bg-brand text-white font-medium text-[15px] pl-7 pr-2 py-2.5 rounded-full hover:bg-brand-dark active:scale-[0.98] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
          >
            Add to Cart
            <span className="ml-3 w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]" strokeWidth={2} />
            </span>
          </button>
        </div>

        {/* Wishlist */}
        <button
          onClick={() => {
            toggleItem({
              id: product.id,
              name: product.name,
              price: product.price,
              salePrice: product.salePrice,
              image: product.images[0] || "/placeholder.svg",
              slug: product.slug,
              rating: product.rating,
              reviewCount: product.reviewCount,
            });
            toast.success(
              inWishlist ? "Removed from wishlist" : "Added to wishlist"
            );
          }}
          className="mt-5 text-[14px] text-dust-grey-400 hover:text-brand transition-colors duration-300 underline underline-offset-4 decoration-dust-grey-200 hover:decoration-brand"
        >
          {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
        </button>
      </div>
    </div>
  );
}
