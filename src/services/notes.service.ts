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
        const seedNotes = generateFakeNotes(5);
        localStorage.setItem("notes", JSON.stringify(seedNotes));
        return seedNotes;
    }

    const rawNotes: NoteDTO[] = JSON.parse(localNotes);
    return rawNotes.map((note) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt)
    }));
}

export async function getNoteById(id: string): Promise<Note | null> {
    const notes = await getNotes();
    const note = notes.find((n) => n.id === id);
    return note ?? null;
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
    updatedFields: Partial<Omit<Note, "id" | "createdAt">>
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

function generateFakeNotes(count: number): Note[] {
    const notes: Note[] = [];
    for (let i = 0; i < count; i++) {
        notes.push({
            id: crypto.randomUUID(),
            title: `Note ${i + 1}`,
            content: `This is the content of note ${i + 1}.`,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }
    return notes;
}
