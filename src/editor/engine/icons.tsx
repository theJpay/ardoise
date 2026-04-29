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

import type { ActionName } from "./actions";
import type { ComponentType } from "react";

type IconComponent = ComponentType<{ size?: number; strokeWidth?: number }>;

export const ICONS: Record<ActionName, IconComponent> = {
    "heading-1": Heading1,
    "heading-2": Heading2,
    "heading-3": Heading3,
    quote: Quote,
    "code-block": Code,
    bold: Bold,
    italic: Italic,
    strikethrough: Strikethrough,
    code: Code,
    link: Link,
    "task-list": CheckSquare,
    hr: Minus
};
