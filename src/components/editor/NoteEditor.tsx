import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useDebounce } from "@hooks/useDebounce";
import { useNotes, useNotesActions } from "@stores/notes.store";

import { MarkdownEditor } from "../markdownEditor";

function NoteEditor() {
    const navigate = useNavigate();
    const { noteId } = useParams<{ noteId: string }>();

    const { updateNote } = useNotesActions();
    const selectedNote = useNotes().find((note) => note.id === noteId);
    const { debouncedCallback: debouncedUpdateNote } = useDebounce(updateNote);

    const [title, setTitle] = useState(selectedNote?.title || "");
    const [content, setContent] = useState(selectedNote?.content || "");

    useEffect(() => {
        if (!selectedNote) {
            return;
        }

        setTitle(selectedNote.title);
        setContent(selectedNote.content);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedNote?.id]);

    useEffect(() => {
        if (!selectedNote) {
            navigate("/");
        }
    }, [selectedNote, navigate]);

    if (!selectedNote) {
        return null;
    }

    const handleTitleChange = (newTitle: string) => {
        setTitle(newTitle);
        debouncedUpdateNote(selectedNote.id, { title: newTitle });
    };

    const handleContentChange = (newContent: string) => {
        setContent(newContent);
        debouncedUpdateNote(selectedNote.id, { content: newContent });
    };

    return (
        <div className="flex flex-col h-full bg-editor-bg">
            <div className="flex-1 overflow-y-auto flex justify-center px-6 py-12">
                <div className="w-full max-w-[72ch] flex flex-col gap-2">
                    <input
                        value={title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="Untitled"
                        className="bg-transparent font-mono font-medium text-[20px] leading-tight tracking-[-0.02em] text-text placeholder:text-subtle outline-none border-none w-full"
                    />
                    <div className="font-mono text-[10px] text-subtle tracking-[0.06em] mb-6">
                        {new Intl.DateTimeFormat("en", {
                            dateStyle: "medium",
                            timeStyle: "short"
                        }).format(selectedNote.updatedAt)}
                    </div>
                    <MarkdownEditor text={content} onChange={handleContentChange} />
                </div>
            </div>

            <div className="h-7.5 px-4 border-t border-border-soft flex items-center justify-between shrink-0">
                <span className="font-mono text-[9px] text-subtle tracking-[0.06em]">
                    {content.trim().split(/\s+/).filter(Boolean).length} words
                </span>
                <span className="font-mono text-[9px] text-accent tracking-[0.08em] flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-accent inline-block" />
                    Saved
                </span>
            </div>
        </div>
    );
}

export default NoteEditor;
