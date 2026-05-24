import type { SaveStatus } from "./useNoteData";

function EditorStatus({ status }: { status: SaveStatus }) {
    if (status === "error") {
        return <span className="text-ui-sm text-danger font-mono">Error saving</span>;
    }

    if (status === "writing") {
        return <span className="text-ui-sm text-subtle font-mono">Writing...</span>;
    }

    return (
        <span className="text-ui-sm text-accent flex items-center gap-1.5 font-mono">
            <span className="bg-accent inline-block h-1.25 w-1.25 rounded-full" />
            Saved locally
        </span>
    );
}

export default EditorStatus;
