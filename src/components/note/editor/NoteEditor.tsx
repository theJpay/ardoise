import type { RefObject } from "react";

type NoteEditorProps = {
    content: string;
    onChange: (newContent: string) => void;
    ref: RefObject<HTMLTextAreaElement | null>;
    onCursorChange: (e: React.SyntheticEvent<HTMLTextAreaElement>) => void;
};

function NoteEditor({ content, onChange, onCursorChange, ref }: NoteEditorProps) {
    return (
        <textarea
            ref={ref}
            className="text-ed-body text-editor-text placeholder:text-dim min-h-[60vh] w-full flex-1 resize-none border-none bg-transparent font-mono font-normal outline-none"
            placeholder="Start writing..."
            value={content}
            onChange={(e) => onChange(e.target.value)}
            onSelect={onCursorChange}
        />
    );
}

export default NoteEditor;
