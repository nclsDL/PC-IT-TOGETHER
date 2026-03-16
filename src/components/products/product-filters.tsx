"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface ProductFiltersProps {
  categories: Array<{ id: string; name: string; slug: string }>;
  activeCategory?: string;
  activeSort?: string;
}

export function ProductFilters({
  categories,
  activeCategory,
  activeSort,
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
        <div className="space-y-1.5">
          <button
            onClick={() => updateFilter("category", null)}
            className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              !activeCategory
                ? "bg-brand/10 text-brand font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateFilter("category", cat.slug)}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                activeCategory === cat.slug
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
          {[
            { value: "", label: "Newest" },
            { value: "price-asc", label: "Price: Low to High" },
            { value: "price-desc", label: "Price: High to Low" },
            { value: "name", label: "Name: A-Z" },
            { value: "rating", label: "Best Rating" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() =>
                updateFilter("sort", option.value || null)
              }
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                (activeSort || "") === option.value
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
  );
}
