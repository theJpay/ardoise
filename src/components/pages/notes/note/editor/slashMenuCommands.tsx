import { CheckSquare, Code, Heading1, Heading2, Heading3, Minus, Quote } from "lucide-react";

export type SlashCommand = {
    name: string;
    label: string;
    description: string;
    syntax: string;
    cursorOffset?: number;
    icon: React.ReactNode;
};

export const SLASH_COMMANDS: readonly SlashCommand[] = [
    {
        name: "heading-1",
        label: "Heading 1",
        description: "Large section title",
        syntax: "# ",
        icon: <Heading1 size={13} strokeWidth={1.5} />
    },
    {
        name: "heading-2",
        label: "Heading 2",
        description: "Medium section title",
        syntax: "## ",
        icon: <Heading2 size={13} strokeWidth={1.5} />
    },
    {
        name: "heading-3",
        label: "Heading 3",
        description: "Small section title",
        syntax: "### ",
        icon: <Heading3 size={13} strokeWidth={1.5} />
    },
    {
        name: "code-block",
        label: "Code block",
        description: "Fenced code",
        syntax: "```\n\n```",
        cursorOffset: 4,
        icon: <Code size={13} strokeWidth={1.5} />
    },
    {
        name: "quote",
        label: "Quote",
        description: "Block quotation",
        syntax: "> ",
        icon: <Quote size={13} strokeWidth={1.5} />
    },
    {
        name: "task-list",
        label: "Task list",
        description: "Checkbox item",
        syntax: "- [ ] ",
        icon: <CheckSquare size={13} strokeWidth={1.5} />
    },
    {
        name: "hr",
        label: "Horizontal rule",
        description: "Section divider",
        syntax: "---\n",
        icon: <Minus size={13} strokeWidth={1.5} />
    }
];
