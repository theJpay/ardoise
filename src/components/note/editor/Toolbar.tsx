import { BLOCK_ACTIONS } from "./utils";

type ToolbarProps = {
    isBlockActive: (actionName: string) => boolean;
    onToggleBlock: (actionName: string) => void;
};

function Toolbar({ isBlockActive, onToggleBlock }: ToolbarProps) {
    return (
        <div className="border-border-soft flex h-10 shrink-0 items-center gap-0.5 border-b px-5">
            {BLOCK_ACTIONS.map(({ name, icon, label }) => (
                <button
                    key={name}
                    aria-label={label}
                    className={`flex h-7 w-7 items-center justify-center rounded transition-colors duration-100 ${
                        isBlockActive(name)
                            ? "text-accent bg-accent-glow"
                            : "text-dim hover:bg-surface hover:text-muted"
                    }`}
                    onClick={() => onToggleBlock(name)}
                >
                    {icon}
                </button>
            ))}
            <div className="bg-border-soft mx-1 h-4 w-px" />
        </div>
    );
}

export default Toolbar;
