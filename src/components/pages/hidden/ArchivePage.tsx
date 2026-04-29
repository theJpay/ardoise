import { useArchivedNotesQuery, useNotesMutations } from "@queries/useNotesQuery";
import { formatRelativeDate } from "@utils";

import HiddenNoteRow from "./HiddenNoteRow";
import HiddenNotesPage from "./HiddenNotesPage";

function ArchivePage() {
    const { archivedNotes, isPending } = useArchivedNotesQuery();
    const { restoreFromArchive } = useNotesMutations();

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
                    actions={<RestoreButton onClick={() => restoreFromArchive(note.id)} />}
                    meta={`archived ${formatRelativeDate(note.archivedAt!)}`}
                    note={note}
                />
            ))}
        </HiddenNotesPage>
    );
}

type RestoreButtonProps = {
    onClick: () => void;
};

function RestoreButton({ onClick }: RestoreButtonProps) {
    return (
        <button
            className="text-ui-sm text-muted hover:bg-elevated hover:text-text border-border hover:border-muted duration-fast flex h-7 items-center rounded border px-2.5 transition-colors"
            onClick={onClick}
        >
            Restore
        </button>
    );
}

export default ArchivePage;
