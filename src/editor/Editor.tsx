import { useEffect, useMemo, useRef } from "react";

import { tokenize } from "./tokenizer";

import type { EditorHandle } from "./useEditor";
import type { RefObject } from "react";

type EditorProps = {
    editor: EditorHandle;
    value: string;
    onChange: (value: string) => void;
    spellCheck?: boolean;
    placeholder?: string;
};

const SHARED_LAYOUT =
    "text-ed-body w-full resize-none border-none bg-transparent font-mono wrap-anywhere whitespace-pre-wrap outline-none";

export function Editor({ editor, value, onChange, spellCheck, placeholder }: EditorProps) {
    const ref = useRef<HTMLTextAreaElement | null>(null);
    useAutoGrow(ref, value);

    const setRef = (el: HTMLTextAreaElement | null) => {
        ref.current = el;
        editor.attach(el);
    };

    const tokenizedHtml = useMemo(() => tokenize(value), [value]);

    return (
        <div className="relative">
            <div
                aria-hidden="true"
                className={`ardoise-editor ${SHARED_LAYOUT} text-editor-text pointer-events-none absolute inset-0`}
                dangerouslySetInnerHTML={{ __html: tokenizedHtml }}
            />
            <textarea
                ref={setRef}
                aria-label="Note content"
                className={`${SHARED_LAYOUT} placeholder:text-dim caret-accent relative overflow-hidden text-transparent`}
                placeholder={placeholder ?? "Start writing..."}
                spellCheck={spellCheck}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
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
