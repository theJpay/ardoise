import type { Note } from "@entities";

type NoteDTO = {
    id: string;
    content: string;
    title: string;
    createdAt: string;
    updatedAt: string;
};

export async function getNotes(): Promise<Note[]> {
    const localNotes = localStorage.getItem("notes");

    if (!localNotes) {
        return [];
    }

    const rawNotes: NoteDTO[] = JSON.parse(localNotes);
    return rawNotes.map((note) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt)
    }));
}

export async function createNote(
    note: Omit<Note, "id" | "createdAt" | "updatedAt">
): Promise<Note> {
    const newNote: Note = {
        ...note,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date()
    };

    const notes = await getNotes();
    localStorage.setItem("notes", JSON.stringify([...notes, newNote]));

    return newNote;
}

export async function updateNote(
    id: string,
    updatedFields: Partial<Omit<Note, "id" | "createdAt" | "updatedAt">>
): Promise<Note | null> {
    const notes = await getNotes();
    const noteIndex = notes.findIndex((n) => n.id === id);

    if (noteIndex === -1) {
        return null;
    }

    const updatedNote = {
        ...notes[noteIndex],
        ...updatedFields,
        updatedAt: new Date()
    };

    notes[noteIndex] = updatedNote;
    localStorage.setItem("notes", JSON.stringify(notes));

    return updatedNote;
}

export async function deleteNote(id: string): Promise<boolean> {
    const notes = await getNotes();
    const newNotes = notes.filter((n) => n.id !== id);

    const hasNoteBeenDeleted = newNotes.length < notes.length;
    if (!hasNoteBeenDeleted) {
        return false;
    }

    localStorage.setItem("notes", JSON.stringify(newNotes));
    return true;
}
