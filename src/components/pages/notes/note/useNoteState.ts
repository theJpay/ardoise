import { useNoteData } from "./useNoteData";
import { useNoteInteractions } from "./useNoteInteractions";

import type { EditorMode } from "@hooks/useEditorMode";

export type { SaveStatus } from "./useNoteData";

export function useNoteState(noteId: string | undefined, mode: EditorMode) {
    const data = useNoteData(noteId);
    const interactions = useNoteInteractions({ selectedNote: data.selectedNote, mode });

    return { ...data, ...interactions };
}
