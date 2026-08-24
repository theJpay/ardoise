import type { ReactNode } from "react";

type HiddenNotesPageProps = {
    title: string;
    subtitle?: string;
    isPending: boolean;
    isEmpty: boolean;
    emptyMessage: string;
    children?: ReactNode;
};

function HiddenNotesPage({
    title,
    subtitle,
    isPending,
    isEmpty,
    emptyMessage,
    children
}: HiddenNotesPageProps) {
    return (
        <div className="bg-bg h-full overflow-y-auto px-8 py-7">
            <div className="mx-auto max-w-2xl">
                <h1 className="text-text text-xl font-medium tracking-tight">{title}</h1>
                {subtitle ? (
                    <div className="text-ui-base text-subtle mt-1 mb-6 font-mono">{subtitle}</div>
                ) : (
                    <div className="h-5" />
                )}

                {isPending ? (
                    <div className="flex flex-col gap-1">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-surface h-12 animate-pulse rounded" />
                        ))}
                    </div>
                ) : isEmpty ? (
                    <div className="border-border text-ui-base text-muted border-l-2 px-2.5 py-2">
                        {emptyMessage}
                    </div>
                ) : (
                    <div className="flex flex-col gap-px">{children}</div>
                )}
            </div>
        </div>
    );
}

export default HiddenNotesPage;
