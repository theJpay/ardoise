type NoteEditorProps = {
    content: string;
    onChange: (newContent: string) => void;
};

function NoteEditor({ content, onChange }: NoteEditorProps) {
    return (
        <textarea
            placeholder="Start writing..."
            value={content}
            onChange={(e) => onChange(e.target.value)}
            className="text-ed-body text-editor-text placeholder:text-dim min-h-[60vh] w-full flex-1 resize-none border-none bg-transparent font-mono font-normal outline-none"
        />
    );
}

export default NoteEditor;
