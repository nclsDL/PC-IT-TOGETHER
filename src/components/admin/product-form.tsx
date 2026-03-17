"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  createProduct,
  updateProduct,
} from "@/app/(admin)/admin/_actions/product-actions";

const COMPONENT_TYPES = [
  "CPU",
  "GPU",
  "MOTHERBOARD",
  "RAM",
  "STORAGE",
  "PSU",
  "CASE",
  "COOLER",
  "PREBUILT",
];

type ProductData = {
  id?: string;
  name: string;
  description: string;
  price: number;
  salePrice: number | null;
  images: string[];
  categoryId: string;
  brand: string;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  isFlashDeal: boolean;
  isNewArrival: boolean;
  componentType: string | null;
  socketType: string | null;
  memoryType: string | null;
  formFactor: string | null;
  wattage: number | null;
  specs: Record<string, unknown> | null;
};

type Category = { id: string; name: string };

const defaultProduct: ProductData = {
  name: "",
  description: "",
  price: 0,
  salePrice: null,
  images: [""],
  categoryId: "",
  brand: "",
  stock: 10,
  isActive: true,
  isFeatured: false,
  isFlashDeal: false,
  isNewArrival: false,
  componentType: null,
  socketType: null,
  memoryType: null,
  formFactor: null,
  wattage: null,
  specs: null,
};

export function ProductForm({
  product,
  categories,
}: {
  product?: ProductData;
  categories: Category[];
}) {
  const router = useRouter();
  const [data, setData] = useState<ProductData>(product || defaultProduct);
  const [loading, setLoading] = useState(false);
  const isEditing = !!product?.id;

  const update = <K extends keyof ProductData>(
    key: K,
    value: ProductData[K]
  ) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!data.name || !data.categoryId || !data.brand) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const result = isEditing
        ? await updateProduct(product!.id!, data)
        : await createProduct(data);

      if ("error" in result && result.error) {
        toast.error(result.error);
      } else {
        toast.success(isEditing ? "Product updated" : "Product created");
        router.push("/admin/products");
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const addImageField = () => update("images", [...data.images, ""]);
  const removeImageField = (index: number) =>
    update(
      "images",
      data.images.filter((_, i) => i !== index)
    );
  const updateImage = (index: number, value: string) => {
    const newImages = [...data.images];
    newImages[index] = value;
    update("images", newImages);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {/* Basic Info */}
      <FormSection title="Basic Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField label="Name" required>
            <input
              type="text"
              value={data.name}
              onChange={(e) => update("name", e.target.value)}
              className="form-input"
              placeholder="Product name"
            />
          </FormField>
          <FormField label="Brand" required>
            <input
              type="text"
              value={data.brand}
              onChange={(e) => update("brand", e.target.value)}
              className="form-input"
              placeholder="Brand name"
            />
          </FormField>
        </div>
        <FormField label="Description">
          <textarea
            value={data.description}
            onChange={(e) => update("description", e.target.value)}
            className="form-input min-h-[100px] resize-y"
            placeholder="Product description"
            rows={4}
          />
        </FormField>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField label="Category" required>
            <select
              value={data.categoryId}
              onChange={(e) => update("categoryId", e.target.value)}
              className="form-input"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Component Type">
            <select
              value={data.componentType || ""}
              onChange={(e) =>
                update("componentType", e.target.value || null)
              }
              className="form-input"
            >
              <option value="">None</option>
              {COMPONENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </FormField>
        </div>
      </FormSection>

      {/* Pricing */}
      <FormSection title="Pricing & Stock">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <FormField label="Price" required>
            <input
              type="number"
              value={data.price || ""}
              onChange={(e) => update("price", parseFloat(e.target.value) || 0)}
              className="form-input"
              min={0}
              step={0.01}
              placeholder="0.00"
            />
          </FormField>
          <FormField label="Sale Price">
            <input
              type="number"
              value={data.salePrice ?? ""}
              onChange={(e) =>
                update(
                  "salePrice",
                  e.target.value ? parseFloat(e.target.value) : null
                )
              }
              className="form-input"
              min={0}
              step={0.01}
              placeholder="Optional"
            />
          </FormField>
          <FormField label="Stock">
            <input
              type="number"
              value={data.stock}
              onChange={(e) => update("stock", parseInt(e.target.value) || 0)}
              className="form-input"
              min={0}
            />
          </FormField>
        </div>
      </FormSection>

      {/* Images */}
      <FormSection title="Images">
        <div className="space-y-3">
          {data.images.map((url, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={url}
                onChange={(e) => updateImage(i, e.target.value)}
                className="form-input flex-1"
                placeholder="Image URL"
              />
              {data.images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImageField(i)}
                  className="p-2.5 rounded-xl text-dust-grey-400 hover:text-sale hover:bg-red-50 transition-all duration-300"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addImageField}
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-brand hover:text-brand-dark transition-colors duration-300"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
            Add image
          </button>
        </div>
      </FormSection>

      {/* PC Specs — shown when componentType is set */}
      {data.componentType && (
        <FormSection title="PC Specifications">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="Socket Type">
              <input
                type="text"
                value={data.socketType || ""}
                onChange={(e) =>
                  update("socketType", e.target.value || null)
                }
                className="form-input"
                placeholder="e.g. LGA1700"
              />
            </FormField>
            <FormField label="Memory Type">
              <input
                type="text"
                value={data.memoryType || ""}
                onChange={(e) =>
                  update("memoryType", e.target.value || null)
                }
                className="form-input"
                placeholder="e.g. DDR5"
              />
            </FormField>
            <FormField label="Form Factor">
              <input
                type="text"
                value={data.formFactor || ""}
                onChange={(e) =>
                  update("formFactor", e.target.value || null)
                }
                className="form-input"
                placeholder="e.g. ATX"
              />
            </FormField>
            <FormField label="Wattage">
              <input
                type="number"
                value={data.wattage ?? ""}
                onChange={(e) =>
                  update(
                    "wattage",
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
                className="form-input"
                placeholder="e.g. 750"
              />
            </FormField>
          </div>
        </FormSection>
      )}

      {/* Flags */}
      <FormSection title="Visibility">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {(
            [
              ["isActive", "Active"],
              ["isFeatured", "Featured"],
              ["isFlashDeal", "Flash Deal"],
              ["isNewArrival", "New Arrival"],
            ] as const
          ).map(([key, label]) => (
            <label
              key={key}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="relative">
                <input
                  type="checkbox"
                  checked={data[key]}
                  onChange={(e) => update(key, e.target.checked)}
                  className="peer sr-only"
                />
                <div className="w-10 h-6 rounded-full bg-dust-grey-200 peer-checked:bg-brand transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]" />
                <div className="absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow-sm peer-checked:translate-x-4 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]" />
              </div>
              <span className="text-[13px] font-medium text-dust-grey-600 group-hover:text-dust-grey-900 transition-colors">
                {label}
              </span>
            </label>
          ))}
        </div>
      </FormSection>

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
              : "Create Product"}
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

function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-[3px] rounded-[1.5rem] bg-black/[0.02] ring-1 ring-black/[0.04]">
      <div className="rounded-[calc(1.5rem-3px)] bg-white p-6 sm:p-8 space-y-5">
        <h2 className="text-base font-display font-semibold tracking-[-0.01em] text-dust-grey-900">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[12px] font-medium uppercase tracking-[0.08em] text-dust-grey-500">
        {label}
        {required && <span className="text-sale ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
