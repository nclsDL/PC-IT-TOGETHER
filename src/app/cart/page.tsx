"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useState } from "react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const [couponCode, setCouponCode] = useState("");

  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Your cart is empty
        </h1>
        <p className="text-gray-500 mb-6">
          Looks like you haven&apos;t added any items to your cart yet.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-brand text-white px-8 py-3 rounded-lg font-semibold hover:bg-brand-dark transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-brand transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">Cart</span>
      </nav>

      {/* Cart Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        {/* Header */}
        <div className="hidden sm:grid grid-cols-12 gap-4 p-4 bg-gray-50 text-sm font-medium text-gray-600">
          <div className="col-span-5">Product</div>
          <div className="col-span-2 text-center">Price</div>
          <div className="col-span-2 text-center">Quantity</div>
          <div className="col-span-2 text-center">Subtotal</div>
          <div className="col-span-1" />
        </div>

        {/* Items */}
        {items.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 items-center"
          >
            {/* Product */}
            <div className="col-span-12 sm:col-span-5 flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={64}
                  height={64}
                  className="object-contain w-full h-full p-1"
                />
              </div>
              <div>
                <Link
                  href={`/products/${item.slug}`}
                  className="text-sm font-medium text-gray-900 hover:text-brand transition-colors"
                >
                  {item.name}
                </Link>
                {item.specs && (
                  <p className="text-xs text-gray-500 mt-0.5">{item.specs}</p>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="col-span-4 sm:col-span-2 text-center text-sm font-mono">
              {formatPrice(item.salePrice ?? item.price)}
            </div>

            {/* Quantity */}
            <div className="col-span-4 sm:col-span-2 flex justify-center">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() =>
                    updateQuantity(item.id, Math.max(1, item.quantity - 1))
                  }
                  className="p-2.5 hover:bg-gray-50 min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center text-sm font-medium">
                  {String(item.quantity).padStart(2, "0")}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-2.5 hover:bg-gray-50 min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Subtotal */}
            <div className="col-span-3 sm:col-span-2 text-center text-sm font-medium font-mono">
              {formatPrice((item.salePrice ?? item.price) * item.quantity)}
            </div>

            {/* Remove */}
            <div className="col-span-1 flex justify-center">
              <button
                onClick={() => {
                  removeItem(item.id);
                  toast.success("Item removed from cart");
                }}
                className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
        <Link
          href="/products"
          className="inline-flex items-center justify-center px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Return To Shop
        </Link>
      </div>

      {/* Bottom Section */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Coupon */}
        <div className="flex gap-3">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Coupon Code"
            className="flex-1 h-11 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
          />
          <button
            onClick={() => toast.info("Coupon feature coming soon!")}
            className="px-6 bg-brand text-white rounded-lg text-sm font-semibold hover:bg-brand-dark transition-colors"
          >
            Apply Coupon
          </button>
        </div>

        {/* Cart Total */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Cart Total</h2>
          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium font-mono">{formatPrice(total)}</span>
            </div>
            <hr />
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium text-brand">Free</span>
            </div>
            <hr />
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold text-lg font-mono">{formatPrice(total)}</span>
            </div>
          </div>
          <Link
            href="/checkout"
            className="block w-full text-center bg-brand text-white py-3 rounded-lg font-semibold hover:bg-brand-dark transition-colors"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
