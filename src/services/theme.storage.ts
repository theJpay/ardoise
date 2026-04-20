import type { Accent, Theme } from "@entities";

const THEME_KEY = "ardoise:theme";
const ACCENT_KEY = "ardoise:accent";

export function mirrorThemeToLocalStorage(theme: Theme, accent: Accent): void {
    localStorage.setItem(THEME_KEY, theme);
    localStorage.setItem(ACCENT_KEY, accent);
}

export function applyThemeAttributes(theme: Theme, accent: Accent): void {
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.accent = accent;
}
