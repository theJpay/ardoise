import { useEffect, useLayoutEffect, useState } from "react";

import { EditorEngine } from "@utils/editorEngine";

import type { RefObject } from "react";

export function useEditorEngine(
    textareaRef: RefObject<HTMLTextAreaElement | null>
): EditorEngine | null {
    const [textarea, setTextarea] = useState<HTMLTextAreaElement | null>(null);
    const [engine, setEngine] = useState<EditorEngine | null>(null);

    useLayoutEffect(() => {
        if (textareaRef.current !== textarea) {
            setTextarea(textareaRef.current);
        }
    }, [textareaRef, textarea]);

    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
        if (!textarea) {
            return;
        }
        const instance = new EditorEngine(textarea);
        setEngine(instance);
        return () => {
            instance.dispose();
            setEngine(null);
        };
    }, [textarea]);
    /* eslint-enable react-hooks/set-state-in-effect */

    return engine;
}
