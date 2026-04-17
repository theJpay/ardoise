import type { LucideIcon } from "lucide-react";

type Variant = "primary" | "ghost" | "danger";

type ButtonProps = {
    label: string;
    variant?: Variant;
    icon?: LucideIcon;
    onClick?: () => void;
};

const VARIANT_CLASSES: Record<Variant, string> = {
    primary: "bg-accent text-editor-bg hover:bg-accent-hover",
    ghost: "bg-transparent text-muted border border-border hover:bg-elevated hover:text-text hover:border-muted",
    danger: "bg-danger-surface text-danger border border-danger-border hover:bg-danger-surface-hover"
};

function Button({ label, variant = "primary", icon: Icon, onClick }: ButtonProps) {
    return (
        <button
            className={`text-ui-base flex h-8 shrink-0 items-center justify-center gap-1.5 rounded px-4 font-medium transition-colors ${VARIANT_CLASSES[variant]}`}
            onClick={onClick}
        >
            {Icon && <Icon size={14} strokeWidth={2} />}
            {label}
        </button>
    );
}

export default Button;
