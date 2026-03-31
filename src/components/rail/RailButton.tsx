import { Link } from "react-router";

type RailButtonProps = {
    icon: React.ReactNode;
    label: string;
    isActive?: boolean;
    to?: string;
    onClick?: () => void;
};

function RailButton({ icon, label, isActive, to, onClick }: RailButtonProps) {
    const className = `w-8 h-8 rounded-md flex items-center justify-center transition-colors duration-100 ${
        isActive ? "text-accent bg-accent-glow" : "text-dim hover:bg-surface hover:text-muted"
    }`;

    if (to) {
        return (
            <Link aria-label={label} className={className} to={to}>
                {icon}
            </Link>
        );
    }

    return (
        <button aria-label={label} className={className} onClick={onClick}>
            {icon}
        </button>
    );
}

export default RailButton;
