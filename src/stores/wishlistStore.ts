import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  slug: string;
}

interface WishlistStore {
  items: WishlistItem[];
  toggleItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  clearWishlist: () => void;
  itemCount: () => number;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggleItem: (newItem) =>
        set((state) => {
          const exists = state.items.some((item) => item.productId === newItem.productId);
          if (exists) {
            return { items: state.items.filter((item) => item.productId !== newItem.productId) };
          }
          return { items: [...state.items, newItem] };
        }),
      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((item) => item.productId !== productId) })),
      clearWishlist: () => set({ items: [] }),
      itemCount: () => get().items.length,
      isInWishlist: (productId) => get().items.some((item) => item.productId === productId),
    }),
    { name: "fab-shopper-wishlist" }
  )
);
