import { ArrowBigUp, Command } from "lucide-react";

import { ShortcutKey } from "@components/generics";
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
                {wordCount} words <span className="text-dim">·</span> {readTime} min read
            </span>
            <div className="flex items-center gap-4">
                <div className="text-ui-sm text-subtle flex items-center gap-1 font-mono">
                    <ShortcutKey content={Command} />
                    <ShortcutKey content={ArrowBigUp} />
                    <ShortcutKey content="B" />
                    <span>sidebar</span>
                    <span className="text-dim">·</span>
                    <ShortcutKey content={Command} />
                    <ShortcutKey content={ArrowBigUp} />
                    <ShortcutKey content="M" />
                    <span>mode</span>
                    <span className="text-dim">·</span>
                    <ShortcutKey content="/" />
                    <span>commands</span>
                </div>
                <EditorStatus status={saveStatus} />
            </div>
        </div>
    );
}

export default NoteFooter;
