export type EditorAction = {
    name: string;
    syntax: string;
    label: string;
    type: "block" | "inline";
};

export type CommandPaletteAction = {
    name: string;
    syntax: string;
    label: string;
    description: string;
    cursorOffset?: number;
};

export const TOOLBAR_ACTIONS = [
    { name: "heading-1", syntax: "# ", label: "Heading 1", type: "block" },
    { name: "heading-2", syntax: "## ", label: "Heading 2", type: "block" },
    { name: "heading-3", syntax: "### ", label: "Heading 3", type: "block" },
    { name: "code-block", syntax: "```\n\n```", label: "Code block", type: "block" },
    { name: "quote", syntax: "> ", label: "Quote", type: "block" }
] as const satisfies readonly EditorAction[];

export const FLOATING_TOOLBAR_ACTIONS = [
    { name: "bold", syntax: "**", label: "Bold", type: "inline" },
    { name: "italic", syntax: "*", label: "Italic", type: "inline" },
    { name: "strikethrough", syntax: "~~", label: "Strikethrough", type: "inline" },
    { name: "code", syntax: "`", label: "Inline code", type: "inline" },
    { name: "link", syntax: "", label: "Link", type: "inline" }
] as const satisfies readonly EditorAction[];

export const TOOLBAR_ACTION_GROUPS: BlockActionName[][] = [
    ["heading-1", "heading-2", "heading-3"],
    ["code-block", "quote"]
];

export const FLOATING_TOOLBAR_ACTION_GROUPS: InlineActionName[][] = [
    ["bold", "italic", "strikethrough"],
    ["code", "link"]
];

export const COMMAND_PALETTE_ACTIONS = [
    { name: "heading-1", syntax: "# ", label: "Heading 1", description: "Large section title" },
    { name: "heading-2", syntax: "## ", label: "Heading 2", description: "Medium section title" },
    { name: "heading-3", syntax: "### ", label: "Heading 3", description: "Small section title" },
    {
        name: "code-block",
        syntax: "```\n\n```",
        label: "Code block",
        description: "Fenced code",
        cursorOffset: 4
    },
    { name: "quote", syntax: "> ", label: "Quote", description: "Block quotation" },
    { name: "task-list", syntax: "- [ ] ", label: "Task list", description: "Checkbox item" },
    { name: "hr", syntax: "---\n", label: "Horizontal rule", description: "Section divider" }
] satisfies readonly CommandPaletteAction[];

export const ALL_ACTIONS = [...TOOLBAR_ACTIONS, ...FLOATING_TOOLBAR_ACTIONS] as const;

export type BlockActionName = (typeof TOOLBAR_ACTIONS)[number]["name"];
export type InlineActionName = (typeof FLOATING_TOOLBAR_ACTIONS)[number]["name"];
export type CommandPaletteActionName = (typeof COMMAND_PALETTE_ACTIONS)[number]["name"];
export type ActionName = (typeof ALL_ACTIONS)[number]["name"];

export const BLOCK_SYNTAXES = TOOLBAR_ACTIONS.filter((a) => !a.syntax.includes("\n"))
    .map((a) => a.syntax)
    .toSorted((a, b) => b.length - a.length);

export function getSyntax(actionName: ActionName): string {
    const action = ALL_ACTIONS.find((a) => a.name === actionName);
    if (!action) {
        throw new Error(`Unknown editor action: ${actionName}`);
    }
    return action.syntax;
}
