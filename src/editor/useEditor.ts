import { useState } from "react";

export type EditorHandle = {
    attach: (el: HTMLTextAreaElement | null) => void;
    textarea: HTMLTextAreaElement | null;
};

export function useEditor(): EditorHandle {
    const [textarea, setTextarea] = useState<HTMLTextAreaElement | null>(null);
    return { attach: setTextarea, textarea };
}
