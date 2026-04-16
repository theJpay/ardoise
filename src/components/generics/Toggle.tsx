type ToggleProps = {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
};

function Toggle({ checked, onChange, disabled }: ToggleProps) {
    return (
        <button
            aria-checked={checked}
            className={`relative h-4.5 w-8 shrink-0 rounded-full transition-colors duration-150 disabled:cursor-default disabled:opacity-35 ${
                checked ? "bg-accent" : "bg-border"
            }`}
            disabled={disabled}
            role="switch"
            onClick={() => onChange(!checked)}
        >
            <span
                className={`absolute top-0.75 left-0.75 h-3 w-3 rounded-full transition-transform duration-150 ${
                    checked ? "bg-editor-bg translate-x-3.5" : "bg-muted"
                }`}
            />
        </button>
    );
}

export default Toggle;
