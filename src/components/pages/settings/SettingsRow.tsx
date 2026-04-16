import type { ReactNode } from "react";

type SettingsRowProps = {
    label?: string;
    description?: string;
    children?: ReactNode;
};

function SettingsRow({ label, description, children }: SettingsRowProps) {
    return (
        <div className="flex min-h-11 items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
            <div className="flex flex-col gap-0.5">
                {label && <span className="text-ui-base text-text">{label}</span>}
                {description && <span className="text-ui-sm text-subtle">{description}</span>}
            </div>
            {children}
        </div>
    );
}

export default SettingsRow;
