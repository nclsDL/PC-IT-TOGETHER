"use client";

import Image from "next/image";
import { useState } from "react";
import { Star, Heart, Minus, Plus, Truck, RotateCcw } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";

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

  const handleBuyNow = () => {
    handleAddToCart();
    window.location.href = "/cart";
  };

  return (
    <div className="grid lg:grid-cols-2 gap-10">
      {/* Image Gallery */}
      <div className="flex gap-4">
        {/* Thumbnails */}
        <div className="flex flex-col gap-2">
          {product.images.slice(0, 4).map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedImage(i)}
              className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                selectedImage === i ? "border-brand" : "border-gray-200"
              }`}
            >
              <Image
                src={img}
                alt={`${product.name} thumbnail ${i + 1}`}
                width={64}
                height={64}
                className="object-contain w-full h-full bg-gray-50 p-1"
              />
            </button>
          ))}
        </div>

        {/* Main Image */}
        <div className="flex-1 bg-gray-50 rounded-xl flex items-center justify-center p-8 min-h-[400px]">
          <Image
            src={product.images[selectedImage] || "/placeholder.svg"}
            alt={product.name}
            width={500}
            height={500}
            className="object-contain max-h-[400px]"
          />
        </div>
      </div>

      {/* Product Info */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {product.name}
        </h1>

        {/* Rating & Stock */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-sm text-gray-500 ml-1">
              ({product.reviewCount} reviews)
            </span>
          </div>
          <span className="text-sm font-medium text-brand">
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl font-bold text-gray-900 font-mono tracking-tight">
            {formatPrice(product.salePrice ?? product.price)}
          </span>
          {product.salePrice && (
            <>
              <span className="text-xl text-gray-400 line-through font-mono">
                {formatPrice(product.price)}
              </span>
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                -{discount}% OFF
              </span>
            </>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
          {product.description}
        </p>

        {/* Key Specs */}
        {specEntries.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Key Specs</h3>
            <div className="flex flex-wrap gap-2">
              {specEntries.slice(0, 5).map(([key, value]) => (
                <span
                  key={key}
                  className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full"
                >
                  {key}: {String(value)}
                </span>
              ))}
            </div>
          </div>
        )}

        <hr className="my-6" />

        {/* Quantity & Actions */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2.5 hover:bg-gray-50 transition-colors"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-12 text-center font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              className="p-2.5 hover:bg-gray-50 transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={handleBuyNow}
            className="flex-1 bg-brand text-white py-3 rounded-lg font-semibold hover:bg-brand-dark transition-colors"
          >
            Buy Now
          </button>

          <button
            onClick={handleAddToCart}
            className="flex-1 border-2 border-brand text-brand py-3 rounded-lg font-semibold hover:bg-brand hover:text-white transition-colors"
          >
            Add to Cart
          </button>

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
            className={`p-3 border-2 rounded-lg transition-colors ${
              inWishlist
                ? "border-red-500 text-red-500"
                : "border-gray-300 text-gray-400 hover:border-red-500 hover:text-red-500"
            }`}
          >
            <Heart
              className="h-5 w-5"
              fill={inWishlist ? "currentColor" : "none"}
            />
          </button>
        </div>

        {/* Delivery Info */}
        <div className="space-y-3 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Truck className="h-5 w-5 text-gray-600" />
            <div>
              <p className="text-sm font-medium">Free Delivery</p>
              <p className="text-xs text-gray-500">
                Free shipping on orders over ₱8,000
              </p>
            </div>
          </div>
          <hr />
          <div className="flex items-center gap-3">
            <RotateCcw className="h-5 w-5 text-gray-600" />
            <div>
              <p className="text-sm font-medium">Return Delivery</p>
              <p className="text-xs text-gray-500">
                Free 30 days return. <span className="underline">Details</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
