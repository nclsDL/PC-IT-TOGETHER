"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  salePrice?: number | null;
  image: string;
  quantity: number;
  slug: string;
  specs?: string;
}

export interface AppliedCoupon {
  code: string;
  discountPercent: number;
}

interface CartStore {
  items: CartItem[];
  coupon: AppliedCoupon | null;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setCoupon: (coupon: AppliedCoupon | null) => void;
  getSubtotal: () => number;
  getDiscount: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      setCoupon: (coupon) => set({ coupon }),
      addItem: (item, quantity = 1) => {
        const items = get().items;
        const existing = items.find((i) => i.id === item.id);
        if (existing) {
          set({
            items: items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          });
        } else {
          set({ items: [...items, { ...item, quantity }] });
        }
      },
      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          set({ items: get().items.filter((i) => i.id !== id) });
          return;
        }
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        });
      },
      clearCart: () => set({ items: [], coupon: null }),
      getSubtotal: () => {
        return get().items.reduce(
          (total, item) =>
            total + (item.salePrice ?? item.price) * item.quantity,
          0
        );
      },
      getDiscount: () => {
        const coupon = get().coupon;
        if (!coupon) return 0;
        return get().getSubtotal() * (coupon.discountPercent / 100);
      },
      getTotal: () => {
        return get().getSubtotal() - get().getDiscount();
      },
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    { name: "pc-it-together-cart" }
  )
);
