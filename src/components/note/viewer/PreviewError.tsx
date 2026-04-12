import { AlertCircle } from "lucide-react";

type PreviewErrorProps = {
    onSwitchToWrite: () => void;
};

function PreviewError({ onSwitchToWrite }: PreviewErrorProps) {
    return (
        <div className="bg-danger-surface border-danger-border text-ui-sm text-danger mb-4 flex items-center gap-2 rounded border px-3.5 py-2 font-mono">
            <AlertCircle className="shrink-0" size={12} strokeWidth={1.8} />
            <span>Preview error — unable to render markdown.</span>
            <button
                className="text-danger decoration-danger-border ml-auto shrink-0 underline underline-offset-2"
                onClick={onSwitchToWrite}
            >
                Switch to write mode
            </button>
        </div>
    );
}

export default PreviewError;
