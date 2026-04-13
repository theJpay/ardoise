import { Plus } from "lucide-react";

function AddNoteButton({ onClick }: { onClick?: () => void }) {
    return (
        <button
            className="bg-accent text-editor-bg text-ui-base hover:bg-accent-hover flex h-8 items-center justify-center gap-1.5 rounded px-4 font-medium transition-colors"
            onClick={onClick}
        >
            <Plus size={14} strokeWidth={2} />
            New note
        </button>
    );
}

export default AddNoteButton;
