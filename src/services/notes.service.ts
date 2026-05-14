import { MAX_DEPTH, TRASH_RETENTION_DAYS } from "@entities";

import db from "./db";

import type { Note, NoteUpdate, NoteWrite } from "@entities";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

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

export async function createNote(write: NoteWrite = {}): Promise<Note> {
    if (write.parentId !== undefined && write.parentId !== null) {
        await assertParentAcceptsChild(write.parentId);
    }
    const now = new Date();
    const newNote: Note = {
        id: crypto.randomUUID(),
        title: "",
        content: "",
        createdAt: now,
        updatedAt: now,
        lastActivityAt: now,
        parentId: null,
        pinnedAt: null,
        archivedAt: null,
        deletedAt: null,
        ...write
    };
    await db.notes.add(newNote);
    return newNote;
}

async function assertParentAcceptsChild(parentId: string): Promise<void> {
    const parent = await db.notes.get(parentId);
    if (!parent || parent.deletedAt !== null) {
        throw new Error(`Parent note ${parentId} does not exist`);
    }
    let depth = 0;
    let currentId: string | null = parent.parentId;
    while (currentId !== null) {
        depth++;
        const ancestor = await db.notes.get(currentId);
        if (!ancestor) {
            break;
        }
        currentId = ancestor.parentId;
    }
    if (depth >= MAX_DEPTH) {
        throw new Error("Maximum nesting depth reached");
    }
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

export async function deleteNote(id: string): Promise<void> {
    await db.notes.update(id, { deletedAt: new Date(), archivedAt: null });
}

export async function hardDeleteNote(id: string): Promise<void> {
    await db.notes.delete(id);
}

export async function sweepExpiredTrash(): Promise<number> {
    const cutoff = new Date(Date.now() - TRASH_RETENTION_DAYS * MS_PER_DAY);
    return await db.notes.where("deletedAt").below(cutoff).delete();
}

export async function hardDeleteAllNotes(): Promise<void> {
    await db.notes.clear();
}
