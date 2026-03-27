type MarkdownEditorProps = {
    text: string;
    onChange: (newText: string) => void;
};

function MarkdownEditor({ text, onChange }: MarkdownEditorProps) {
    return (
        <textarea
            placeholder="Start writing..."
            value={text}
            onChange={(e) => onChange(e.target.value)}
            className="w-full flex-1 bg-transparent font-mono font-light text-[13px] leading-[1.8] text-text placeholder:text-subtle outline-none border-none resize-none min-h-[60vh]"
        />
    );
}

export default MarkdownEditor;
