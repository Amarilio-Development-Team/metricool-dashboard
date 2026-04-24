export type ThemeType = 'fantasy' | 'black';

export interface ThemeState {
  theme: ThemeType;
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
}
