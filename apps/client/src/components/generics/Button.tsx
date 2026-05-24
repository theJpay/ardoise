import DepletionBar from "./DepletionBar";

import type { LucideIcon } from "lucide-react";

type Variant = "primary" | "ghost" | "danger";

type ButtonProps = {
    label: string;
    variant?: Variant;
    icon?: LucideIcon;
    armed?: boolean;
    disabled?: boolean;
    onClick?: () => void;
};

const VARIANT_CLASSES: Record<Variant, string> = {
    primary: "bg-accent text-editor-bg hover:bg-accent-hover",
    ghost: "bg-transparent text-muted border border-border hover:bg-elevated hover:text-text hover:border-muted",
    danger: "bg-danger-surface text-danger border border-danger-border hover:bg-danger-surface-hover"
};

const DISABLED_CLASSES: Record<Variant, string> = {
    primary: "bg-accent-dim text-muted",
    ghost: "bg-transparent text-dim border border-border-soft",
    danger: "bg-transparent text-dim border border-border-soft"
};

function Button({ label, variant = "primary", icon: Icon, armed, disabled, onClick }: ButtonProps) {
    const variantClass = disabled ? DISABLED_CLASSES[variant] : VARIANT_CLASSES[variant];
    return (
        <button
            className={`text-ui-base duration-fast relative flex h-8 shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded px-4 font-medium transition-colors ${disabled ? "cursor-not-allowed" : ""} ${variantClass}`}
            disabled={disabled}
            onClick={onClick && (() => onClick())}
        >
            {Icon && <Icon size={14} strokeWidth={2} />}
            {label}
            {armed && <DepletionBar />}
        </button>
    );
}

export default Button;
