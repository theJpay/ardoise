import { useEffect, useRef } from "react";

import { DepletionBar } from "@components/generics";
import { useArmedAction } from "@hooks/useArmedAction";
import { useArchivedNotesQuery, useNotesMutations } from "@queries/useNotesQuery";
import { formatRelativeDate } from "@utils";

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

type DeleteRowButtonProps = {
    onConfirm: () => void;
};

function DeleteRowButton({ onConfirm }: DeleteRowButtonProps) {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const { armed, trigger } = useArmedAction({ onConfirm });

    useEffect(() => {
        if (!armed) {
            buttonRef.current?.blur();
        }
    }, [armed]);

    return (
        <button
            ref={buttonRef}
            className={`text-ui-sm border-danger-border text-danger duration-fast relative flex h-7 items-center overflow-hidden rounded border px-2.5 transition-colors ${
                armed
                    ? "bg-danger-surface-hover"
                    : "bg-danger-surface hover:bg-danger-surface-hover"
            }`}
            onClick={trigger}
        >
            {armed ? "Delete?" : "Delete"}
            {armed && <DepletionBar />}
        </button>
    );
}

export default ArchivePage;
