import type { ReactNode } from "react";

type SettingsSectionProps = {
    title: string;
    children: ReactNode;
};

function SettingsSection({ title, children }: SettingsSectionProps) {
    return (
        <div>
            <h1 className="text-ui-h1 text-text mb-5">{title}</h1>
            <div className="bg-surface rounded p-4">{children}</div>
        </div>
    );
}

export default SettingsSection;
