import { useArchivedNotesQuery } from "@queries/useNotesQuery";

import HiddenNotesPage from "./HiddenNotesPage";

function ArchivePage() {
    const { archivedNotes, isPending } = useArchivedNotesQuery();

    return (
        <HiddenNotesPage
            emptyMessage="No archived notes."
            isEmpty={archivedNotes.length === 0}
            isPending={isPending}
            title="Archive"
        />
    );
}

export default ArchivePage;
