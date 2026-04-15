import { NoteEntity } from "@entities";

import EditorStatus from "./EditorStatus";

import type { SaveStatus } from "./useNoteState";

type NoteFooterProps = {
    noteContent: string;
    saveStatus: SaveStatus;
};

function NoteFooter({ noteContent, saveStatus }: NoteFooterProps) {
    const wordCount = NoteEntity.getWordCount({ content: noteContent });
    const readTime = NoteEntity.getReadTime({ content: noteContent });

    return (
        <div className="border-border-soft flex h-8 shrink-0 items-center justify-between border-t px-5">
            <span className="text-ui-sm text-subtle font-mono">
                {wordCount} words · {readTime} min read
            </span>
            <div className="flex items-center gap-4">
                <span className="text-ui-sm text-subtle font-mono">
                    ⌘B sidebar · ⌘E mode · / commands
                </span>
                <EditorStatus status={saveStatus} />
            </div>
        </div>
    );
}

export default NoteFooter;
