import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useDebounce } from "@hooks/useDebounce";
import { useNotes, useNotesActions } from "@stores/notes.store";

import { MarkdownEditor } from "../markdownEditor";
import NoteEditorFooter from "./NoteEditorFooter";
import NoteEditorTitle from "./NoteEditorTitle";

function NoteEditor() {
    const navigate = useNavigate();
    const { noteId } = useParams<{ noteId: string }>();

    const { updateNote } = useNotesActions();
    const selectedNote = useNotes().find((note) => note.id === noteId);

    const { debouncedCallback: debouncedUpdateNote } = useDebounce(updateNote);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

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

    const wordCount = content.trim() === "" ? 0 : content.trim().split(/\s+/).length;

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
                    <NoteEditorTitle
                        title={title}
                        date={selectedNote.updatedAt}
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
