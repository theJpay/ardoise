import { Bold, Code, Heading1, Heading2, Heading3, Italic, Quote } from "lucide-react";

export const TOOLBAR_ACTION_ICONS: Record<string, React.ReactNode> = {
    "heading-1": <Heading1 size={14} strokeWidth={1.5} />,
    "heading-2": <Heading2 size={14} strokeWidth={1.5} />,
    "heading-3": <Heading3 size={14} strokeWidth={1.5} />,
    quote: <Quote size={14} strokeWidth={1.5} />
};

export const FLOATING_TOOLBAR_ACTION_ICONS: Record<string, React.ReactNode> = {
    bold: <Bold size={13} strokeWidth={1.5} />,
    italic: <Italic size={13} strokeWidth={1.5} />,
    code: <Code size={13} strokeWidth={1.5} />
};
