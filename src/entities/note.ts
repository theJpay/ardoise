export type Note = {
    id: string;
    content: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
    pinnedAt: Date | null;
    archivedAt: Date | null;
    deletedAt: Date | null;
};

export type NoteWrite = Pick<Note, "title" | "content">;

export type NoteUpdate = Partial<NoteWrite>;

const WORDS_PER_MINUTE = 200;

export const NoteEntity = {
    isEmpty: (note: Note) => note.title.trim() === "" && note.content.trim() === "",
    isPinned: (note: Pick<Note, "pinnedAt">) => note.pinnedAt !== null,
    getTitle: (note: Pick<Note, "title">) => note.title.trim() || "Untitled",
    getWordCount: (note: Pick<Note, "content">) =>
        note.content.trim() === "" ? 0 : note.content.trim().split(/\s+/).length,
    getReadTime: (note: Pick<Note, "content">) =>
        Math.max(1, Math.ceil(NoteEntity.getWordCount(note) / WORDS_PER_MINUTE))
};
