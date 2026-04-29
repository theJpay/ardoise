import { useArchivedNotesQuery, useNotesMutations } from "@queries/useNotesQuery";
import { formatRelativeDate } from "@utils";

import DeleteRowButton from "./DeleteRowButton";
import HiddenNoteRow from "./HiddenNoteRow";
import HiddenNotesPage from "./HiddenNotesPage";
import RestoreButton from "./RestoreButton";

function ArchivePage() {
    const { archivedNotes, isPending } = useArchivedNotesQuery();
    const { restoreFromArchive, deleteNote } = useNotesMutations();

    return (
        <HiddenNotesPage
            emptyMessage="No archived notes."
            isEmpty={archivedNotes.length === 0}
            isPending={isPending}
            title="Archive"
        >
            {archivedNotes.map((note) => (
                <HiddenNoteRow
                    key={note.id}
                    actions={
                        <>
                            <RestoreButton onClick={() => restoreFromArchive(note.id)} />
                            <DeleteRowButton onConfirm={() => deleteNote(note.id)} />
                        </>
                    }
                    meta={`archived ${formatRelativeDate(note.archivedAt!)}`}
                    note={note}
                />
            ))}
        </HiddenNotesPage>
    );
}

export default ArchivePage;
