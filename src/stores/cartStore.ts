import { create } from "zustand";
import { persist } from "zustand/middleware";
import { isSameCartLine } from "@/lib/cart-item";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stockQuantity?: number;
  size?: string;
  color?: string;
  slug: string;
}

export type CartMutationResult = {
  ok: boolean;
  quantity: number;
  message?: string;
};

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  ownerCustomerId: string | null;
  hasHydrated: boolean;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => CartMutationResult;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => CartMutationResult;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  syncCustomerSession: (customerId: string | null) => void;
  setHasHydrated: (value: boolean) => void;
  getItemQuantity: (productId: string, size?: string, color?: string) => number;
  total: () => number;
  itemCount: () => number;
}

function buildStockLimitResult(stockQuantity: number, quantity: number): CartMutationResult {
  if (stockQuantity <= 0) {
    return {
      ok: false,
      quantity: 0,
      message: "This item is currently out of stock."
    };
  }

  return {
    ok: false,
    quantity,
    message:
      stockQuantity === 1
        ? "Only 1 item is available in stock."
        : `Only ${stockQuantity} items are available in stock.`
  };
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      ownerCustomerId: null,
      hasHydrated: false,
      addItem: (newItem) => {
        const desiredIncrement = newItem.quantity || 1;
        let mutationResult: CartMutationResult = {
          ok: true,
          quantity: desiredIncrement
        };

        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => isSameCartLine(item, newItem)
          );
          const maxAllowed = newItem.stockQuantity ?? Number.POSITIVE_INFINITY;

          if (existingIndex > -1) {
            const updated = [...state.items];
            const nextQuantity = updated[existingIndex].quantity + desiredIncrement;

            if (nextQuantity > maxAllowed) {
              const clampedQuantity = Math.min(updated[existingIndex].quantity, maxAllowed);
              updated[existingIndex] = {
                ...updated[existingIndex],
                stockQuantity: newItem.stockQuantity ?? updated[existingIndex].stockQuantity,
                quantity: clampedQuantity
              };
              mutationResult = buildStockLimitResult(maxAllowed, clampedQuantity);
              return { items: updated, isOpen: true };
            }

            updated[existingIndex] = {
              ...updated[existingIndex],
              stockQuantity: newItem.stockQuantity ?? updated[existingIndex].stockQuantity,
              quantity: nextQuantity
            };
            mutationResult = { ok: true, quantity: nextQuantity };
            return { items: updated, isOpen: true };
          }

          if (desiredIncrement > maxAllowed) {
            const clampedQuantity = Math.min(desiredIncrement, maxAllowed);
            mutationResult = buildStockLimitResult(maxAllowed, clampedQuantity);

            if (clampedQuantity <= 0) {
              return { isOpen: true };
            }

            return {
              items: [
                ...state.items,
                { ...newItem, quantity: clampedQuantity }
              ],
              isOpen: true
            };
          }

          mutationResult = { ok: true, quantity: desiredIncrement };
          return {
            items: [
              ...state.items,
              { ...newItem, quantity: desiredIncrement }
            ],
            isOpen: true
          };
        });

        return mutationResult;
      },
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
      updateQuantity: (id, quantity) => {
        let mutationResult: CartMutationResult = { ok: true, quantity };

        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((item) => item.id !== id)
              : state.items.map((item) => {
                  if (item.id !== id) {
                    return item;
                  }

                  const maxAllowed = item.stockQuantity ?? Number.POSITIVE_INFINITY;
                  if (quantity > maxAllowed) {
                    const clampedQuantity = Math.min(item.quantity, maxAllowed);
                    mutationResult = buildStockLimitResult(maxAllowed, clampedQuantity);
                    return { ...item, quantity: clampedQuantity };
                  }

                  mutationResult = { ok: true, quantity };
                  return { ...item, quantity };
                })
        }));

        return mutationResult;
      },
      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      syncCustomerSession: (customerId) =>
        set((state) => {
          if (!state.ownerCustomerId && !customerId) {
            return state;
          }

          if (!state.ownerCustomerId && customerId) {
            return { ownerCustomerId: customerId };
          }

          if (state.ownerCustomerId === customerId) {
            return state;
          }

          return {
            items: [],
            isOpen: false,
            ownerCustomerId: customerId
          };
        }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
      getItemQuantity: (productId, size, color) =>
        get().items.reduce((sum, item) => {
          const matches = isSameCartLine(item, { productId, size, color });

          return matches ? sum + item.quantity : sum;
        }, 0),
      total: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      itemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0)
    }),
    {
      name: "fab-shopper-cart",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      }
    }
  )
);
