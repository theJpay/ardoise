export type EditorAction = {
    name: string;
    syntax: string;
    label: string;
    type: "block" | "inline";
};

export const TOOLBAR_ACTIONS: EditorAction[] = [
    { name: "heading-1", syntax: "# ", label: "Heading 1", type: "block" },
    { name: "heading-2", syntax: "## ", label: "Heading 2", type: "block" },
    { name: "heading-3", syntax: "### ", label: "Heading 3", type: "block" },
    { name: "quote", syntax: "> ", label: "Quote", type: "block" }
];

export const FLOATING_TOOLBAR_ACTIONS: EditorAction[] = [
    { name: "bold", syntax: "**", label: "Bold", type: "inline" },
    { name: "italic", syntax: "*", label: "Italic", type: "inline" },
    { name: "code", syntax: "`", label: "Inline code", type: "inline" }
];

export const ALL_ACTIONS: EditorAction[] = [...TOOLBAR_ACTIONS, ...FLOATING_TOOLBAR_ACTIONS];

export const BLOCK_SYNTAXES = TOOLBAR_ACTIONS.map((a) => a.syntax).sort(
    (a, b) => b.length - a.length
);

export function getSyntax(actionName: string): string {
    const action = ALL_ACTIONS.find((a) => a.name === actionName);
    if (!action) {
        throw new Error(`Unknown editor action: ${actionName}`);
    }
    return action.syntax;
}
