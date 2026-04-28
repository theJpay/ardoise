import { useState } from "react";

import { ShareMenu } from "@components/share";

import ContextMenu from "./ContextMenu";

import type { Note } from "@entities";

type NoteMenuProps = {
    note: Note;
    position: { x: number; y: number };
    onClose: () => void;
};

function NoteMenu({ note, position, onClose }: NoteMenuProps) {
    const [view, setView] = useState<"context" | "share">("context");

    if (view === "share") {
        return (
            <ShareMenu
                anchor={{ type: "coordinates", x: position.x, y: position.y }}
                note={note}
                open={true}
                placement="bottom-start"
                onClose={onClose}
            />
        );
    }

    return (
        <ContextMenu
            note={note}
            position={position}
            onClose={onClose}
            onShare={() => setView("share")}
        />
    );
}

export default NoteMenu;
