import type { ReactNode } from "react";

type Variant = "default" | "danger";

type SettingsSectionProps = {
    title: string;
    variant?: Variant;
    children: ReactNode;
};

const VARIANT_CLASSES: Record<Variant, string> = {
    default: "bg-surface",
    danger: "bg-danger-surface border border-danger-border"
};

function SettingsSection({ title, variant = "default", children }: SettingsSectionProps) {
    return (
        <div>
            <h1 className="text-ui-h1 text-text mb-5">{title}</h1>
            <div className={`rounded p-4 ${VARIANT_CLASSES[variant]}`}>{children}</div>
        </div>
    );
}

export default SettingsSection;
