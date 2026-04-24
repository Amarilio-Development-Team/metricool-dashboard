import { useEffect } from 'react';
import { ThemeType, ThemeState } from '../types/theme.store.types';
import { useThemeStore } from '../stores/theme.store';

interface ThemeController {
  theme: ThemeType;
  handleChangeTheme: () => void;
}

export const useThemeController = (): ThemeController => {
  const theme = useThemeStore((state: ThemeState) => state.theme);

  const toggleTheme = useThemeStore((state: ThemeState) => state.toggleTheme);

  useEffect(() => {
    const dashboardElement = document.getElementsByTagName('body')[0];
    if (dashboardElement) {
      dashboardElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  return {
    theme,
    handleChangeTheme: toggleTheme,
  };
};
