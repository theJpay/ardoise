import { useEffect, useRef, useState } from "react";

import { useDebounce } from "@hooks/useDebounce";
import { useNotesMutations, useNotesQuery } from "@queries/useNotesQuery";

// Future: "recording" will be added when voice input is implemented
export type SaveStatus = "saved" | "writing";

export function useNoteState(noteId: string | undefined) {
    const { notes, isPending } = useNotesQuery();
    const { updateNote } = useNotesMutations();

    const selectedNote = notes.find((note) => note.id === noteId);

    const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");

    const { debouncedCallback: debouncedUpdateTitle } = useDebounce(
        async (noteId: string, title: string) => {
            await updateNote({ id: noteId, fields: { title } });
            setSaveStatus("saved");
        }
    );
    const { debouncedCallback: debouncedUpdateContent } = useDebounce(
        async (noteId: string, content: string) => {
            await updateNote({ id: noteId, fields: { content } });
            setSaveStatus("saved");
        }
    );

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [selection, setSelection] = useState({ start: 0, end: 0 });
    const [focused, setFocused] = useState(false);
    const editorRef = useRef<HTMLTextAreaElement>(null);
    const phantomRef = useRef<HTMLDivElement>(null);

    const handleContentChange = (newContent: string) => {
        setContent(newContent);
        setSaveStatus("writing");
        if (selectedNote) {
            debouncedUpdateContent(selectedNote.id, newContent);
        }
    };

    const handleCursorChange = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
        setSelection({
            start: e.currentTarget.selectionStart,
            end: e.currentTarget.selectionEnd
        });
    };

    const handleTitleChange = (newTitle: string) => {
        setTitle(newTitle);
        setSaveStatus("writing");
        if (selectedNote) {
            debouncedUpdateTitle(selectedNote.id, newTitle);
        }
    };

    useEffect(() => {
        if (selectedNote) {
            setTitle(selectedNote.title);
            setContent(selectedNote.content);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedNote?.id]);

    const wordCount = content.trim() === "" ? 0 : content.trim().split(/\s+/).length;

    return {
        isPending,
        selectedNote,
        title,
        content,
        selection,
        focused,
        editorRef,
        phantomRef,
        wordCount,
        saveStatus,
        handleContentChange,
        handleCursorChange,
        handleTitleChange,
        setFocused
    };
}
