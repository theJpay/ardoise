import {
    Bold,
    CheckSquare,
    Code,
    Heading1,
    Heading2,
    Heading3,
    Italic,
    Link,
    Minus,
    Quote,
    Strikethrough
} from "lucide-react";

import type { BlockActionName, CommandPaletteActionName, InlineActionName } from "./actions";

export const TOOLBAR_ACTION_ICONS: Record<BlockActionName, React.ReactNode> = {
    "heading-1": <Heading1 size={14} strokeWidth={1.5} />,
    "heading-2": <Heading2 size={14} strokeWidth={1.5} />,
    "heading-3": <Heading3 size={14} strokeWidth={1.5} />,
    "code-block": <Code size={14} strokeWidth={1.5} />,
    quote: <Quote size={14} strokeWidth={1.5} />
};

export const FLOATING_TOOLBAR_ACTION_ICONS: Record<InlineActionName, React.ReactNode> = {
    bold: <Bold size={13} strokeWidth={1.5} />,
    italic: <Italic size={13} strokeWidth={1.5} />,
    strikethrough: <Strikethrough size={13} strokeWidth={1.5} />,
    code: <Code size={13} strokeWidth={1.5} />,
    link: <Link size={13} strokeWidth={1.5} />
};

export const COMMAND_PALETTE_ACTION_ICONS: Record<CommandPaletteActionName, React.ReactNode> = {
    "heading-1": <Heading1 size={13} strokeWidth={1.5} />,
    "heading-2": <Heading2 size={13} strokeWidth={1.5} />,
    "heading-3": <Heading3 size={13} strokeWidth={1.5} />,
    "code-block": <Code size={13} strokeWidth={1.5} />,
    quote: <Quote size={13} strokeWidth={1.5} />,
    hr: <Minus size={13} strokeWidth={1.5} />,
    "task-list": <CheckSquare size={13} strokeWidth={1.5} />
};
