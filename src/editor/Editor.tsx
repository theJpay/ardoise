import { useEffect, useMemo } from "react";

import { tokenize } from "./tokenizer";

import type { EditorHandle } from "./useEditor";

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
    useAutoGrow(editor.textarea, value);

    const tokenizedHtml = useMemo(() => tokenize(value), [value]);

    return (
        <div className="relative">
            <div
                aria-hidden="true"
                className={`ardoise-editor ${SHARED_LAYOUT} text-editor-text pointer-events-none absolute inset-0`}
                dangerouslySetInnerHTML={{ __html: tokenizedHtml }}
            />
            <textarea
                ref={editor.attach}
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

function useAutoGrow(textarea: HTMLTextAreaElement | null, content: string) {
    useEffect(() => {
        if (!textarea) {
            return;
        }
        autoGrow(textarea);
    }, [content, textarea]);
}

function autoGrow(textarea: HTMLTextAreaElement) {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
}
