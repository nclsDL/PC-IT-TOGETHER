"use client";

import { useState } from "react";
import {
  Check,
  ShoppingCart,
  Save,
  Share2,
  AlertTriangle,
  Cpu,
  Monitor,
  CircuitBoard,
  MemoryStick,
  HardDrive,
  Zap,
  Box,
  Fan,
  Shield,
  DollarSign,
  Award,
  Package,
} from "lucide-react";
import Image from "next/image";
import {
  useBuilderStore,
  BUILDER_STEPS,
  ComponentSlot,
  BuilderProduct,
} from "@/store/builder-store";
import { useCartStore } from "@/store/cart-store";
import {
  checkCompatibility,
  getAllCompatibilityErrors,
} from "@/components/builder/compatibility-checker";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";

const stepIcons: Record<string, React.ReactNode> = {
  cpu: <Cpu className="h-4 w-4" />,
  motherboard: <CircuitBoard className="h-4 w-4" />,
  ram: <MemoryStick className="h-4 w-4" />,
  storage: <HardDrive className="h-4 w-4" />,
  gpu: <Monitor className="h-4 w-4" />,
  psu: <Zap className="h-4 w-4" />,
  case: <Box className="h-4 w-4" />,
  cooler: <Fan className="h-4 w-4" />,
};

const componentTypeMap: Record<ComponentSlot, string> = {
  cpu: "CPU",
  motherboard: "MOTHERBOARD",
  ram: "RAM",
  storage: "STORAGE",
  gpu: "GPU",
  psu: "PSU",
  case: "CASE",
  cooler: "COOLER",
};

interface BuilderClientProps {
  products: Array<{
    id: string;
    name: string;
    slug: string;
    price: number;
    salePrice: number | null;
    images: string[];
    brand: string;
    componentType: string | null;
    socketType: string | null;
    memoryType: string | null;
    formFactor: string | null;
    wattage: number | null;
    specs: unknown;
    rating: number;
  }>;
  prebuilts: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    tier: string;
    image: string | null;
    products: Array<{
      id: string;
      name: string;
      price: number;
      salePrice: number | null;
      images: string[];
      slug: string;
      brand: string;
      componentType: string | null;
      socketType: string | null;
      memoryType: string | null;
      formFactor: string | null;
      wattage: number | null;
      specs: unknown;
    }>;
  }>;
}

