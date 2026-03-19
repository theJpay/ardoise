function NoteList() {
    const noteList = [
        { id: "1", title: "Getting started with Ardoise" },
        { id: "2", title: "React hooks cheatsheet" },
        { id: "3", title: "Meeting notes — 18 March" },
        { id: "4", title: "Book recommendations" },
        { id: "5", title: "Idées de voyages" }
    ];
    const isEmpty = noteList.length === 0;

    return isEmpty ? (
        <div className="flex flex-col items-center justify-center h-full gap-3">
            <p className="text-text-muted text-sm">No notes yet</p>
        </div>
    ) : (
        <ul className="flex flex-col gap-0.5 p-2">
            {noteList.map((note) => (
                <li
                    key={note.id}
                    className="px-3 py-2.5 rounded-md cursor-pointer text-text-secondary hover:bg-surface-overlay hover:text-text-primary transition-colors duration-150 text-sm"
                >
                    {note.title}
                </li>
            ))}
        </ul>
    );
}

export default NoteList;
