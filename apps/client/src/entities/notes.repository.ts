import type { Note } from "./note";

export interface NotesRepository {
    findVisible(): Promise<Note[]>;
    findArchived(): Promise<Note[]>;
    findTrashed(): Promise<Note[]>;
    findById(id: string): Promise<Note | undefined>;
    findByIds(ids: string[]): Promise<Note[]>;
    findChildrenOf(parentIds: string[]): Promise<Note[]>;

    add(note: Note): Promise<void>;
    update(id: string, patch: Partial<Note>): Promise<boolean>;
    modifyMany(ids: string[], patch: Partial<Note>): Promise<void>;
    delete(id: string): Promise<void>;
    deleteTrashedBefore(cutoff: Date): Promise<number>;
    deleteAll(): Promise<void>;

    transaction<T>(fn: () => Promise<T>): Promise<T>;
}
