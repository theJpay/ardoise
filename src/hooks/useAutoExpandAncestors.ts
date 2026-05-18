import { useEffect } from "react";
import { useParams } from "react-router";

import { useTreeExpansionActions } from "@stores/treeExpansion.store";
import { ancestorsOf } from "@utils/noteTree";

import type { Note } from "@entities";

export function useAutoExpandAncestors(notes: Note[]) {
    const { noteId } = useParams();
    const { expand } = useTreeExpansionActions();

    useEffect(() => {
        if (!noteId) {
            return;
        }
        const ids = ancestorsOf(noteId, notes).map((a) => a.id);
        if (ids.length > 0) {
            expand(ids);
        }
    }, [noteId, notes, expand]);
}
