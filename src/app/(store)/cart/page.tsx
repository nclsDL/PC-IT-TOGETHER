"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight, Tag } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useState } from "react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const [promoCode, setPromoCode] = useState("");

  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-0 py-20 text-center">
        <ShoppingCart className="h-16 w-16 text-black/20 mx-auto mb-4" />
        <h1 className="font-display text-[40px] font-bold text-black mb-2">
          Your cart is empty
        </h1>
        <p className="text-base text-black/60 mb-8">
          Looks like you haven&apos;t added any items to your cart yet.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-brand text-white px-14 py-4 rounded-full font-medium hover:bg-brand-dark transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-0 py-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />

      <h1 className="font-display text-[40px] font-bold text-black mt-6 mb-6">
        YOUR CART
      </h1>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Cart Items */}
        <div className="flex-1 border border-black/10 rounded-[20px] p-5 lg:p-6">
          <div className="flex flex-col divide-y divide-black/10">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 py-6 first:pt-0 last:pb-0">
                {/* Image */}
                <div className="w-[124px] h-[124px] bg-surface-alt rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={124}
                    height={124}
                    className="object-contain w-full h-full p-3"
                  />
                </div>

                {/* Details */}
                <div className="flex flex-1 justify-between">
                  <div className="flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-xl text-black">
                        <Link href={`/products/${item.slug}`} className="hover:text-black/60 transition-colors">
                          {item.name}
                        </Link>
                      </h3>
                      <p className="text-sm text-black mt-0.5">
                        Category: <span className="text-black/60">Component</span>
                      </p>
                    </div>
                    <p className="font-bold text-2xl text-black">
                      {formatPrice(item.salePrice ?? item.price)}
                    </p>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    {/* Delete */}
                    <button
                      onClick={() => {
                        removeItem(item.id);
                        toast.success("Item removed from cart");
                      }}
                      className="text-sale hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-6 w-6" />
                    </button>

                    {/* Quantity */}
                    <div className="flex items-center gap-5 bg-surface rounded-full px-5 py-3">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, Math.max(1, item.quantity - 1))
                        }
                      >
                        <Minus className="h-5 w-5" />
                      </button>
                      <span className="font-medium text-sm min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-[505px] border border-black/10 rounded-[20px] p-5 lg:p-6 h-fit">
          <h2 className="font-bold text-2xl text-black mb-6">Order Summary</h2>

          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between text-xl">
              <span className="text-black/60">Subtotal</span>
              <span className="font-bold text-black text-right">{formatPrice(total)}</span>
            </div>
            <div className="flex items-center justify-between text-xl">
              <span className="text-black/60">Delivery Fee</span>
              <span className="font-bold text-black text-right">Free</span>
            </div>

            <div className="h-px bg-black/10" />

            <div className="flex items-center justify-between">
              <span className="text-xl text-black">Total</span>
              <span className="font-bold text-2xl text-black">{formatPrice(total)}</span>
            </div>
          </div>

          {/* Promo Code */}
          <div className="flex gap-3 mt-6">
            <div className="flex-1 flex items-center gap-3 bg-surface rounded-full px-4 py-3">
              <Tag className="h-6 w-6 text-black/40" />
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Add promo code"
                className="flex-1 bg-transparent text-base outline-none placeholder:text-black/40"
              />
            </div>
            <button
              onClick={() => toast.info("Promo codes coming soon!")}
              className="bg-brand text-white font-medium text-base px-4 py-3 rounded-full hover:bg-brand-dark transition-colors"
            >
              Apply
            </button>
          </div>

          {/* Checkout */}
          <Link
            href="/checkout"
            className="flex items-center justify-center gap-3 w-full bg-brand text-white font-medium text-base py-4 rounded-full mt-6 hover:bg-brand-dark transition-colors"
          >
            Go to Checkout
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
