import { Heading1, Heading2, Heading3, Quote } from "lucide-react";

export type BlockAction = {
    name: string;
    syntax: string;
    icon: React.ReactNode;
    label: string;
};

export const BLOCK_ACTIONS: BlockAction[] = [
    {
        name: "heading-1",
        syntax: "# ",
        icon: <Heading1 size={14} strokeWidth={1.5} />,
        label: "Heading 1"
    },
    {
        name: "heading-2",
        syntax: "## ",
        icon: <Heading2 size={14} strokeWidth={1.5} />,
        label: "Heading 2"
    },
    {
        name: "heading-3",
        syntax: "### ",
        icon: <Heading3 size={14} strokeWidth={1.5} />,
        label: "Heading 3"
    },
    { name: "quote", syntax: "> ", icon: <Quote size={14} strokeWidth={1.5} />, label: "Quote" }
];

export function getSyntax(actionName: string): string {
    const action = BLOCK_ACTIONS.find((a) => a.name === actionName);
    if (!action) {
        throw new Error(`Unknown block action: ${actionName}`);
    }
    return action.syntax;
}

export const BLOCK_SYNTAXES = BLOCK_ACTIONS.map((a) => a.syntax);
