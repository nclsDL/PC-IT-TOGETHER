"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  salePrice?: number | null;
  image: string;
  slug: string;
  rating: number;
  reviewCount: number;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  toggleItem: (item: WishlistItem) => void;
  getItemCount: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        if (!get().items.find((i) => i.id === item.id)) {
          set({ items: [...get().items, item] });
        }
      },
      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },
      isInWishlist: (id) => {
        return get().items.some((i) => i.id === id);
      },
      toggleItem: (item) => {
        if (get().isInWishlist(item.id)) {
          get().removeItem(item.id);
        } else {
          get().addItem(item);
        }
      },
      getItemCount: () => get().items.length,
    }),
    { name: "pc-it-together-wishlist" }
  )
);
