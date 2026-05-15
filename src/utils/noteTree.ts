import { sortNotes } from "./sortNotes";

import type { SortOrder } from "./sortNotes";
import type { Note } from "@entities";

export type NoteTreeNode = {
    note: Note;
    children: NoteTreeNode[];
    depth: number;
};

export function buildNoteTree(notes: Note[], sort: SortOrder): NoteTreeNode[] {
    const liveIds = new Set(notes.map((n) => n.id));
    const byEffectiveParent = new Map<string | null, Note[]>();

    for (const note of notes) {
        const parent = note.parentId !== null && liveIds.has(note.parentId) ? note.parentId : null;
        const siblings = byEffectiveParent.get(parent) ?? [];
        siblings.push(note);
        byEffectiveParent.set(parent, siblings);
    }

    return build(null, 0);

    function build(parentId: string | null, depth: number): NoteTreeNode[] {
        const siblings = byEffectiveParent.get(parentId) ?? [];
        return sortNotes(siblings, sort).map((note) => ({
            note,
            children: build(note.id, depth + 1),
            depth
        }));
    }
}

export function depthOf(noteId: string, notes: Note[]): number {
    return ancestorsOf(noteId, notes).length;
}

export function ancestorsOf(noteId: string, notes: Note[]): Note[] {
    const byId = new Map(notes.map((n) => [n.id, n]));
    const chain: Note[] = [];

    let current = byId.get(noteId);
    while (current && current.parentId !== null) {
        const parent = byId.get(current.parentId);
        if (!parent) {
            break;
        }
        chain.push(parent);
        current = parent;
    }

    return chain.reverse();
}

export function descendantsOf(noteId: string, notes: Note[]): Note[] {
    const childrenByParent = new Map<string, Note[]>();
    for (const note of notes) {
        if (note.parentId === null) {
            continue;
        }
        const siblings = childrenByParent.get(note.parentId) ?? [];
        siblings.push(note);
        childrenByParent.set(note.parentId, siblings);
    }

    const result: Note[] = [];
    const stack = [noteId];
    while (stack.length > 0) {
        const currentId = stack.pop();
        if (currentId === undefined) {
            break;
        }
        for (const child of childrenByParent.get(currentId) ?? []) {
            result.push(child);
            stack.push(child.id);
        }
    }
    return result;
}
