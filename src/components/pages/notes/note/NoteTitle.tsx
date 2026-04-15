import { NoteEntity } from "@entities";

import type { EditorMode } from "@hooks/useEditorMode";

type NoteTitleProps = {
    title: string;
    date: Date;
    mode: EditorMode;
    onChange: (newTitle: string) => void;
};

function NoteTitle({ title, date, mode, onChange }: NoteTitleProps) {
    return (
        <>
            {mode === "edit" ? (
                <div className="text-ed-body flex items-baseline font-mono">
                    <span className="text-dim font-medium">#&nbsp;</span>
                    <input
                        aria-label="Note title"
                        autoFocus={!title}
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
            <div className="text-ui-sm text-subtle mb-7 font-mono">
                {new Intl.DateTimeFormat("en", {
                    dateStyle: "medium",
                    timeStyle: "short"
                }).format(date)}
            </div>
        </>
    );
}

export default NoteTitle;
