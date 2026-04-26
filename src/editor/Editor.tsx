import { useEffect, useRef } from "react";

import type { EditorHandle } from "./useEditor";
import type { RefObject } from "react";

type EditorProps = {
    editor: EditorHandle;
    value: string;
    onChange: (value: string) => void;
    spellCheck?: boolean;
    placeholder?: string;
};

export function Editor({ editor, value, onChange, spellCheck, placeholder }: EditorProps) {
    const ref = useRef<HTMLTextAreaElement | null>(null);
    useAutoGrow(ref, value);

    const setRef = (el: HTMLTextAreaElement | null) => {
        ref.current = el;
        editor.attach(el);
    };

    return (
        <textarea
            ref={setRef}
            aria-label="Note content"
            className="text-ed-body text-editor-text placeholder:text-dim caret-accent w-full resize-none border-none bg-transparent font-mono wrap-anywhere whitespace-pre-wrap outline-none"
            placeholder={placeholder ?? "Start writing..."}
            spellCheck={spellCheck}
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    );
}

function useAutoGrow(ref: RefObject<HTMLTextAreaElement | null>, content: string) {
    useEffect(() => {
        const el = ref.current;
        if (!el) {
            return;
        }
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
    }, [content, ref]);
}
