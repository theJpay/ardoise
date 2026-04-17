type InlineHintProps = {
    title: string;
    subtitle: string;
};

function InlineHint({ title, subtitle }: InlineHintProps) {
    return (
        <div className="border-border mx-3 mt-1 border-l-2 px-2.5 py-2">
            <div className="text-ui-base text-muted">{title}</div>
            <div className="text-ui-sm text-subtle mt-0.5 font-light">{subtitle}</div>
        </div>
    );
}

export default InlineHint;
