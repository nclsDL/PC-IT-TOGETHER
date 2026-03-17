"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  createBuild,
  updateBuild,
} from "@/app/(admin)/admin/_actions/build-actions";

const TIERS = ["BUDGET", "MIDRANGE", "HIGHEND", "ENTHUSIAST"];

type BuildData = {
  id?: string;
  name: string;
  description: string;
  price: number;
  tier: string;
  image: string | null;
  productIds: string[];
};

type Product = {
  id: string;
  name: string;
  componentType: string | null;
  price: number;
};

export function BuildForm({
  build,
  products,
}: {
  build?: BuildData;
  products: Product[];
}) {
  const router = useRouter();
  const [data, setData] = useState<BuildData>(
    build || {
      name: "",
      description: "",
      price: 0,
      tier: "MIDRANGE",
      image: null,
      productIds: [],
    }
  );
  const [loading, setLoading] = useState(false);
  const isEditing = !!build?.id;

  const update = <K extends keyof BuildData>(key: K, value: BuildData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleProduct = (productId: string) => {
    const ids = data.productIds.includes(productId)
      ? data.productIds.filter((id) => id !== productId)
      : [...data.productIds, productId];
    update("productIds", ids);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.name || !data.tier) {
      toast.error("Please fill in required fields");
      return;
    }
    setLoading(true);
    try {
      const result = isEditing
        ? await updateBuild(build!.id!, data)
        : await createBuild(data);

      if ("error" in result && typeof result.error === "string") {
        toast.error(result.error);
      } else {
        toast.success(isEditing ? "Build updated" : "Build created");
        router.push("/admin/builds");
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Group products by component type
  const grouped = products.reduce(
    (acc, product) => {
      const type = product.componentType || "Other";
      if (!acc[type]) acc[type] = [];
      acc[type].push(product);
      return acc;
    },
    {} as Record<string, Product[]>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {/* Basic Info */}
      <div className="p-[3px] rounded-[1.5rem] bg-black/[0.02] ring-1 ring-black/[0.04]">
        <div className="rounded-[calc(1.5rem-3px)] bg-white p-6 sm:p-8 space-y-5">
          <h2 className="text-base font-display font-semibold tracking-[-0.01em] text-dust-grey-900">
            Build Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium uppercase tracking-[0.08em] text-dust-grey-500">
                Name <span className="text-sale">*</span>
              </label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => update("name", e.target.value)}
                className="form-input"
                placeholder="Build name"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium uppercase tracking-[0.08em] text-dust-grey-500">
                Tier <span className="text-sale">*</span>
              </label>
              <select
                value={data.tier}
                onChange={(e) => update("tier", e.target.value)}
                className="form-input"
              >
                {TIERS.map((tier) => (
                  <option key={tier} value={tier}>
                    {tier}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium uppercase tracking-[0.08em] text-dust-grey-500">
              Description
            </label>
            <textarea
              value={data.description}
              onChange={(e) => update("description", e.target.value)}
              className="form-input min-h-[80px]"
              rows={3}
              placeholder="Build description"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium uppercase tracking-[0.08em] text-dust-grey-500">
                Price
              </label>
              <input
                type="number"
                value={data.price || ""}
                onChange={(e) =>
                  update("price", parseFloat(e.target.value) || 0)
                }
                className="form-input"
                min={0}
                step={0.01}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium uppercase tracking-[0.08em] text-dust-grey-500">
                Image URL
              </label>
              <input
                type="text"
                value={data.image || ""}
                onChange={(e) => update("image", e.target.value || null)}
                className="form-input"
                placeholder="Optional"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Product Selection */}
      <div className="p-[3px] rounded-[1.5rem] bg-black/[0.02] ring-1 ring-black/[0.04]">
        <div className="rounded-[calc(1.5rem-3px)] bg-white p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-display font-semibold tracking-[-0.01em] text-dust-grey-900">
              Components
            </h2>
            <span className="text-[12px] text-dust-grey-400">
              {data.productIds.length} selected
            </span>
          </div>

          {Object.entries(grouped).map(([type, typeProducts]) => (
            <div key={type}>
              <p className="text-[11px] uppercase tracking-[0.12em] font-semibold text-dust-grey-400 mb-2">
                {type}
              </p>
              <div className="space-y-1">
                {typeProducts.map((product) => {
                  const selected = data.productIds.includes(product.id);
                  return (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => toggleProduct(product.id)}
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-[13px] transition-all duration-300 ${
                        selected
                          ? "bg-brand/10 text-brand ring-1 ring-brand/20"
                          : "hover:bg-dust-grey-50 text-dust-grey-600"
                      }`}
                    >
                      <span className="font-medium truncate mr-4">
                        {product.name}
                      </span>
                      <span className="font-mono text-[12px] shrink-0">
                        {product.price.toLocaleString()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-3 pt-4">
        <Button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-full bg-brand text-white text-[13px] font-semibold hover:bg-brand-dark active:scale-[0.98] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] disabled:opacity-50"
        >
          {loading
            ? isEditing
              ? "Saving..."
              : "Creating..."
            : isEditing
              ? "Save Changes"
              : "Create Build"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          className="text-[13px] text-dust-grey-500"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
