import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthService, ProductService } from '../services/api';
import { useAuthStore } from './useAuthStore';

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      favorites: [],

      toggleFavorite: async (product) => {
        const { favorites } = get();
        const exists = favorites.some((item) => item._id === product._id);
        const user = useAuthStore.getState().user;

        if (exists) {
          set({ favorites: favorites.filter((item) => item._id !== product._id) });
        } else {
          set({ favorites: [...favorites, product] });
        }

        // If customer is logged in, sync with database permanently!
        if (user) {
          try {
            await AuthService.toggleFavorite(product._id);
          } catch (err) {
            console.error('Failed to sync favorite to server:', err);
          }
        }
      },

      syncUserFavorites: async () => {
        const user = useAuthStore.getState().user;
        if (!user) {
          set({ favorites: [] });
          return;
        }

        try {
          const favIds = await AuthService.getFavorites();
          if (Array.isArray(favIds)) {
            if (favIds.length === 0) {
              set({ favorites: [] });
              return;
            }
            const allProducts = await ProductService.getAll();
            const matchedFavorites = allProducts.filter((p) => favIds.includes(p._id));
            set({ favorites: matchedFavorites });
          }
        } catch (err) {
          console.error('Failed to load user saved favorites from server:', err);
        }
      },

      isFavorite: (productId) => {
        return get().favorites.some((item) => item._id === productId);
      },

      clearFavorites: () => set({ favorites: [] }),

      getTotalFavoritesCount: () => get().favorites.length,
    }),
    {
      name: 'zamzam-wishlist',
    }
  )
);
