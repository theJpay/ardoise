import { useEffect, useState } from "react";

import { renderNote } from "./renderNote";

import type { Note } from "@entities";

function NoteViewer({ note }: { note: Note }) {
    const [htmlNote, setHtmlNote] = useState("");

    useEffect(() => {
        renderNote(note).then(setHtmlNote);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [note.id, note.title, note.content]);

    return (
        <div className="flex-1 overflow-y-auto flex justify-center px-6 py-12">
            <div
                className="ardoise-preview w-full max-w-[72ch]"
                dangerouslySetInnerHTML={{ __html: htmlNote }}
            />
        </div>
    );
}

export default NoteViewer;
