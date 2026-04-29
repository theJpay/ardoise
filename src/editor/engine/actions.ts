import { isMac } from "@utils";

type BaseAction = {
    name: string;
    label: string;
    description?: string;
    shortcut?: { key: string; shift: boolean };
};

type InlineAction = BaseAction & { type: "inline"; marker: string };
type LineAction = BaseAction & { type: "line"; prefix: string };
type CodeBlockAction = BaseAction & { type: "code-block" };
type LinkAction = BaseAction & { type: "link" };
type InsertAction = BaseAction & { type: "insert"; template: string };

export type Action = InlineAction | LineAction | CodeBlockAction | LinkAction | InsertAction;

export const ACTIONS = {
    "heading-1": {
        name: "heading-1",
        type: "line",
        prefix: "# ",
        label: "Heading 1",
        description: "Large section title"
    },
    "heading-2": {
        name: "heading-2",
        type: "line",
        prefix: "## ",
        label: "Heading 2",
        description: "Medium section title"
    },
    "heading-3": {
        name: "heading-3",
        type: "line",
        prefix: "### ",
        label: "Heading 3",
        description: "Small section title"
    },
    quote: {
        name: "quote",
        type: "line",
        prefix: "> ",
        label: "Quote",
        description: "Block quotation"
    },
    "code-block": {
        name: "code-block",
        type: "code-block",
        label: "Code block",
        description: "Fenced code"
    },
    bold: {
        name: "bold",
        type: "inline",
        marker: "**",
        label: "Bold",
        shortcut: { key: "b", shift: false }
    },
    italic: {
        name: "italic",
        type: "inline",
        marker: "*",
        label: "Italic",
        shortcut: { key: "i", shift: false }
    },
    strikethrough: {
        name: "strikethrough",
        type: "inline",
        marker: "~~",
        label: "Strikethrough",
        shortcut: { key: "x", shift: true }
    },
    code: {
        name: "code",
        type: "inline",
        marker: "`",
        label: "Inline code",
        shortcut: { key: "e", shift: false }
    },
    link: {
        name: "link",
        type: "link",
        label: "Link",
        shortcut: { key: "k", shift: false }
    },
    "task-list": {
        name: "task-list",
        type: "insert",
        template: "- [ ] ",
        label: "Task list",
        description: "Checkbox item"
    },
    hr: {
        name: "hr",
        type: "insert",
        template: "---\n",
        label: "Horizontal rule",
        description: "Section divider"
    }
} as const satisfies Record<string, Action>;

export type ActionName = keyof typeof ACTIONS;

export function getActionTooltip(name: ActionName): string {
    const action = ACTIONS[name];
    if (!("shortcut" in action)) {
        return action.label;
    }
    const { key, shift } = action.shortcut;
    const upperKey = key.toUpperCase();
    if (isMac()) {
        return `${action.label} (⌘${shift ? "⇧" : ""}${upperKey})`;
    }
    return `${action.label} (Ctrl+${shift ? "Shift+" : ""}${upperKey})`;
}
