import type { EditorMode } from "@stores/editor.store";

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
                        className="text-editor-text placeholder:text-dim w-full border-none bg-transparent font-mono font-medium outline-none"
                        placeholder="Untitled"
                        value={title}
                        onChange={(e) => onChange(e.target.value)}
                    />
                </div>
            ) : (
                <h1 className="text-text w-full font-sans text-[24px] leading-tight font-medium tracking-[-0.03em]">
                    {title || "Untitled"}
                </h1>
            )}
            <div className="text-subtle mb-7 font-mono text-[11px] tracking-[0.04em]">
                {new Intl.DateTimeFormat("en", {
                    dateStyle: "medium",
                    timeStyle: "short"
                }).format(date)}
            </div>
        </>
    );
}

export default NoteTitle;
