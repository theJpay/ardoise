import { useEffect, useState } from "react";

import { NoteEntity } from "@entities";
import { formatRelativeDate } from "@utils";

import type { EditorMode } from "@hooks/useEditorMode";
import type { RefObject } from "react";

const RELATIVE_DATE_REFRESH_MS = 60_000;
const exactDateFormat = new Intl.DateTimeFormat("en", { dateStyle: "full", timeStyle: "short" });

type NoteTitleProps = {
    title: string;
    date: Date;
    mode: EditorMode;
    inputRef?: RefObject<HTMLInputElement | null>;
    onChange: (newTitle: string) => void;
};

function NoteTitle({ title, date, mode, inputRef, onChange }: NoteTitleProps) {
    const relativeDate = useRelativeDate(date);

    return (
        <>
            {mode === "edit" ? (
                <div className="text-ed-body flex items-baseline font-mono">
                    <span className="text-dim font-medium">#&nbsp;</span>
                    <input
                        ref={inputRef}
                        aria-label="Note title"
                        className="text-editor-text placeholder:text-dim w-full border-none bg-transparent font-mono font-medium outline-none"
                        placeholder="Untitled"
                        value={title}
                        onChange={(e) => onChange(e.target.value)}
                    />
                </div>
            ) : (
                <div className="ardoise-preview">
                    <h1>{NoteEntity.getTitle({ title })}</h1>
                </div>
            )}
            <div
                className="text-ui-sm text-subtle mb-7 font-mono"
                title={exactDateFormat.format(date)}
            >
                {relativeDate}
            </div>
        </>
    );
}

function useRelativeDate(date: Date): string {
    const [, tick] = useState(0);

    useEffect(() => {
        const id = setInterval(() => tick((n) => n + 1), RELATIVE_DATE_REFRESH_MS);
        return () => clearInterval(id);
    }, []);

    return formatRelativeDate(date);
}

export default NoteTitle;
