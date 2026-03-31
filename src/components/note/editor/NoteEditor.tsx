import { type RefObject, useRef } from "react";

import { tokenize } from "./utils";

type NoteEditorProps = {
    content: string;
    onChange: (newContent: string) => void;
    ref: RefObject<HTMLTextAreaElement | null>;
    onCursorChange: (e: React.SyntheticEvent<HTMLTextAreaElement>) => void;
};

function NoteEditor({ content, onChange, onCursorChange, ref }: NoteEditorProps) {
    const mirrorRef = useRef<HTMLDivElement | null>(null);
    const className =
        "text-ed-body text-editor-text placeholder:text-dim min-h-[60vh] w-full flex-1 resize-none border-none bg-transparent font-mono font-normal whitespace-pre-wrap outline-none";

    const handleScroll = () => {
        if (ref.current && mirrorRef.current) {
            mirrorRef.current.scrollTop = ref.current.scrollTop;
        }
    };

    return (
        <div className="relative w-full">
            <div
                ref={mirrorRef}
                aria-hidden="true"
                className={`ardoise-editor ${className} pointer-events-none absolute inset-0 overflow-hidden`}
                dangerouslySetInnerHTML={{ __html: tokenize(content) }}
            ></div>
            <textarea
                ref={ref}
                className={`${className} caret-accent relative text-transparent`}
                placeholder="Start writing..."
                value={content}
                onChange={(e) => onChange(e.target.value)}
                onScroll={handleScroll}
                onSelect={onCursorChange}
            />
        </div>
    );
}

export default NoteEditor;
