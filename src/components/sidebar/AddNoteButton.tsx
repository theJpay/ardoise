import { Plus } from "lucide-react";

function AddNoteButton({ onClick }: { onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-accent text-editor-bg rounded text-xs font-medium hover:opacity-85 transition-opacity"
        >
            <Plus size={14} strokeWidth={1.5} />
            New note
        </button>
    );
}

export default AddNoteButton;
