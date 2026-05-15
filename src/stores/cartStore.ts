import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
  slug: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  ownerCustomerId: string | null;
  hasHydrated: boolean;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  syncCustomerSession: (customerId: string | null) => void;
  setHasHydrated: (value: boolean) => void;
  total: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      ownerCustomerId: null,
      hasHydrated: false,
      addItem: (newItem) =>
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) =>
              item.id === newItem.id &&
              item.size === newItem.size &&
              item.color === newItem.color
          );

          if (existingIndex > -1) {
            const updated = [...state.items];
            updated[existingIndex].quantity += newItem.quantity || 1;
            return { items: updated, isOpen: true };
          }

          return {
            items: [
              ...state.items,
              { ...newItem, quantity: newItem.quantity || 1 }
            ],
            isOpen: true
          };
        }),
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((item) => item.id !== id)
              : state.items.map((item) =>
                  item.id === id ? { ...item, quantity } : item
                )
        })),
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
