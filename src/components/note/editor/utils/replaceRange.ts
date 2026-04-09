const USE_NATIVE_UNDO = true;

type ReplaceRangeOptions = {
    start: number;
    end: number;
    text: string;
    onChange: (value: string) => void;
    cursor?: { start: number; end?: number };
};

/**
 * Replaces a range of text in the textarea. When USE_NATIVE_UNDO is true,
 * uses execCommand('insertText') which preserves the browser's native undo
 * stack (⌘Z works). The textarea's onChange event fires automatically.
 * When false, falls back to building the string and calling onChange directly.
 *
 * Cursor placement is handled internally: synchronous with execCommand,
 * deferred with the fallback path (React needs to re-render first).
 */
export function replaceRange(textarea: HTMLTextAreaElement, options: ReplaceRangeOptions) {
    const { start, end, text, onChange, cursor } = options;

    if (USE_NATIVE_UNDO) {
        textarea.focus();
        textarea.setSelectionRange(start, end);
        document.execCommand("insertText", false, text);
        if (cursor) {
            textarea.setSelectionRange(cursor.start, cursor.end ?? cursor.start);
        }
    } else {
        const value = textarea.value;
        onChange(value.slice(0, start) + text + value.slice(end));
        if (cursor) {
            requestAnimationFrame(() => {
                textarea.focus();
                textarea.setSelectionRange(cursor.start, cursor.end ?? cursor.start);
            });
        }
    }
}