export function BuilderClient({ products, prebuilts }: BuilderClientProps) {
  const {
    currentStep,
    selections,
    setStep,
    selectComponent,
    removeComponent,
    clearBuild,
    getBuildTotal,
    getSelectedCount,
  } = useBuilderStore();
  const addItem = useCartStore((s) => s.addItem);
  const [showMore, setShowMore] = useState(false);

  const currentSlot = BUILDER_STEPS[currentStep].slot;
  const currentType = componentTypeMap[currentSlot];

  const availableProducts = products.filter(
    (p) => p.componentType === currentType
  );

  const featured = availableProducts.slice(0, 3);
  const moreOptions = availableProducts.slice(3);

  const compatErrors = getAllCompatibilityErrors(selections);
  const total = getBuildTotal();
  const selectedCount = getSelectedCount();

  const handleSelect = (product: (typeof products)[0]) => {
    const builderProduct: BuilderProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      salePrice: product.salePrice,
      image: product.images[0] || "/placeholder.svg",
      slug: product.slug,
      brand: product.brand,
      socketType: product.socketType,
      memoryType: product.memoryType,
      formFactor: product.formFactor,
      wattage: product.wattage,
      componentType: product.componentType || "",
      specs: product.specs as Record<string, unknown> | null,
    };

    const compat = checkCompatibility(currentSlot, builderProduct, selections);
    if (!compat.compatible) {
      toast.error(compat.reason || "Incompatible component");
      return;
    }

    selectComponent(currentSlot, builderProduct);
    toast.success(`${product.name} selected`);
  };

  const handleAddAllToCart = () => {
    Object.values(selections).forEach((product) => {
      if (product) {
        addItem({
          id: product.id,
          name: product.name,
          price: product.price,
          salePrice: product.salePrice,
          image: product.image,
          slug: product.slug,
        });
      }
    });
    toast.success("All components added to cart!");
  };

  return (
    <div>
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-brand via-brand-dark to-brand text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-white/80 mb-2">
            PC Configurator
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">
            BUILD YOUR DREAM PC
          </h1>
          <p className="text-white/80 max-w-xl mx-auto mb-6">
            Select your components, verify compatibility, and order your custom
            build — all in one place.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            {[
              { label: "500+ Components", icon: "📦" },
              { label: "100% Compatibility", icon: "✅" },
              { label: "1-Click Ordering", icon: "🖱️" },
              { label: "Free Guarantee Guide", icon: "📋" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-2">
                <span>{stat.icon}</span>
                <span className="font-semibold">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step Progress Bar */}
        <div className="flex items-center justify-between mb-10 overflow-x-auto pb-2">
          {BUILDER_STEPS.map((step, i) => {
            const isActive = i === currentStep;
            const isCompleted = !!selections[step.slot];
            return (
              <button
                key={step.slot}
                onClick={() => setStep(i)}
                className="flex flex-col items-center gap-1.5 min-w-[80px] group"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    isCompleted
                      ? "bg-brand text-white"
                      : isActive
                      ? "bg-brand text-white"
                      : "bg-gray-200 text-gray-500 group-hover:bg-gray-300"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    stepIcons[step.slot]
                  )}
                </div>
                <span
                  className={`text-xs font-medium ${
                    isActive ? "text-brand" : "text-gray-500"
                  }`}
                >
                  {step.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Component Selection */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <p className="text-sm text-brand font-semibold uppercase tracking-wide">
                Step {currentStep + 1}
              </p>
              <h2 className="text-xl font-bold text-gray-900">
                Select a {BUILDER_STEPS[currentStep].label}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Choose a {BUILDER_STEPS[currentStep].label.toLowerCase()} that
                matches your performance needs and budget.
              </p>
            </div>

            {/* Featured Cards */}
            {availableProducts.length > 0 ? (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {featured.map((product, i) => {
                    const isSelected = selections[currentSlot]?.id === product.id;
                    const badges = i === 0 ? "Best Value" : i === 1 ? "Popular" : undefined;

                    return (
                      <button
                        key={product.id}
                        onClick={() => handleSelect(product)}
                        className={`relative text-left p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                          isSelected
                            ? "border-brand bg-brand/5"
                            : "border-gray-200 hover:border-brand/50"
                        }`}
                      >
                        {badges && (
                          <span className="absolute top-2 left-2 bg-brand text-white text-[10px] font-bold px-2 py-0.5 rounded">
                            {badges}
                          </span>
                        )}
                        {isSelected && (
                          <span className="absolute top-2 right-2 bg-brand text-white rounded-full p-0.5">
                            <Check className="h-3 w-3" />
                          </span>
                        )}
                        <div className="h-28 flex items-center justify-center mb-3">
                          <Image
                            src={product.images[0] || "/placeholder.svg"}
                            alt={product.name}
                            width={100}
                            height={100}
                            className="object-contain h-full w-auto"
                          />
                        </div>
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-brand font-bold font-mono tracking-tight">
                            {formatPrice(product.salePrice ?? product.price)}
                          </span>
                          {product.salePrice && (
                            <span className="text-gray-400 text-xs line-through font-mono tracking-tight">
                              {formatPrice(product.price)}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* More Options */}
                {moreOptions.length > 0 && (
                  <div>
                    <button
                      onClick={() => setShowMore(!showMore)}
                      className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide"
                    >
                      {showMore ? "Hide" : "More"} Options ({moreOptions.length})
                    </button>
                    {showMore && (
                      <div className="grid sm:grid-cols-3 gap-3">
                        {moreOptions.map((product) => {
                          const isSelected =
                            selections[currentSlot]?.id === product.id;
                          return (
                            <button
                              key={product.id}
                              onClick={() => handleSelect(product)}
                              className={`text-left p-3 rounded-lg border transition-all hover:shadow-sm ${
                                isSelected
                                  ? "border-brand bg-brand/5"
                                  : "border-gray-200"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <Image
                                  src={product.images[0] || "/placeholder.svg"}
                                  alt={product.name}
                                  width={48}
                                  height={48}
                                  className="object-contain"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium text-gray-900 truncate">
                                    {product.name}
                                  </p>
                                  <p className="text-sm text-brand font-bold font-mono tracking-tight">
                                    {formatPrice(product.salePrice ?? product.price)}
                                  </p>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>No {BUILDER_STEPS[currentStep].label} components available yet.</p>
                <p className="text-sm mt-1">Connect your database and seed products to get started.</p>
              </div>
            )}
          </div>

          {/* Build Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Your Build</h3>
                {selectedCount > 0 && (
                  <button
                    onClick={clearBuild}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Selected Components */}
              <div className="space-y-2.5 mb-6">
                {BUILDER_STEPS.map((step) => {
                  const selected = selections[step.slot];
                  return (
                    <div
                      key={step.slot}
                      className="flex items-center gap-3 text-sm"
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          selected
                            ? "bg-brand text-white"
                            : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        {selected ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <span className="text-[10px]">
                            {stepIcons[step.slot]}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        {selected ? (
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-gray-900 truncate text-xs">
                              {selected.name}
                            </span>
                            <button
                              onClick={() => removeComponent(step.slot)}
                              className="text-red-400 hover:text-red-500 text-xs shrink-0"
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">
                            {step.label}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Compatibility Status */}
              <div
                className={`text-xs p-3 rounded-lg mb-4 ${
                  compatErrors.length > 0
                    ? "bg-red-50 text-red-700"
                    : "bg-green-50 text-green-700"
                }`}
              >
                {compatErrors.length > 0 ? (
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                    <div>
                      {compatErrors.map((err, i) => (
                        <p key={i}>{err}</p>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    <span>All components compatible ✓</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-lg font-mono tracking-tight">{formatPrice(total)}</span>
                <span className="text-xs text-gray-500">
                  {selectedCount}/8 selected
                </span>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <button
                  onClick={handleAddAllToCart}
                  disabled={selectedCount === 0}
                  className="w-full flex items-center justify-center gap-2 bg-brand text-white py-3 rounded-lg font-semibold hover:bg-brand-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add All to Cart — <span className="font-mono tracking-tight">{formatPrice(total)}</span>
                </button>
                <button className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  <Save className="h-4 w-4" />
                  Save Build for Later
                </button>
                <button className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  <Share2 className="h-4 w-4" />
                  Share Build
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Start Prebuilt Builds */}
        {prebuilts.length > 0 && (
          <section className="mt-16">
            <div className="mb-6">
              <p className="text-sm text-brand font-semibold uppercase tracking-wide mb-1">
                Quick Start
              </p>
              <h2 className="text-2xl font-bold text-gray-900">
                Don&apos;t want to pick parts individually?
              </h2>
              <p className="text-gray-500">Start with a curated build.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {prebuilts.map((build) => (
                <div
                  key={build.id}
                  className={`border-2 rounded-xl p-6 transition-all hover:shadow-lg ${
                    build.tier === "MIDRANGE"
                      ? "border-brand bg-brand/5"
                      : "border-gray-200"
                  }`}
                >
                  {build.tier === "MIDRANGE" && (
                    <span className="inline-block bg-brand text-white text-xs font-bold px-2 py-0.5 rounded mb-3">
                      Recommended
                    </span>
                  )}
                  <h3 className="font-bold text-gray-900 mb-1">{build.name}</h3>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                    {build.description}
                  </p>
                  <p className="text-2xl font-bold text-brand mb-4 font-mono tracking-tight">
                    {formatPrice(build.price)}
                  </p>
                  <button
                    onClick={() => {
                      clearBuild();
                      build.products.forEach((p) => {
                        const slot = Object.entries(componentTypeMap).find(
                          ([, v]) => v === p.componentType
                        )?.[0] as ComponentSlot | undefined;
                        if (slot) {
                          selectComponent(slot, {
                            id: p.id,
                            name: p.name,
                            price: p.price,
                            salePrice: p.salePrice,
                            image: p.images[0] || "/placeholder.svg",
                            slug: p.slug,
                            brand: p.brand,
                            socketType: p.socketType,
                            memoryType: p.memoryType,
                            formFactor: p.formFactor,
                            wattage: p.wattage,
                            componentType: p.componentType || "",
                            specs: p.specs as Record<string, unknown> | null,
                          });
                        }
                      });
                      toast.success(`${build.name} build loaded!`);
                    }}
                    className={`w-full py-2 rounded-lg text-sm font-semibold transition-colors ${
                      build.tier === "MIDRANGE"
                        ? "bg-brand text-white hover:bg-brand-dark"
                        : "border border-brand text-brand hover:bg-brand hover:text-white"
                    }`}
                  >
                    Use This Build
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Why PC-IT-Together */}
        <section className="mt-16 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-wide">
            Why PC-IT-Together
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: <Shield className="h-8 w-8 text-brand" />,
                title: "Compatibility Guarantee",
                desc: "100% compatible builds every time",
              },
              {
                icon: <DollarSign className="h-8 w-8 text-brand" />,
                title: "Best Price Match",
                desc: "Save up to 15% on bundled components",
              },
              {
                icon: <Award className="h-8 w-8 text-brand" />,
                title: "Warranty Protection",
                desc: "Full manufacturer warranties honored",
              },
              {
                icon: <Package className="h-8 w-8 text-brand" />,
                title: "One Box Shipping",
                desc: "Free express shipping on all builds",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="text-center p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
              >
                <div className="flex justify-center mb-3">{item.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Banner */}
        <section className="bg-gray-900 rounded-2xl p-8 text-center mb-8">
          <h2 className="text-white text-xl font-bold mb-2">
            Not sure which parts to pick?
          </h2>
          <p className="text-gray-400 text-sm mb-4 max-w-md mx-auto">
            Our experts can help you choose the right components for your needs
            and budget.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button className="bg-brand text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-brand-dark transition-colors">
              Chat with Expert
            </button>
            <button className="border border-gray-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:border-brand transition-colors">
              Quick Survey
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
