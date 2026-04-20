export const THEMES = ["dark", "light"] as const;
export const ACCENTS = ["lichen", "clay", "slate", "heather", "amber"] as const;

export type Theme = (typeof THEMES)[number];
export type Accent = (typeof ACCENTS)[number];

export type Settings = {
    id: "default";
    defaultMode: "edit" | "preview";
    spellcheck: boolean;
    theme: Theme;
    accent: Accent;
};

export const DEFAULT_SETTINGS: Settings = {
    id: "default",
    defaultMode: "edit",
    spellcheck: true,
    theme: "dark",
    accent: "lichen"
};
