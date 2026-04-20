import { useEffect, useMemo, useRef } from "react";

import { tokenize } from "./utils";

import type { RefObject } from "react";

type NoteEditorProps = {
    content: string;
    phantomRef: RefObject<HTMLDivElement | null>;
    ref: RefObject<HTMLTextAreaElement | null>;
    spellCheck: boolean;
    onChange: (newContent: string) => void;
    onBlur?: () => void;
    onFocus?: () => void;
    onCursorChange: (e: React.SyntheticEvent<HTMLTextAreaElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
};

function NoteEditor({
    content,
    phantomRef,
    ref,
    spellCheck,
    onBlur,
    onFocus,
    onChange,
    onCursorChange,
    onKeyDown
}: NoteEditorProps) {
    const mirrorRef = useRef<HTMLDivElement | null>(null);
    const className =
        "text-ed-body text-editor-text placeholder:text-dim w-full resize-none border-none bg-transparent font-mono font-normal whitespace-pre-wrap outline-none";

    useAutoGrow(ref, content);
    const tokenizedHtml = useMemo(() => tokenize(content), [content]);

    return (
        <div className="w-full">
            <div className="relative">
                <div
                    ref={mirrorRef}
                    aria-hidden="true"
                    className={`ardoise-editor ${className} pointer-events-none absolute inset-0`}
                    dangerouslySetInnerHTML={{ __html: tokenizedHtml }}
                ></div>
                <div
                    ref={phantomRef}
                    aria-hidden="true"
                    className={`${className} pointer-events-none invisible absolute inset-0`}
                />
                <textarea
                    ref={ref}
                    aria-label="Note content"
                    className={`${className} caret-accent relative overflow-hidden text-transparent`}
                    placeholder="Start writing..."
                    spellCheck={spellCheck}
                    value={content}
                    onBlur={onBlur}
                    onChange={(e) => onChange(e.target.value)}
                    onClick={onCursorChange}
                    onFocus={onFocus}
                    onKeyDown={onKeyDown}
                    onSelect={onCursorChange}
                />
            </div>
            {content.length === 0 && (
                <div className="text-ed-body text-subtle font-mono">
                    Type <span className="text-accent">/</span> to insert headings, code blocks, and
                    more
                </div>
            )}
        </div>
    );
}

/**
 * Textareas don't auto-grow by default. This hook resets the height to `auto`
 * (collapsing to intrinsic size) then sets it to `scrollHeight` (the full
 * content height). This prevents internal scrolling so the parent container
 * handles scrolling — keeping the textarea and mirror div aligned.
 *
 * The transient `height: auto` causes the scroll ancestor to reflow with a
 * smaller content height, which can clamp its scrollTop. We snapshot and
 * restore scrollTop around the reflow to keep the caret anchored.
 */
function useAutoGrow(ref: RefObject<HTMLTextAreaElement | null>, content: string) {
    const scrollerRef = useRef<{ el: HTMLElement; scroller: HTMLElement | null } | null>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) {
            return;
        }

        if (!scrollerRef.current || scrollerRef.current.el !== el) {
            scrollerRef.current = { el, scroller: findScrollableAncestor(el) };
        }
        const { scroller } = scrollerRef.current;
        const savedScrollTop = scroller?.scrollTop ?? 0;

        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;

        if (scroller && scroller.scrollTop !== savedScrollTop) {
            scroller.scrollTop = savedScrollTop;
        }
    }, [content, ref]);
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

export default NoteEditor;
