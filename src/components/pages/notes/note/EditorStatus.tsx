import type { SaveStatus } from "./useNoteState";

function EditorStatus({ status }: { status: SaveStatus }) {
    if (status === "writing") {
        return (
            <span className="text-ui-sm text-subtle font-mono tracking-[0.06em]">Writing...</span>
        );
    }

    return (
        <span className="text-ui-sm text-accent flex items-center gap-1.5 font-mono tracking-[0.06em]">
            <span className="bg-accent inline-block h-1.25 w-1.25 rounded-full" />
            Saved locally
        </span>
    );
}

export default EditorStatus;
