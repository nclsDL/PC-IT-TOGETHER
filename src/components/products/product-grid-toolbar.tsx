"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";

interface ProductGridToolbarProps {
  brands: string[];
  activeBrand?: string;
  activeMinPrice?: string;
  activeMaxPrice?: string;
  activeOnSale?: string;
  productCount: number;
}

const PRICE_RANGES = [
  { label: "Under ₱5,000", min: "", max: "5000" },
  { label: "₱5,000 - ₱15,000", min: "5000", max: "15000" },
  { label: "₱15,000 - ₱30,000", min: "15000", max: "30000" },
  { label: "₱30,000 - ₱50,000", min: "30000", max: "50000" },
  { label: "Over ₱50,000", min: "50000", max: "" },
];

export function ProductGridToolbar({
  brands,
  activeBrand,
  activeMinPrice,
  activeMaxPrice,
  activeOnSale,
  productCount,
}: ProductGridToolbarProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeFilters: string[] = [];
  if (activeBrand) activeFilters.push(`Brand: ${activeBrand}`);
  if (activeMinPrice || activeMaxPrice) {
    const range = PRICE_RANGES.find(
      (r) => r.min === (activeMinPrice || "") && r.max === (activeMaxPrice || "")
    );
    activeFilters.push(range ? range.label : "Custom price");
  }
  if (activeOnSale === "true") activeFilters.push("On Sale");

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }
    router.push(`/products?${params.toString()}`);
  };

  const clearAllFilters = () => {
    updateFilters({
      brand: null,
      minPrice: null,
      maxPrice: null,
      onSale: null,
    });
  };

  const toggleBrand = (b: string) => {
    const current = activeBrand ? activeBrand.split(",") : [];
    const updated = current.includes(b)
      ? current.filter((x) => x !== b)
      : [...current, b];
    updateFilters({ brand: updated.length > 0 ? updated.join(",") : null });
  };

  const setPriceRange = (min: string, max: string) => {
    const isSame = (activeMinPrice || "") === min && (activeMaxPrice || "") === max;
    updateFilters({
      minPrice: isSame ? null : min || null,
      maxPrice: isSame ? null : max || null,
    });
  };

  const toggleOnSale = () => {
    updateFilters({ onSale: activeOnSale === "true" ? null : "true" });
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <p className="text-sm text-gray-500">
        {productCount} product{productCount !== 1 ? "s" : ""}
      </p>

      <div className="flex items-center gap-2">
        {activeFilters.length > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1"
          >
            <X className="h-3 w-3" />
            Clear filters
          </button>
        )}

        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen(!open)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
              activeFilters.length > 0
                ? "border-brand bg-brand/5 text-brand"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filter
            {activeFilters.length > 0 && (
              <span className="bg-brand text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFilters.length}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 z-50 p-4 space-y-5">
              {/* On Sale */}
              <div>
                <button
                  onClick={toggleOnSale}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeOnSale === "true"
                      ? "bg-brand/10 text-brand font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  On Sale Only
                  {activeOnSale === "true" && (
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
                  {PRICE_RANGES.map((range) => {
                    const isActive =
                      (activeMinPrice || "") === range.min &&
                      (activeMaxPrice || "") === range.max;
                    return (
                      <button
                        key={range.label}
                        onClick={() => setPriceRange(range.min, range.max)}
                        className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          isActive
                            ? "bg-brand/10 text-brand font-medium"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {range.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Brands */}
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Brand
                </h4>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {brands.map((b) => {
                    const isActive = activeBrand?.split(",").includes(b);
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
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
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
          )}
        </div>
      </div>
    </div>
  );
}
