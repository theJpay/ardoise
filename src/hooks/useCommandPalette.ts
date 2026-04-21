import { useCallback, useEffect, useState } from "react";

export function useCommandPalette() {
    const [isOpen, setIsOpen] = useState(false);

    const close = useCallback(() => setIsOpen(false), []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (isPaletteShortcut(event)) {
                event.preventDefault();
                event.stopPropagation();
                setIsOpen((prev) => !prev);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    useEffect(() => {
        if (!isOpen) {
            return;
        }
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.preventDefault();
                event.stopPropagation();
                setIsOpen(false);
            }
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [isOpen]);

    return { isOpen, close };
}

function isPaletteShortcut(e: KeyboardEvent) {
    const meta = e.metaKey || e.ctrlKey;
    return meta && e.shiftKey && !e.altKey && e.key.toLowerCase() === "k";
}
