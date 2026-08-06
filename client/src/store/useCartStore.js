import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      isCartOpen: false,

      // Actions
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

      addToCart: (product, quantity = 1, selectedOption = '', customPrice = null) => {
        const option = selectedOption || (product.weightOptions && product.weightOptions[0]) || product.unit || 'Standard';
        const itemPrice = customPrice !== null ? customPrice : product.price;
        const currentCart = get().cart;
        
        const existingIndex = currentCart.findIndex(
          (item) => item._id === product._id && item.selectedOption === option
        );

        if (existingIndex > -1) {
          const updated = [...currentCart];
          updated[existingIndex].quantity += quantity;
          updated[existingIndex].price = itemPrice; // Ensure updated price applies
          set({ cart: updated });
        } else {
          set({
            cart: [
              ...currentCart,
              {
                _id: product._id,
                name: product.name,
                price: itemPrice,
                imageUrl: product.imageUrl,
                unit: product.unit || 'Piece',
                selectedOption: option,
                quantity
              }
            ]
          });
        }
      },

      removeFromCart: (index) => {
        set((state) => ({
          cart: state.cart.filter((_, i) => i !== index)
        }));
      },

      updateQuantity: (index, delta) => {
        const currentCart = get().cart;
        const updated = [...currentCart];
        const newQty = updated[index].quantity + delta;

        if (newQty <= 0) {
          set({ cart: updated.filter((_, i) => i !== index) });
        } else {
          updated[index].quantity = newQty;
          set({ cart: updated });
        }
      },

      clearCart: () => set({ cart: [] }),

      // Computed Totals (Unique Items Count for Badge)
      getTotalItemsCount: () => {
        return get().cart.length;
      },

      getSubtotal: () => {
        return get().cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
      }
    }),
    {
      name: 'zamzam-zustand-cart'
    }
  )
);
