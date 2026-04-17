import { FileX } from "lucide-react";

function NoteNotFound() {
    return (
        <div className="flex h-full flex-col items-center justify-center gap-2.5">
            <FileX className="text-subtle" size={16} strokeWidth={1.5} />
            <div className="flex flex-col items-center gap-1 text-center">
                <p className="text-ui-base text-muted font-medium">Note not found</p>
                <p className="text-ui-sm text-subtle max-w-50">This note may have been deleted.</p>
            </div>
        </div>
    );
}

export default NoteNotFound;
