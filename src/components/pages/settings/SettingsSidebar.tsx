import { NavLink } from "react-router";

const NAV_ITEMS = [
    { label: "General", to: "/settings/general" },
    { label: "Privacy", to: "/settings/privacy" },
    { label: "Export", to: "/settings/export" }
];

function SettingsSidebar() {
    return (
        <nav className="bg-surface border-border flex w-45 shrink-0 flex-col gap-0.5 border-r pt-5">
            <div className="text-ui-xs text-dim px-4 pb-2.5 font-mono">Settings</div>
            {NAV_ITEMS.map((item) => (
                <NavLink
                    key={item.to}
                    className={({ isActive }) =>
                        `text-ui-base flex h-8 items-center border-l-2 px-4 transition-colors ${
                            isActive
                                ? "bg-elevated text-text border-accent pl-3.5"
                                : "text-muted hover:bg-elevated hover:text-text border-transparent"
                        }`
                    }
                    to={item.to}
                >
                    {item.label}
                </NavLink>
            ))}
            <NavLink
                className={({ isActive }) =>
                    `text-ui-base flex h-8 items-center border-l-2 px-4 transition-colors ${
                        isActive
                            ? "bg-danger-surface text-danger border-danger pl-3.5"
                            : "text-danger hover:bg-danger-surface border-transparent"
                    }`
                }
                to="/settings/danger"
            >
                Danger zone
            </NavLink>
        </nav>
    );
}

export default SettingsSidebar;
