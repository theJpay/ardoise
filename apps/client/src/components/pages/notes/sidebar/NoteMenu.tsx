import { useState } from "react";

import { ShareMenu } from "@components/share";

import ContextMenu from "./ContextMenu";

import type { Note } from "@entities";
import type { Anchor } from "@hooks/useFloatingMenu";

type NoteMenuProps = {
    note: Note;
    anchor: Anchor;
    onClose: () => void;
    onMoveTo: (note: Note) => void;
};

function NoteMenu({ note, anchor, onClose, onMoveTo }: NoteMenuProps) {
    const [view, setView] = useState<"context" | "share">("context");

    if (view === "share") {
        return (
            <ShareMenu
                anchor={anchor}
                note={note}
                open={true}
                placement="bottom-start"
                onClose={onClose}
            />
        );
    }

    return (
        <ContextMenu
            anchor={anchor}
            note={note}
            onClose={onClose}
            onMoveTo={onMoveTo}
            onShare={() => setView("share")}
        />
    );
}

export default NoteMenu;
