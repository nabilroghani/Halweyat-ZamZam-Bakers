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
        const userData = {
          _id: data._id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: data.role,
          address: data.address
        };

        localStorage.setItem('zamzam_auth_token', data.token);
        set({ user: userData, token: data.token });
        return userData;
      },

      logout: () => {
        localStorage.removeItem('zamzam_auth_token');
        set({ user: null, token: null });
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
      name: 'zamzam-zustand-auth'
    }
  )
);
