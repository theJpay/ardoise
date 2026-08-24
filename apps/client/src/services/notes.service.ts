import { MAX_DEPTH, TRASH_RETENTION_DAYS } from "@entities";
import { moveBlocker } from "@utils/noteTree";

import notesRepository from "./notes.repository.dexie";

import type { Note, NoteUpdate, NoteWrite } from "@entities";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export async function getNotes(): Promise<Note[]> {
    return await notesRepository.findVisible();
}

export async function getArchivedNotes(): Promise<Note[]> {
    return await notesRepository.findArchived();
}

export async function getTrashedNotes(): Promise<Note[]> {
    return await notesRepository.findTrashed();
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
    await notesRepository.transaction(async () => {
        await notesRepository.add(newNote);
        if (newNote.parentId !== null) {
            await bumpLastActivity(newNote.parentId, now);
        }
    });
    return newNote;
}

async function assertParentAcceptsChild(parentId: string): Promise<void> {
    const parent = await notesRepository.findById(parentId);
    if (!parent || parent.deletedAt !== null) {
        throw new Error(`Parent note ${parentId} does not exist`);
    }
    let depth = 0;
    let currentId: string | null = parent.parentId;
    while (currentId !== null) {
        depth++;
        const ancestor = await notesRepository.findById(currentId);
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
    const original = await notesRepository.findById(id);
    if (!original) {
        throw new Error(`Note with id ${id} not found`);
    }

    return createNote({
        title: original.title,
        content: original.content
    });
}

export async function updateNote(id: string, updatedFields: NoteUpdate): Promise<Note> {
    const now = new Date();
    let updatedNote: Note | undefined;

    await notesRepository.transaction(async () => {
        const found = await notesRepository.update(id, {
            ...updatedFields,
            updatedAt: now,
            lastActivityAt: now
        });
        if (!found) {
            throw new Error(`Note with id ${id} not found`);
        }
        updatedNote = await notesRepository.findById(id);
        if (!updatedNote) {
            throw new Error("Failed to retrieve the updated note");
        }
        if (updatedNote.parentId !== null) {
            await bumpLastActivity(updatedNote.parentId, now);
        }
    });

    if (!updatedNote) {
        throw new Error("Failed to retrieve the updated note");
    }
    return updatedNote;
}

export async function pinNote(id: string): Promise<void> {
    await notesRepository.update(id, { pinnedAt: new Date() });
}

export async function unpinNote(id: string): Promise<void> {
    await notesRepository.update(id, { pinnedAt: null });
}

export async function moveNote(id: string, newParentId: string | null): Promise<void> {
    await notesRepository.transaction(async () => {
        const liveNotes = await notesRepository.findVisible();
        const blocker = moveBlocker(id, newParentId, liveNotes);
        if (blocker !== null) {
            throw new Error(`Cannot move note: ${blocker}`);
        }
        await notesRepository.update(id, { parentId: newParentId });
        if (newParentId !== null) {
            const subtreeIds = await collectSubtreeIds(id);
            const subtreeNotes = await notesRepository.findByIds(subtreeIds);
            const maxActivity = subtreeNotes.reduce(
                (max, n) => (n.lastActivityAt > max ? n.lastActivityAt : max),
                new Date(0)
            );
            await bumpLastActivity(newParentId, maxActivity);
        }
    });
}

type HiddenField = "deletedAt" | "archivedAt";

export const archiveNote = (id: string) => cascadeHide(id, "archivedAt");
export const deleteNote = (id: string) => cascadeHide(id, "deletedAt", "archivedAt");
export const restoreFromArchive = (id: string) => restoreFromHidden(id, "archivedAt");
export const restoreFromTrash = (id: string) => restoreFromHidden(id, "deletedAt");

async function cascadeHide(
    rootId: string,
    field: HiddenField,
    alsoClear?: HiddenField
): Promise<void> {
    const now = new Date();
    await notesRepository.transaction(async () => {
        const ids = await collectSubtreeIds(rootId);
        const patch: Partial<Note> = {
            [field]: now,
            ...(alsoClear ? { [alsoClear]: null } : {})
        };
        await notesRepository.modifyMany(ids, patch);
    });
}

async function restoreFromHidden(id: string, field: HiddenField): Promise<void> {
    await notesRepository.transaction(async () => {
        const note = await notesRepository.findById(id);
        if (!note) {
            return;
        }
        let parentId = note.parentId;
        if (parentId !== null) {
            const parent = await notesRepository.findById(parentId);
            if (!parent || parent[field] !== null) {
                parentId = null;
            }
        }
        await notesRepository.update(id, { [field]: null, parentId });
    });
}

async function bumpLastActivity(startNoteId: string, when: Date): Promise<void> {
    let currentId: string | null = startNoteId;
    while (currentId !== null) {
        const note: Note | undefined = await notesRepository.findById(currentId);
        if (!note) {
            break;
        }
        if (note.lastActivityAt < when) {
            await notesRepository.update(currentId, { lastActivityAt: when });
        }
        currentId = note.parentId;
    }
}

async function collectSubtreeIds(rootId: string): Promise<string[]> {
    const all: string[] = [rootId];
    let frontier: string[] = [rootId];
    while (frontier.length > 0) {
        const children = await notesRepository.findChildrenOf(frontier);
        const childIds = children.map((c) => c.id);
        all.push(...childIds);
        frontier = childIds;
    }
    return all;
}

export async function hardDeleteNote(id: string): Promise<void> {
    await notesRepository.delete(id);
}

export async function sweepExpiredTrash(): Promise<number> {
    const cutoff = new Date(Date.now() - TRASH_RETENTION_DAYS * MS_PER_DAY);
    return await notesRepository.deleteTrashedBefore(cutoff);
}

export async function hardDeleteAllNotes(): Promise<void> {
    await notesRepository.deleteAll();
}
