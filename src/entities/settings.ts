export type Settings = {
    id: "default";
    defaultMode: "edit" | "preview";
    spellcheck: boolean;
};

export const DEFAULT_SETTINGS: Settings = {
    id: "default",
    defaultMode: "edit",
    spellcheck: true
};
