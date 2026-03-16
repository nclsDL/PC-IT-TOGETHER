"use client";

import { useState } from "react";
import Link from "next/link";
import { Layers } from "lucide-react";
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
  category: { id: string; slug: string };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export function ExploreProducts({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filtered =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category.slug === activeCategory);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-brand rounded p-1">
            <Layers className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Explore Our Products
          </h2>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === "all"
                ? "bg-brand text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.slug)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat.slug
                  ? "bg-brand text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.slice(0, 8).map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-gray-500 py-12">
            No products found in this category.
          </p>
        )}

        {filtered.length > 8 && (
          <div className="text-center mt-8">
            <Link
              href={activeCategory === "all" ? "/products" : `/products?category=${activeCategory}`}
              className="inline-block px-8 py-3 bg-brand text-white font-semibold rounded-lg hover:bg-brand/90 transition-colors"
            >
              View All Products
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
