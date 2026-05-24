import { useCallback, useEffect, useRef, useState } from "react";

import { NoteEntity } from "@entities";
import { useDebounce } from "@hooks/useDebounce";
import { updateNote } from "@services/notes.service";
import { useNotes } from "@stores/notes.store";

import type { Note } from "@entities";
import type { RefObject } from "react";

export type SaveStatus = "saved" | "writing" | "error";

type NoteFields = { title?: string; content?: string };

export function useNoteData(noteId: string) {
    const { notes, isPending } = useNotes();

    const selectedNote = notes.find((note) => note.id === noteId);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
    const pendingUpdate = useRef<{ id: string; fields: NoteFields } | null>(null);

    const lastSyncedIdRef = useRef<string | undefined>(undefined);
    if (selectedNote?.id !== lastSyncedIdRef.current) {
        lastSyncedIdRef.current = selectedNote?.id;
        setTitle(selectedNote?.title ?? "");
        setContent(selectedNote?.content ?? "");
    }

    const flushPendingUpdate = useCallback(async () => {
        const pending = pendingUpdate.current;
        if (!pending) {
            return;
        }
        try {
            await updateNote(pending.id, pending.fields);
            if (pendingUpdate.current === pending) {
                pendingUpdate.current = null;
                setSaveStatus("saved");
            }
        } catch {
            if (pendingUpdate.current === pending) {
                setSaveStatus("error");
            }
        }
    }, []);

    const debouncedFlush = useDebounce(flushPendingUpdate);

    useEffect(() => {
        return () => {
            flushPendingUpdate();
        };
    }, [noteId, flushPendingUpdate]);

    const handleChange = useCallback(
        (fields: NoteFields) => {
            if (fields.title !== undefined) {
                setTitle(fields.title);
            }
            if (fields.content !== undefined) {
                setContent(fields.content);
            }

            const existingFields =
                pendingUpdate.current?.id === noteId ? pendingUpdate.current.fields : {};
            pendingUpdate.current = {
                id: noteId,
                fields: { ...existingFields, ...fields }
            };

            setSaveStatus("writing");
            debouncedFlush();
        },
        [noteId, debouncedFlush]
    );

    useDocumentTitle(title, selectedNote);
    useWarnUnsavedChanges(saveStatus);
    useExternalEditsSync({ note: selectedNote, pendingUpdate, setTitle, setContent });

    return {
        isPending,
        selectedNote,
        title,
        content,
        saveStatus,
        retrySave: flushPendingUpdate,
        handleChange
    };
}

function useDocumentTitle(title: string, note: Note | undefined) {
    useEffect(() => {
        if (note) {
            document.title = `${NoteEntity.getTitle({ title })} — Ardoise`;
        }
    }, [title, note]);
}

function useExternalEditsSync({
    note,
    pendingUpdate,
    setTitle,
    setContent
}: {
    note: Note | undefined;
    pendingUpdate: RefObject<{ id: string; fields: NoteFields } | null>;
    setTitle: (value: string) => void;
    setContent: (value: string) => void;
}) {
    useEffect(() => {
        if (!note) {
            return;
        }
        const pending = pendingUpdate.current;
        if (pending?.id === note.id) {
            return;
        }
        setTitle(note.title);
        setContent(note.content);
    }, [note, pendingUpdate, setTitle, setContent]);
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
