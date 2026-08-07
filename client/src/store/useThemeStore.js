import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'dark', // 'dark' | 'light'
      toggleTheme: () => {
        const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
        set({ theme: nextTheme });
        if (nextTheme === 'light') {
          document.documentElement.classList.add('light-theme');
          document.documentElement.classList.remove('dark');
        } else {
          document.documentElement.classList.remove('light-theme');
          document.documentElement.classList.add('dark');
        }
      },
      initTheme: () => {
        const currentTheme = get().theme;
        if (currentTheme === 'light') {
          document.documentElement.classList.add('light-theme');
          document.documentElement.classList.remove('dark');
        } else {
          document.documentElement.classList.remove('light-theme');
          document.documentElement.classList.add('dark');
        }
      }
    }),
    {
      name: 'zamzam-theme-preference'
    }
  )
);
