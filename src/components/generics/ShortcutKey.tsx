import type { LucideIcon } from "lucide-react";

type ShortcutKeyProps = {
    content: string | LucideIcon;
    variant?: "surface" | "bg" | "danger" | "soon";
};

const VARIANT_CLASSES = {
    surface: "bg-surface border-border-soft text-subtle",
    bg: "bg-bg border-border text-subtle",
    danger: "bg-transparent border-danger-border text-danger",
    soon: "bg-transparent border-border-soft text-dim"
} as const;

function ShortcutKey({ content: Content, variant = "surface" }: ShortcutKeyProps) {
    const variantClass = VARIANT_CLASSES[variant];

    return (
        <kbd
            className={`text-ui-xs inline-flex size-4.5 items-center justify-center rounded-sm border font-mono ${variantClass}`}
        >
            {typeof Content === "string" ? Content : <Content size={11} strokeWidth={2} />}
        </kbd>
    );
}

export default ShortcutKey;
