import type { ReactNode } from "react";

type EmptyStateProps = {
    icon: ReactNode;
    title: string;
    body: string;
    action?: ReactNode;
};

function EmptyState({ icon, title, body, action }: EmptyStateProps) {
    return (
        <div className="flex h-full flex-col items-center justify-center gap-2.5">
            <div className="bg-surface border-border-soft text-subtle flex h-10 w-10 items-center justify-center rounded-lg border">
                {icon}
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
                <p className="text-ui-base text-muted font-sans font-medium">{title}</p>
                <p className="text-ui-sm text-subtle max-w-50 font-mono">{body}</p>
            </div>
            {action && <div className="mt-2">{action}</div>}
        </div>
    );
}

export default EmptyState;
