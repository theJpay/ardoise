type ToggleProps = {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
};

function Toggle({ checked, onChange, disabled }: ToggleProps) {
    return (
        <button
            aria-checked={checked}
            className={`group duration-base relative h-4.5 w-8 shrink-0 rounded-full transition-colors disabled:cursor-default ${
                checked ? "bg-accent disabled:bg-accent-dim" : "bg-border disabled:bg-border-soft"
            }`}
            disabled={disabled}
            role="switch"
            onClick={() => onChange(!checked)}
        >
            <span
                className={`duration-base group-disabled:bg-dim absolute top-0.75 left-0.75 h-3 w-3 rounded-full transition-transform ${
                    checked ? "bg-editor-bg translate-x-3.5" : "bg-muted"
                }`}
            />
        </button>
    );
}

export default Toggle;
