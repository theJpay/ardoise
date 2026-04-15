import { Link, useMatch } from "react-router";

type RailButtonProps = {
    icon: React.ReactNode;
    label: string;
    disabled?: boolean;
    isActive?: boolean;
    to?: string;
    onClick?: () => void;
};

function RailButton({ icon, label, disabled, isActive, to, onClick }: RailButtonProps) {
    const routeMatch = useMatch(to ? `${to}/*` : "");
    const active = !disabled && (isActive ?? !!routeMatch);

    const className = `w-8 h-8 rounded-md flex items-center justify-center transition-colors duration-100 disabled:text-dim disabled:pointer-events-none ${
        active
            ? "text-accent bg-accent-surface hover:bg-accent-surface-hover"
            : "text-subtle hover:bg-surface hover:text-muted"
    }`;

    if (to) {
        return (
            <Link aria-label={label} className={className} to={to}>
                {icon}
            </Link>
        );
    }

    return (
        <button aria-label={label} className={className} disabled={disabled} onClick={onClick}>
            {icon}
        </button>
    );
}

export default RailButton;
