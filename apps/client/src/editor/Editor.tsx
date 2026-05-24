import { useEffect, useMemo } from "react";

import { FloatingToolbar } from "./floating/FloatingToolbar";
import { SlashMenu } from "./floating/SlashMenu";
import { useSlashMenu } from "./floating/useSlashMenu";
import { handleFormattingShortcut } from "./keyboard/handleFormattingShortcut";
import { handleSmartKeys } from "./keyboard/handleSmartKeys";
import { handleSmartPair } from "./keyboard/handleSmartPair";
import { autoGrow } from "./scroll";
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
    const { engine } = editor;

    // Textarea is uncontrolled to avoid React re-applying `value` mid-keystroke,
    // which races with `input` and drops characters in Chrome. Sync DOM ← state
    // only when the prop diverges (note switch, undo, programmatic reset).
    useEffect(() => {
        engine?.loadValue(value);
    }, [engine, value]);

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
                defaultValue={value}
                placeholder={placeholder ?? "Start writing..."}
                spellCheck={spellCheck}
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
                    if (handleSmartPair(e, editor)) {
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
    useEffect(() => {
        if (!textarea) {
            return;
        }
        autoGrow(textarea);
    }, [content, textarea]);
}
