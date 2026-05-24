import { Command, Option } from "lucide-react";

import { isMac } from "@utils";

import type { LucideIcon } from "lucide-react";

type ShortcutKeyProps = {
    content: string | LucideIcon;
    variant?: "surface" | "danger";
};

const VARIANT_CLASSES = {
    surface: "bg-surface border-border-soft text-subtle",
    danger: "bg-transparent border-danger-border text-danger"
} as const;

const NON_MAC_FALLBACKS = new Map<LucideIcon, string>([
    [Command, "Ctrl"],
    [Option, "Alt"]
]);

function ShortcutKey({ content, variant = "surface" }: ShortcutKeyProps) {
    const variantClass = VARIANT_CLASSES[variant];
    const resolved = resolveContent(content);

    return (
        <kbd
            className={`text-ui-xs inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-sm border px-1 font-mono ${variantClass}`}
        >
            {typeof resolved === "string" ? resolved : renderIcon(resolved)}
        </kbd>
    );
}

function resolveContent(content: string | LucideIcon): string | LucideIcon {
    if (typeof content === "string" || isMac()) {
        return content;
    }
    return NON_MAC_FALLBACKS.get(content) ?? content;
}

function renderIcon(Icon: LucideIcon) {
    return <Icon size={11} strokeWidth={2} />;
}

export default ShortcutKey;
