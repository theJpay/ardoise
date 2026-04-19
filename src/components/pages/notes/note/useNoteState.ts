import { useCallback, useEffect, useRef, useState } from "react";

import { NoteEntity } from "@entities";
import { useDebounce } from "@hooks/useDebounce";
import { useNotesMutations, useNotesQuery } from "@queries/useNotesQuery";

import type { Note } from "@entities";
import type { EditorMode } from "@hooks/useEditorMode";

// Future: "recording" will be added when voice input is implemented
export type SaveStatus = "saved" | "writing";

export function useNoteState(noteId: string | undefined, mode: EditorMode) {
    const { notes, isPending } = useNotesQuery();
    const { updateNote } = useNotesMutations();

    const selectedNote = notes.find((note) => note.id === noteId);

    const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
    const [saveError, setSaveError] = useState(false);
    const lastFailedUpdate = useRef<{ id: string; fields: Record<string, string> } | null>(null);

    const { debouncedCallback: debouncedUpdateTitle } = useDebounce(
        async (noteId: string, title: string) => {
            try {
                await updateNote({ id: noteId, fields: { title } });
                setSaveStatus("saved");
                setSaveError(false);
            } catch {
                setSaveError(true);
                lastFailedUpdate.current = { id: noteId, fields: { title } };
            }
        }
    );
    const { debouncedCallback: debouncedUpdateContent } = useDebounce(
        async (noteId: string, content: string) => {
            try {
                await updateNote({ id: noteId, fields: { content } });
                setSaveStatus("saved");
                setSaveError(false);
            } catch {
                setSaveError(true);
                lastFailedUpdate.current = { id: noteId, fields: { content } };
            }
        }
    );

    const retrySave = useCallback(async () => {
        if (!lastFailedUpdate.current) {
            return;
        }
        try {
            const { id, fields } = lastFailedUpdate.current;
            await updateNote({ id, fields });
            setSaveStatus("saved");
            setSaveError(false);
            lastFailedUpdate.current = null;
        } catch {
            // Still failing — keep the error state
        }
    }, [updateNote]);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [selection, setSelection] = useState({ start: 0, end: 0 });
    const [focused, setFocused] = useState(false);
    const editorRef = useRef<HTMLTextAreaElement>(null);
    const titleRef = useRef<HTMLInputElement>(null);
    const phantomRef = useRef<HTMLDivElement>(null);
    const lastCursorRef = useRef({ start: 0, end: 0 });

    const handleContentChange = (newContent: string) => {
        setContent(newContent);
        setSaveStatus("writing");
        if (selectedNote) {
            debouncedUpdateContent(selectedNote.id, newContent);
        }
    };

    const handleCursorChange = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
        const next = {
            start: e.currentTarget.selectionStart,
            end: e.currentTarget.selectionEnd
        };
        setSelection(next);
        lastCursorRef.current = next;
    };

    const resetSelection = () => {
        setSelection({ start: 0, end: 0 });
    };

    const handleTitleChange = (newTitle: string) => {
        setTitle(newTitle);
        setSaveStatus("writing");
        if (selectedNote) {
            debouncedUpdateTitle(selectedNote.id, newTitle);
        }
    };

    useSyncNoteToLocalState(selectedNote, setTitle, setContent);
    useDocumentTitle(title, selectedNote);
    useWarnUnsavedChanges(saveStatus);
    useFocusOnLoad(titleRef, editorRef, selectedNote);
    useResetCursorOnNoteChange(lastCursorRef, selectedNote?.id);
    useRestoreEditorOnModeChange(editorRef, lastCursorRef, mode);

    return {
        isPending,
        selectedNote,
        title,
        content,
        selection,
        focused,
        editorRef,
        titleRef,
        phantomRef,
        saveStatus,
        saveError,
        retrySave,
        resetSelection,
        handleContentChange,
        handleCursorChange,
        handleTitleChange,
        setFocused
    };
}

function useSyncNoteToLocalState(
    selectedNote: Note | undefined,
    setTitle: (title: string) => void,
    setContent: (content: string) => void
) {
    useEffect(() => {
        if (selectedNote) {
            setTitle(selectedNote.title);
            setContent(selectedNote.content);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedNote?.id]);
}

function useDocumentTitle(title: string, selectedNote: Note | undefined) {
    useEffect(() => {
        if (selectedNote) {
            document.title = `${NoteEntity.getTitle({ title })} — Ardoise`;
        }
    }, [title, selectedNote]);
}

function useWarnUnsavedChanges(saveStatus: SaveStatus) {
    useEffect(() => {
        if (saveStatus === "saved") {
            return;
        }

        const handler = (e: BeforeUnloadEvent) => {
            e.preventDefault();
        };

        window.addEventListener("beforeunload", handler);
        return () => window.removeEventListener("beforeunload", handler);
    }, [saveStatus]);
}

function useFocusOnLoad(
    titleRef: React.RefObject<HTMLInputElement | null>,
    editorRef: React.RefObject<HTMLTextAreaElement | null>,
    selectedNote: Note | undefined
) {
    useEffect(() => {
        if (!selectedNote) {
            return;
        }
        if (selectedNote.title.trim() === "") {
            titleRef.current?.focus();
        } else {
            editorRef.current?.focus();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedNote?.id]);
}

function useResetCursorOnNoteChange(
    lastCursorRef: React.RefObject<{ start: number; end: number }>,
    noteId: string | undefined
) {
    useEffect(() => {
        lastCursorRef.current = { start: 0, end: 0 };
    }, [noteId, lastCursorRef]);
}

function useRestoreEditorOnModeChange(
    editorRef: React.RefObject<HTMLTextAreaElement | null>,
    lastCursorRef: React.RefObject<{ start: number; end: number }>,
    mode: EditorMode
) {
    useEffect(() => {
        if (mode !== "edit") {
            return;
        }
        const textarea = editorRef.current;
        if (!textarea) {
            return;
        }
        textarea.focus();
        const { start, end } = lastCursorRef.current;
        textarea.setSelectionRange(start, end);
    }, [mode, editorRef, lastCursorRef]);
}
