import { File } from "lucide-react";

import { NoteEntity } from "@entities";

import type { Note } from "@entities";
import type { ReactNode } from "react";

type HiddenNoteRowProps = {
    note: Note;
    meta: string;
    actions: ReactNode;
};

function HiddenNoteRow({ note, meta, actions }: HiddenNoteRowProps) {
    return (
        <div className="bg-surface hover:bg-elevated group duration-fast flex items-center gap-3 rounded px-4 py-3 transition-colors">
            <File className="text-subtle shrink-0" size={13} strokeWidth={1.5} />
            <div className="min-w-0 flex-1">
                <div className="text-ui-base text-text truncate">{NoteEntity.getTitle(note)}</div>
                <div className="text-ui-xs text-subtle mt-0.5 font-mono">{meta}</div>
            </div>
            <div className="duration-fast flex shrink-0 gap-1.5 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
                {actions}
            </div>
        </div>
    );
}

export default HiddenNoteRow;
