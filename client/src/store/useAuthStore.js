import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthService } from '../services/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      login: async (email, password) => {
        const data = await AuthService.login({ email, password });
        if (data.requiresOtp) {
          return data;
        }
        const userData = {
          _id: data._id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: data.role,
          address: data.address,
          avatar: data.avatar
        };

        localStorage.setItem('zamzam_auth_token', data.token);
        set({ user: userData, token: data.token });
        return userData;
      },

      googleLogin: async (payload) => {
        const data = await AuthService.googleLogin(payload);
        const userData = {
          _id: data._id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: data.role,
          address: data.address,
          avatar: data.avatar
        };

        localStorage.setItem('zamzam_auth_token', data.token);
        set({ user: userData, token: data.token });
        return userData;
      },

      verifyOtp: async (email, otp) => {
        const data = await AuthService.verifyOtp({ email, otp });
        const userData = {
          _id: data._id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: data.role,
          address: data.address,
          avatar: data.avatar
        };

        localStorage.setItem('zamzam_auth_token', data.token);
        set({ user: userData, token: data.token });
        return userData;
      },

      register: async (userDataPayload) => {
        const data = await AuthService.register(userDataPayload);
        return data;
      },

      logout: () => {
        localStorage.removeItem('zamzam_auth_token');
        set({ user: null, token: null });
      },

      setUser: (updatedUser) => {
        set((state) => ({ user: { ...state.user, ...updatedUser } }));
      },

      isJwtModalOpen: false,
      setJwtModalOpen: (isOpen) => set({ isJwtModalOpen: isOpen }),
      toggleJwtModal: () => set((state) => ({ isJwtModalOpen: !state.isJwtModalOpen })),

      getDecodedToken: () => {
        const token = get().token || localStorage.getItem('zamzam_auth_token');
        if (!token) return null;
        try {
          const parts = token.split('.');
          if (parts.length !== 3) return null;
          const payload = JSON.parse(atob(parts[1]));
          return payload;
        } catch (e) {
          return null;
        }
      },

      checkAuth: async () => {
        const token = localStorage.getItem('zamzam_auth_token');
        if (token) {
          try {
            const profile = await AuthService.getMe();
            set({ user: profile, token });
          } catch (e) {
            get().logout();
          }
        }
      }
    }),
    {
      name: 'zamzam-zustand-auth',
      partialize: (state) => ({ user: state.user, token: state.token })
    }
  )
);
