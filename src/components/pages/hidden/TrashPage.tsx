import { useNotesMutations, useTrashedNotesQuery } from "@queries/useNotesQuery";
import { formatRelativeDate } from "@utils";

import DeleteRowButton from "./DeleteRowButton";
import HiddenNoteRow from "./HiddenNoteRow";
import HiddenNotesPage from "./HiddenNotesPage";
import RestoreButton from "./RestoreButton";

const TRASH_RETENTION_DAYS = 30;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

function TrashPage() {
    const { trashedNotes, isPending } = useTrashedNotesQuery();
    const { restoreFromTrash, hardDeleteNote } = useNotesMutations();

    return (
        <HiddenNotesPage
            emptyMessage="Trash is empty."
            isEmpty={trashedNotes.length === 0}
            isPending={isPending}
            subtitle="Notes are permanently deleted after 30 days."
            title="Trash"
        >
            {trashedNotes.map((note) => (
                <HiddenNoteRow
                    key={note.id}
                    actions={
                        <>
                            <RestoreButton onClick={() => restoreFromTrash(note.id)} />
                            <DeleteRowButton onConfirm={() => hardDeleteNote(note.id)} />
                        </>
                    }
                    meta={trashRowMeta(note.deletedAt!)}
                    note={note}
                />
            ))}
        </HiddenNotesPage>
    );
}

function trashRowMeta(deletedAt: Date): string {
    const remaining = remainingDays(deletedAt);
    return `deleted ${formatRelativeDate(deletedAt)} · ${removalLabel(remaining)}`;
}

function remainingDays(deletedAt: Date): number {
    const expiry = deletedAt.getTime() + TRASH_RETENTION_DAYS * MS_PER_DAY;
    const diffMs = expiry - Date.now();
    return Math.max(0, Math.ceil(diffMs / MS_PER_DAY));
}

function removalLabel(days: number): string {
    if (days === 0) {
        return "removed today";
    }
    if (days === 1) {
        return "removed in 1 day";
    }
    return `removed in ${days} days`;
}

export default TrashPage;
