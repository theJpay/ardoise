import db from "./db";

import type { Note, NoteUpdate, NoteWrite } from "@entities";

export async function getNotes(): Promise<Note[]> {
    return await db.notes
        .filter((note) => note.deletedAt === null && note.archivedAt === null)
        .toArray();
}

export async function getArchivedNotes(): Promise<Note[]> {
    return await db.notes
        .orderBy("archivedAt")
        .reverse()
        .filter((note) => note.deletedAt === null)
        .toArray();
}

export async function getTrashedNotes(): Promise<Note[]> {
    return await db.notes.orderBy("deletedAt").reverse().toArray();
}

export async function createNote(write: NoteWrite): Promise<Note> {
    const newNoteId = await db.notes.add({
        ...write,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
        pinnedAt: null,
        archivedAt: null,
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

export async function pinNote(id: string): Promise<void> {
    await db.notes.update(id, { pinnedAt: new Date() });
}

export async function unpinNote(id: string): Promise<void> {
    await db.notes.update(id, { pinnedAt: null });
}

export async function archiveNote(id: string): Promise<void> {
    await db.notes.update(id, { archivedAt: new Date() });
}

export async function restoreFromArchive(id: string): Promise<void> {
    await db.notes.update(id, { archivedAt: null });
}

export async function restoreFromTrash(id: string): Promise<void> {
    await db.notes.update(id, { deletedAt: null });
}

export async function deleteNote(id: string): Promise<boolean> {
    const nbUpdated = await db.notes.update(id, { deletedAt: new Date(), archivedAt: null });

    return nbUpdated > 0;
}

export async function hardDeleteNote(id: string): Promise<void> {
    await db.notes.delete(id);
}

export async function hardDeleteAllNotes(): Promise<void> {
    await db.notes.clear();
}
