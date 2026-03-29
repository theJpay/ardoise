import type { ReactNode } from "react";

type EmptyStateProps = {
    icon: ReactNode;
    title: string;
    body: string;
    action?: ReactNode;
};

function EmptyState({ icon, title, body, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="w-10 h-10 flex items-center justify-center bg-surface border border-border-soft rounded-md text-subtle">
                {icon}
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
                <p className="font-sans text-[13px] font-medium text-muted">{title}</p>
                <p className="font-mono text-[10px] text-subtle">{body}</p>
            </div>
            {action && <div className="mt-1">{action}</div>}
        </div>
    );
}

export default EmptyState;
