"use client";

import { useEffect, useState } from "react";
import { Zap } from "lucide-react";
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

export function FlashDeals({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="py-12 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-brand/20 rounded p-1">
              <Zap className="h-5 w-5 text-brand" />
            </div>
            <h2 className="text-2xl font-bold text-white">Flash Deals</h2>
          </div>

          <span className="bg-red-500 text-white text-sm font-semibold px-4 py-1.5 rounded-full">
            Limited Time Offer
          </span>
        </div>

        {/* Products */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              isFlashDeal
            />
          ))}
        </div>
      </div>
    </section>
  );
}
