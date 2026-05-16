import { MAX_DEPTH } from "@entities";

import { sortNotes } from "./sortNotes";

import type { SortOrder } from "./sortNotes";
import type { Note } from "@entities";

export type MoveBlocker = "self" | "descendant" | "depth";

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

export function subtreeDepthOf(noteId: string, notes: Note[]): number {
    const children = childrenByParent(notes);

    function dive(id: string): number {
        const direct = children.get(id) ?? [];
        if (direct.length === 0) {
            return 0;
        }
        return 1 + Math.max(...direct.map((c) => dive(c.id)));
    }

    return dive(noteId);
}

export function moveBlocker(
    noteId: string,
    targetParentId: string | null,
    notes: Note[]
): MoveBlocker | null {
    if (targetParentId === null) {
        return null;
    }
    if (targetParentId === noteId) {
        return "self";
    }
    const subtreeIds = new Set(descendantsOf(noteId, notes).map((n) => n.id));
    if (subtreeIds.has(targetParentId)) {
        return "descendant";
    }
    const targetDepth = depthOf(targetParentId, notes);
    const subtreeDepth = subtreeDepthOf(noteId, notes);
    if (targetDepth + 1 + subtreeDepth > MAX_DEPTH) {
        return "depth";
    }
    return null;
}

export function descendantsOf(noteId: string, notes: Note[]): Note[] {
    const children = childrenByParent(notes);

    const result: Note[] = [];
    const stack = [noteId];
    while (stack.length > 0) {
        const currentId = stack.pop();
        if (currentId === undefined) {
            break;
        }
        for (const child of children.get(currentId) ?? []) {
            result.push(child);
            stack.push(child.id);
        }
    }
    return result;
}

function childrenByParent(notes: Note[]): Map<string, Note[]> {
    const map = new Map<string, Note[]>();
    for (const note of notes) {
        if (note.parentId === null) {
            continue;
        }
        const siblings = map.get(note.parentId) ?? [];
        siblings.push(note);
        map.set(note.parentId, siblings);
    }
    return map;
}
