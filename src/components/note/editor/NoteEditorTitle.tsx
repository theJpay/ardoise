type NoteEditorTitleProps = {
    title: string;
    date: Date;
    onChange: (newTitle: string) => void;
};

function NoteEditorTitle({ title, date, onChange }: NoteEditorTitleProps) {
    return (
        <>
            <input
                value={title}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Untitled"
                className="bg-transparent font-mono font-medium text-[20px] leading-tight tracking-[-0.02em] text-text placeholder:text-subtle outline-none border-none w-full"
            />
            <div className="font-mono text-[10px] text-subtle tracking-[0.06em] mb-6">
                {new Intl.DateTimeFormat("en", {
                    dateStyle: "medium",
                    timeStyle: "short"
                }).format(date)}
            </div>
        </>
    );
}

export default NoteEditorTitle;
