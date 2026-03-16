"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "@/components/products/product-card";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice: number | null;
  brand: string | null;
  images: string[];
  rating: number;
  reviewCount: number;
  isFlashDeal: boolean;
  isNewArrival: boolean;
  createdAt: string;
  category: { id: string; name: string; slug: string };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name", label: "Name: A-Z" },
  { value: "rating", label: "Best Rating" },
];

const PRICE_RANGES = [
  { label: "Under ₱5,000", min: 0, max: 5000 },
  { label: "₱5,000 – ₱15,000", min: 5000, max: 15000 },
  { label: "₱15,000 – ₱30,000", min: 15000, max: 30000 },
  { label: "₱30,000 – ₱50,000", min: 30000, max: 50000 },
  { label: "Over ₱50,000", min: 50000, max: Infinity },
];

export function ProductsClient({
  allProducts,
  categories,
  initialSearch,
}: {
  allProducts: Product[];
  categories: Category[];
  initialSearch?: string;
}) {
  const [category, setCategory] = useState<string | null>(null);
  const [sort, setSort] = useState("newest");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number | null>(null);
  const [onSale, setOnSale] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [search] = useState(initialSearch || "");

  const brands = useMemo(() => {
    const set = new Set<string>();
    allProducts.forEach((p) => {
      if (p.brand) set.add(p.brand);
    });
    return Array.from(set).sort();
  }, [allProducts]);

  const filtered = useMemo(() => {
    let result = allProducts;

    // Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.category.name.toLowerCase().includes(q)
      );
    }

    // Category
    if (category) {
      result = result.filter((p) => p.category.slug === category);
    }

    // Brand
    if (selectedBrands.length > 0) {
      result = result.filter((p) => p.brand && selectedBrands.includes(p.brand));
    }

    // Price range
    if (priceRange !== null) {
      const range = PRICE_RANGES[priceRange];
      result = result.filter((p) => p.price >= range.min && p.price <= range.max);
    }

    // On sale
    if (onSale) {
      result = result.filter((p) => p.salePrice !== null);
    }

    // Sort
    result = [...result].sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return (a.salePrice ?? a.price) - (b.salePrice ?? b.price);
        case "price-desc":
          return (b.salePrice ?? b.price) - (a.salePrice ?? a.price);
        case "name":
          return a.name.localeCompare(b.name);
        case "rating":
          return b.rating - a.rating;
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return result;
  }, [allProducts, search, category, selectedBrands, priceRange, onSale, sort]);

  const activeFilterCount =
    (selectedBrands.length > 0 ? 1 : 0) +
    (priceRange !== null ? 1 : 0) +
    (onSale ? 1 : 0);

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setPriceRange(null);
    setOnSale(false);
  };

  const toggleBrand = (b: string) => {
    setSelectedBrands((prev) =>
      prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-brand transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">
          {category
            ? categories.find((c) => c.slug === category)?.name || "Shop"
            : search
            ? `Search: "${search}"`
            : "Shop"}
        </span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block lg:w-64 shrink-0">
          <div className="space-y-6">
            {/* Categories */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
              <div className="space-y-1.5">
                <button
                  onClick={() => setCategory(null)}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    !category
                      ? "bg-brand/10 text-brand font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  All Products
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.slug)}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      category === cat.slug
                        ? "bg-brand/10 text-brand font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Sort By</h3>
              <div className="space-y-1.5">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSort(option.value)}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      sort === option.value
                        ? "bg-brand/10 text-brand font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              {filtered.length} product{filtered.length !== 1 ? "s" : ""}
            </p>

            <div className="flex items-center gap-2">
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Clear filters
                </button>
              )}

              <div className="relative">
                <button
                  onClick={() => setFilterOpen(!filterOpen)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    activeFilterCount > 0
                      ? "border-brand bg-brand/5 text-brand"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filter
                  {activeFilterCount > 0 && (
                    <span className="bg-brand text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {filterOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setFilterOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 z-50 p-4 space-y-5 max-h-[80vh] overflow-y-auto">
                      {/* Categories - Mobile Only */}
                      <div className="lg:hidden">
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                          Category
                        </h4>
                        <div className="space-y-1 max-h-40 overflow-y-auto">
                          <button
                            onClick={() => { setCategory(null); setFilterOpen(false); }}
                            className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                              !category
                                ? "bg-brand/10 text-brand font-medium"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            All Products
                          </button>
                          {categories.map((cat) => (
                            <button
                              key={cat.id}
                              onClick={() => { setCategory(cat.slug); setFilterOpen(false); }}
                              className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                                category === cat.slug
                                  ? "bg-brand/10 text-brand font-medium"
                                  : "text-gray-600 hover:bg-gray-100"
                              }`}
                            >
                              {cat.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Sort - Mobile Only */}
                      <div className="lg:hidden">
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                          Sort By
                        </h4>
                        <div className="space-y-1">
                          {SORT_OPTIONS.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => { setSort(option.value); setFilterOpen(false); }}
                              className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                                sort === option.value
                                  ? "bg-brand/10 text-brand font-medium"
                                  : "text-gray-600 hover:bg-gray-100"
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* On Sale */}
                      <div>
                        <button
                          onClick={() => setOnSale(!onSale)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                            onSale
                              ? "bg-brand/10 text-brand font-medium"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          On Sale Only
                          {onSale && (
                            <span className="text-brand text-xs">Active</span>
                          )}
                        </button>
                      </div>

                      {/* Price Range */}
                      <div>
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                          Price Range
                        </h4>
                        <div className="space-y-1">
                          {PRICE_RANGES.map((range, i) => (
                            <button
                              key={range.label}
                              onClick={() =>
                                setPriceRange(priceRange === i ? null : i)
                              }
                              className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                                priceRange === i
                                  ? "bg-brand/10 text-brand font-medium"
                                  : "text-gray-600 hover:bg-gray-100"
                              }`}
                            >
                              {range.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Brands */}
                      <div>
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                          Brand
                        </h4>
                        <div className="space-y-1 max-h-48 overflow-y-auto">
                          {brands.map((b) => {
                            const isActive = selectedBrands.includes(b);
                            return (
                              <button
                                key={b}
                                onClick={() => toggleBrand(b)}
                                className={`flex items-center gap-2 w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                                  isActive
                                    ? "bg-brand/10 text-brand font-medium"
                                    : "text-gray-600 hover:bg-gray-100"
                                }`}
                              >
                                <span
                                  className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                                    isActive
                                      ? "bg-brand border-brand"
                                      : "border-gray-300"
                                  }`}
                                >
                                  {isActive && (
                                    <svg
                                      className="w-3 h-3 text-white"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                      strokeWidth={3}
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  )}
                                </span>
                                {b}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {search && (
            <p className="text-gray-600 mb-4">
              Showing results for &ldquo;{search}&rdquo; ({filtered.length}{" "}
              found)
            </p>
          )}

          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No products found.</p>
              <p className="text-gray-400 text-sm mt-1">
                Try adjusting your search or filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
