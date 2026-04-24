import { useEffect, useState } from "react";

import { EditorEngine } from "@utils/editorEngine";

import type { RefObject } from "react";

export function useEditorEngine(
    textareaRef: RefObject<HTMLTextAreaElement | null>
): EditorEngine | null {
    const [engine, setEngine] = useState<EditorEngine | null>(null);

    useEffect(() => {
        if (!textareaRef.current) {
            return;
        }
        const instance = new EditorEngine(textareaRef.current);
        setEngine(instance);
        return () => {
            instance.dispose();
            setEngine(null);
        };
    }, [textareaRef]);

    return engine;
}
