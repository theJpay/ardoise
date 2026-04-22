import { AlertCircle } from "lucide-react";

type StorageErrorBannerProps = {
    onRetry: () => void;
};

function StorageErrorBanner({ onRetry }: StorageErrorBannerProps) {
    return (
        <div className="bg-danger-surface border-danger-border text-ui-sm flex h-9 shrink-0 items-center justify-between border-b px-5 font-mono">
            <div className="text-danger flex items-center gap-2">
                <AlertCircle size={12} strokeWidth={1.5} />
                Failed to save. Your device storage may be full.
            </div>
            <button
                className="text-danger border-danger-border text-ui-sm hover:bg-danger-surface-hover rounded-sm border bg-transparent px-2 py-0.5 font-mono transition-colors duration-fast"
                onClick={onRetry}
            >
                Retry
            </button>
        </div>
    );
}

export default StorageErrorBanner;
