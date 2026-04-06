import { useEffect, useRef } from "react";

import { tokenize } from "./utils";

import type { RefObject } from "react";

type NoteEditorProps = {
    content: string;
    phantomRef: RefObject<HTMLDivElement | null>;
    ref: RefObject<HTMLTextAreaElement | null>;
    onChange: (newContent: string) => void;
    onCursorChange: (e: React.SyntheticEvent<HTMLTextAreaElement>) => void;
};

/**
 * Textareas don't auto-grow by default. This hook resets the height to `auto`
 * (collapsing to intrinsic size) then sets it to `scrollHeight` (the full
 * content height). This prevents internal scrolling so the parent container
 * handles scrolling — keeping the textarea and mirror div aligned.
 */
function useAutoGrow(ref: RefObject<HTMLTextAreaElement | null>, content: string) {
    useEffect(() => {
        if (ref.current) {
            ref.current.style.height = "auto";
            ref.current.style.height = `${ref.current.scrollHeight}px`;
        }
    }, [content, ref]);
}

function NoteEditor({ content, phantomRef, ref, onChange, onCursorChange }: NoteEditorProps) {
    const mirrorRef = useRef<HTMLDivElement | null>(null);
    const className =
        "text-ed-body text-editor-text placeholder:text-dim w-full resize-none border-none bg-transparent font-mono font-normal whitespace-pre-wrap outline-none";

    useAutoGrow(ref, content);

    return (
        <div className="relative w-full">
            <div
                ref={mirrorRef}
                aria-hidden="true"
                className={`ardoise-editor ${className} pointer-events-none absolute inset-0`}
                dangerouslySetInnerHTML={{ __html: tokenize(content) }}
            ></div>
            <div
                ref={phantomRef}
                aria-hidden="true"
                className={`${className} pointer-events-none invisible absolute inset-0`}
            />
            <textarea
                ref={ref}
                className={`${className} caret-accent relative overflow-hidden text-transparent`}
                placeholder="Start writing..."
                value={content}
                onChange={(e) => onChange(e.target.value)}
                onClick={onCursorChange}
                onSelect={onCursorChange}
            />
        </div>
    );
}

export default NoteEditor;
