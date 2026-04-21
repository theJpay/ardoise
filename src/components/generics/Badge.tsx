type BadgeProps = {
    label: string;
};

function Badge({ label }: BadgeProps) {
    return (
        <span className="text-ui-xs text-subtle bg-surface border-border-soft ml-1.5 inline-block rounded-sm border px-1.25 py-px align-middle font-mono">
            {label}
        </span>
    );
}

export default Badge;
