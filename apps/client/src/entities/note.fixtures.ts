import type { Note } from "./note";

export function generateNote(overrides: Partial<Note> = {}): Note {
    const date = new Date(2026, 0, 1);
    return {
        id: "id",
        title: "",
        content: "",
        createdAt: date,
        updatedAt: date,
        lastActivityAt: date,
        parentId: null,
        pinnedAt: null,
        archivedAt: null,
        deletedAt: null,
        ...overrides
    };
}
