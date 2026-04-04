import { Plus } from "lucide-react";

function AddNoteButton({ onClick }: { onClick?: () => void }) {
    return (
        <button
            className="bg-accent text-editor-bg text-ui-base flex h-8 w-full items-center justify-center gap-1.5 rounded px-2 font-medium transition-opacity hover:opacity-85"
            onClick={onClick}
        >
            <Plus size={14} strokeWidth={2} />
            New note
        </button>
    );
}

export default AddNoteButton;
