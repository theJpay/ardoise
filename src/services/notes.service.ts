import db from "./db";

import type { Note, NoteUpdate } from "@entities";

export async function getNotes(): Promise<Note[]> {
    return await db.notes
        .orderBy("updatedAt")
        .reverse()
        .filter((note) => note.deletedAt === null)
        .toArray();
}

export async function createNote(
    partialNote: Omit<Note, "id" | "createdAt" | "updatedAt" | "deletedAt">
): Promise<Note> {
    const newNoteId = await db.notes.add({
        ...partialNote,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
    });

    const newNote = await db.notes.get(newNoteId);

    if (!newNote) {
        throw new Error("Failed to retrieve the newly created note");
    }
    return newNote;
}

export async function duplicateNote(id: string): Promise<Note> {
    const original = await db.notes.get(id);
    if (!original) {
        throw new Error(`Note with id ${id} not found`);
    }

    return createNote({
        title: original.title,
        content: original.content
    });
}

export async function updateNote(id: string, updatedFields: NoteUpdate): Promise<Note> {
    const nbUpdated = await db.notes.update(id, { ...updatedFields, updatedAt: new Date() });

    if (nbUpdated === 0) {
        throw new Error(`Note with id ${id} not found`);
    }

    const updatedNote = await db.notes.get(id);

    if (!updatedNote) {
        throw new Error("Failed to retrieve the updated note");
    }
    return updatedNote;
}

export async function deleteNote(id: string): Promise<boolean> {
    const nbUpdated = await db.notes.update(id, { deletedAt: new Date() });

    return nbUpdated > 0;
}

export async function hardDeleteNote(id: string): Promise<void> {
    await db.notes.delete(id);
}

export async function hardDeleteAllNotes(): Promise<void> {
    await db.notes.clear();
}
