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
                className="bg-transparent font-mono font-medium text-ed-h1 text-text placeholder:text-subtle outline-none border-none w-full"
            />
            <div className="font-mono text-ed-meta text-subtle mb-6">
                {new Intl.DateTimeFormat("en", {
                    dateStyle: "medium",
                    timeStyle: "short"
                }).format(date)}
            </div>
        </>
    );
}

export default NoteEditorTitle;
