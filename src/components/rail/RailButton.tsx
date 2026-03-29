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
        isActive ? "text-accent bg-accent-glow" : "text-subtle hover:bg-surface hover:text-muted"
    }`;

    if (to) {
        return (
            <Link to={to} className={className} aria-label={label}>
                {icon}
            </Link>
        );
    }

    return (
        <button onClick={onClick} className={className} aria-label={label}>
            {icon}
        </button>
    );
}

export default RailButton;
