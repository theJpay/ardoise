import { ArrowBigUp, Command, Delete, Option } from "lucide-react";

import type { LucideIcon } from "lucide-react";

export type Shortcut = {
    label: string;
    keys: (string | LucideIcon)[];
    soon?: boolean;
};

export type ShortcutGroup = {
    title: string;
    shortcuts: Shortcut[];
};

export const SHORTCUT_GROUPS: ShortcutGroup[] = [
    {
        title: "Global",
        shortcuts: [
            { label: "Toggle sidebar", keys: [Command, ArrowBigUp, "B"] },
            { label: "Toggle mode", keys: [Command, ArrowBigUp, "M"] },
            { label: "Focus search", keys: [Command, ArrowBigUp, "F"] },
            { label: "New note", keys: [Command, Option, "N"] },
            { label: "Save", keys: [Command, "S"] }
        ]
    },
    {
        title: "Outside editor",
        shortcuts: [
            { label: "New note", keys: ["C"] },
            { label: "Delete note", keys: [Command, Delete] }
        ]
    },
    {
        title: "Editor",
        shortcuts: [
            { label: "Bold", keys: [Command, "B"] },
            { label: "Italic", keys: [Command, "I"] },
            { label: "Strikethrough", keys: [Command, ArrowBigUp, "X"] },
            { label: "Inline code", keys: [Command, "E"] },
            { label: "Link", keys: [Command, "K"] },
            { label: "Slash commands", keys: ["/"] },
            { label: "Voice note", keys: [Command, ArrowBigUp, "V"], soon: true }
        ]
    },
    {
        title: "Coming soon",
        shortcuts: [{ label: "Advanced search", keys: [Command, ArrowBigUp, "K"], soon: true }]
    }
];
