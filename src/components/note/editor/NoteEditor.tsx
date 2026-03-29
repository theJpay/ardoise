import { useEffect, useState } from "react";
import { useDebounce } from "@hooks/useDebounce";
import { useNotesActions } from "@stores/notes.store";

import { MarkdownEditor } from "../../markdownEditor";
import NoteEditorFooter from "./NoteEditorFooter";
import NoteEditorTitle from "./NoteEditorTitle";

import type { Note } from "@entities";

function NoteEditor({ note }: { note: Note }) {
    const { updateNote } = useNotesActions();
    const { debouncedCallback: debouncedUpdateNote } = useDebounce(updateNote);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    useEffect(() => {
        setTitle(note.title);
        setContent(note.content);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [note.id]);

    const wordCount = content.trim() === "" ? 0 : content.trim().split(/\s+/).length;

    const handleTitleChange = (newTitle: string) => {
        setTitle(newTitle);
        debouncedUpdateNote(note.id, { title: newTitle });
    };

    const handleContentChange = (newContent: string) => {
        setContent(newContent);
        debouncedUpdateNote(note.id, { content: newContent });
    };

    return (
        <div className="flex flex-col h-full bg-editor-bg">
            <div className="flex-1 overflow-y-auto flex justify-center px-6 py-12">
                <div className="w-full max-w-[72ch] flex flex-col gap-2">
                    <NoteEditorTitle
                        title={title}
                        date={note.updatedAt}
                        onChange={handleTitleChange}
                    />
                    <MarkdownEditor text={content} onChange={handleContentChange} />
                </div>
            </div>

            <NoteEditorFooter wordCount={wordCount} />
        </div>
    );
}

export default NoteEditor;
