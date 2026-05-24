type RestoreButtonProps = {
    onClick: () => void;
};

function RestoreButton({ onClick }: RestoreButtonProps) {
    return (
        <button
            className="text-ui-sm text-muted hover:bg-elevated hover:text-text border-border hover:border-muted duration-fast flex h-7 items-center rounded border px-2.5 transition-colors"
            onClick={onClick}
        >
            Restore
        </button>
    );
}

export default RestoreButton;
