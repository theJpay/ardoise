import { useEffect, useMemo, useRef } from "react";

import { FloatingToolbar } from "./floating/FloatingToolbar";
import { SlashMenu } from "./floating/SlashMenu";
import { useSlashMenu } from "./floating/useSlashMenu";
import { handleFormattingShortcut } from "./keyboard/handleFormattingShortcut";
import { handleSmartKeys } from "./keyboard/handleSmartKeys";
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
    const slash = useSlashMenu({ editor, content: value });

    return (
        <div className="relative">
            <div
                aria-hidden="true"
                className={`ardoise-editor ${SHARED_LAYOUT} text-editor-text pointer-events-none absolute inset-0`}
                dangerouslySetInnerHTML={{ __html: tokenizedHtml }}
            />
            <textarea
                ref={editor.attach}
                aria-label="Text editor"
                className={`${SHARED_LAYOUT} placeholder:text-dim caret-accent relative overflow-hidden text-transparent`}
                placeholder={placeholder ?? "Start writing..."}
                spellCheck={spellCheck}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => {
                    if (handleFormattingShortcut(e, editor.run)) {
                        return;
                    }
                    if (slash.handleKeyDown(e)) {
                        return;
                    }
                    if (handleSmartKeys(e, editor)) {
                        return;
                    }
                }}
            />
            <FloatingToolbar editor={editor} />
            <SlashMenu editor={editor} slash={slash} />
        </div>
    );
}

function useAutoGrow(textarea: HTMLTextAreaElement | null, content: string) {
    const scrollerRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (!textarea) {
            return;
        }
        if (!scrollerRef.current || !scrollerRef.current.contains(textarea)) {
            scrollerRef.current = findScrollableAncestor(textarea);
        }
        autoGrow(textarea, scrollerRef.current);
    }, [content, textarea]);
}

function autoGrow(textarea: HTMLTextAreaElement, scroller: HTMLElement | null) {
    const savedScrollTop = scroller?.scrollTop ?? 0;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
    if (scroller && scroller.scrollTop !== savedScrollTop) {
        scroller.scrollTop = savedScrollTop;
    }
}

function findScrollableAncestor(el: HTMLElement): HTMLElement | null {
    let node = el.parentElement;
    while (node) {
        const { overflowY } = getComputedStyle(node);
        if (overflowY === "auto" || overflowY === "scroll") {
            return node;
        }
        node = node.parentElement;
    }
    return null;
}
