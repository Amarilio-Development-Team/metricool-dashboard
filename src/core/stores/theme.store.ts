import { create } from 'zustand';
import { ThemeState } from '../types/theme.store.types';

export const useThemeStore = create<ThemeState>(set => ({
  theme: 'fantasy',
  toggleTheme: () =>
    set(state => ({
      theme: state.theme === 'fantasy' ? 'black' : 'fantasy',
    })),
  setTheme: theme => set({ theme }),
}));
