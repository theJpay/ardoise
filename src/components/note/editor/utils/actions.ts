export type EditorAction = {
    name: string;
    syntax: string;
    label: string;
    type: "block" | "inline";
};

export const TOOLBAR_ACTIONS = [
    { name: "heading-1", syntax: "# ", label: "Heading 1", type: "block" },
    { name: "heading-2", syntax: "## ", label: "Heading 2", type: "block" },
    { name: "heading-3", syntax: "### ", label: "Heading 3", type: "block" },
    { name: "quote", syntax: "> ", label: "Quote", type: "block" }
] as const satisfies readonly EditorAction[];

export const FLOATING_TOOLBAR_ACTIONS = [
    { name: "bold", syntax: "**", label: "Bold", type: "inline" },
    { name: "italic", syntax: "*", label: "Italic", type: "inline" },
    { name: "code", syntax: "`", label: "Inline code", type: "inline" }
] as const satisfies readonly EditorAction[];

export const ALL_ACTIONS = [...TOOLBAR_ACTIONS, ...FLOATING_TOOLBAR_ACTIONS] as const;

export type BlockActionName = (typeof TOOLBAR_ACTIONS)[number]["name"];
export type InlineActionName = (typeof FLOATING_TOOLBAR_ACTIONS)[number]["name"];
export type ActionName = (typeof ALL_ACTIONS)[number]["name"];

export const BLOCK_SYNTAXES = TOOLBAR_ACTIONS.map((a) => a.syntax).toSorted(
    (a, b) => b.length - a.length
);

export function getSyntax(actionName: ActionName): string {
    const action = ALL_ACTIONS.find((a) => a.name === actionName);
    if (!action) {
        throw new Error(`Unknown editor action: ${actionName}`);
    }
    return action.syntax;
}
