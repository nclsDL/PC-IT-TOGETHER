"use client";

import { useState, useMemo } from "react";
import { SlidersHorizontal, ChevronRight, ChevronDown, X } from "lucide-react";
import { ProductCard } from "@/components/products/product-card";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

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
  { value: "popular", label: "Most Popular" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
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
  initialCategory,
  initialSale,
  initialNew,
}: {
  allProducts: Product[];
  categories: Category[];
  initialSearch?: string;
  initialCategory?: string;
  initialSale?: boolean;
  initialNew?: boolean;
}) {
  const [category, setCategory] = useState<string | null>(initialCategory ?? null);
  const [sort, setSort] = useState("popular");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number | null>(null);
  const [onSale, setOnSale] = useState(initialSale ?? false);
  const [newArrivals, setNewArrivals] = useState(initialNew ?? false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
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

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.category.name.toLowerCase().includes(q)
      );
    }

    if (category) {
      result = result.filter((p) => p.category.slug === category);
    }

    if (selectedBrands.length > 0) {
      result = result.filter((p) => p.brand && selectedBrands.includes(p.brand));
    }

    if (priceRange !== null) {
      const range = PRICE_RANGES[priceRange];
      result = result.filter((p) => p.price >= range.min && p.price <= range.max);
    }

    if (onSale) {
      result = result.filter((p) => p.salePrice !== null);
    }

    if (newArrivals) {
      result = result.filter((p) => p.isNewArrival);
    }

    result = [...result].sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return (a.salePrice ?? a.price) - (b.salePrice ?? b.price);
        case "price-desc":
          return (b.salePrice ?? b.price) - (a.salePrice ?? a.price);
        case "rating":
          return b.rating - a.rating;
        case "popular":
          return b.reviewCount - a.reviewCount;
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return result;
  }, [allProducts, search, category, selectedBrands, priceRange, onSale, sort]);

  const toggleBrand = (b: string) => {
    setSelectedBrands((prev) =>
      prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]
    );
  };

  const clearAllFilters = () => {
    setCategory(null);
    setSelectedBrands([]);
    setPriceRange(null);
    setOnSale(false);
    setNewArrivals(false);
  };

  const currentCategoryName = category
    ? categories.find((c) => c.slug === category)?.name || "Shop"
    : "All Products";

  const filterSidebarContent = (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-xl text-black">Filters</h3>
        <SlidersHorizontal className="h-6 w-6 text-black/40" />
      </div>

      <div className="h-px bg-black/10" />

      {/* Categories */}
      <div className="flex flex-col gap-5">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(category === cat.slug ? null : cat.slug)}
            className={`flex items-center justify-between text-base transition-colors ${
              category === cat.slug ? "text-black font-medium" : "text-black/60 hover:text-black"
            }`}
          >
            {cat.name}
            <ChevronRight className="h-4 w-4" />
          </button>
        ))}
      </div>

      <div className="h-px bg-black/10" />

      {/* Price */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h4 className="font-bold text-xl text-black">Price</h4>
          <ChevronDown className="h-4 w-4" />
        </div>
        <div className="flex flex-col gap-2">
          {PRICE_RANGES.map((range, i) => (
            <button
              key={range.label}
              onClick={() => setPriceRange(priceRange === i ? null : i)}
              className={`text-left text-sm px-3 py-2 rounded-full transition-colors ${
                priceRange === i
                  ? "bg-brand text-white font-medium"
                  : "bg-surface text-black/60 hover:text-black"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-black/10" />

      {/* Brands */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h4 className="font-bold text-xl text-black">Brands</h4>
          <ChevronDown className="h-4 w-4" />
        </div>
        <div className="flex flex-wrap gap-2">
          {brands.map((b) => (
            <button
              key={b}
              onClick={() => toggleBrand(b)}
              className={`text-sm px-5 py-2.5 rounded-full transition-colors ${
                selectedBrands.includes(b)
                  ? "bg-brand text-white font-medium"
                  : "bg-surface text-black/60 hover:text-black"
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-black/10" />

      {/* On Sale */}
      <button
        onClick={() => setOnSale(!onSale)}
        className={`flex items-center justify-between text-base transition-colors ${
          onSale ? "text-black font-medium" : "text-black/60 hover:text-black"
        }`}
      >
        On Sale Only
        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
          onSale ? "bg-brand border-brand" : "border-black/20"
        }`}>
          {onSale && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </button>

      {/* New Arrivals */}
      <button
        onClick={() => setNewArrivals(!newArrivals)}
        className={`flex items-center justify-between text-base transition-colors ${
          newArrivals ? "text-black font-medium" : "text-black/60 hover:text-black"
        }`}
      >
        New Arrivals Only
        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
          newArrivals ? "bg-brand border-brand" : "border-black/20"
        }`}>
          {newArrivals && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </button>

      {/* Apply button */}
      <button
        onClick={() => setMobileFiltersOpen(false)}
        className="bg-brand text-white font-medium text-sm py-4 rounded-full hover:bg-brand-dark transition-colors"
      >
        Apply Filter
      </button>
    </div>
  );

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-0 py-6">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: currentCategoryName },
        ]}
      />

      <div className="flex gap-5 mt-6">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-[295px] shrink-0 border border-black/10 rounded-[20px] p-6 h-fit sticky top-24">
          {filterSidebarContent}
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-bold text-[32px] text-black">{currentCategoryName}</h1>
            <div className="flex items-center gap-4">
              <p className="text-base text-black/60 hidden sm:block">
                Showing 1-{filtered.length} of {filtered.length} Products
              </p>
              <div className="flex items-center gap-2">
                <span className="text-base text-black/60 hidden sm:block">Sort by:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="text-base font-medium text-black bg-transparent focus:outline-none cursor-pointer"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mobile filter button */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden p-2 rounded-full bg-surface"
              >
                <SlidersHorizontal className="h-5 w-5" />
              </button>
            </div>
          </div>

          {search && (
            <p className="text-black/60 mb-4">
              Results for &ldquo;{search}&rdquo;
            </p>
          )}

          {/* Active filters */}
          {(category || selectedBrands.length > 0 || priceRange !== null || onSale || newArrivals) && (
            <div className="flex flex-wrap gap-2 mb-6">
              {category && (
                <span className="bg-surface text-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  {categories.find(c => c.slug === category)?.name}
                  <button onClick={() => setCategory(null)}><X className="h-3.5 w-3.5" /></button>
                </span>
              )}
              {selectedBrands.map(b => (
                <span key={b} className="bg-surface text-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  {b}
                  <button onClick={() => toggleBrand(b)}><X className="h-3.5 w-3.5" /></button>
                </span>
              ))}
              {priceRange !== null && (
                <span className="bg-surface text-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  {PRICE_RANGES[priceRange].label}
                  <button onClick={() => setPriceRange(null)}><X className="h-3.5 w-3.5" /></button>
                </span>
              )}
              {onSale && (
                <span className="bg-surface text-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  On Sale
                  <button onClick={() => setOnSale(false)}><X className="h-3.5 w-3.5" /></button>
                </span>
              )}
              {newArrivals && (
                <span className="bg-surface text-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  New Arrivals
                  <button onClick={() => setNewArrivals(false)}><X className="h-3.5 w-3.5" /></button>
                </span>
              )}
              <button
                onClick={clearAllFilters}
                className="text-sm text-sale underline"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Products Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-black/60 text-lg">No products found.</p>
              <p className="text-black/40 text-sm mt-1">
                Try adjusting your search or filters.
              </p>
            </div>
          )}

          {/* Pagination placeholder */}
          {filtered.length > 0 && (
            <div className="border-t border-black/10 mt-10 pt-5 flex items-center justify-between">
              <button className="flex items-center gap-2 px-3.5 py-2 border border-black/10 rounded-lg text-sm font-medium text-black hover:bg-surface transition-colors">
                Previous
              </button>
              <div className="flex gap-0.5">
                <span className="w-10 h-10 rounded-lg bg-black/5 flex items-center justify-center text-sm font-medium">1</span>
              </div>
              <button className="flex items-center gap-2 px-3.5 py-2 border border-black/10 rounded-lg text-sm font-medium text-black hover:bg-surface transition-colors">
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      {mobileFiltersOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-50" onClick={() => setMobileFiltersOpen(false)} />
          <div className="fixed right-0 top-0 bottom-0 w-[300px] bg-white z-50 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-xl">Filters</h3>
              <button onClick={() => setMobileFiltersOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            {filterSidebarContent}
          </div>
        </>
      )}
    </div>
  );
}
