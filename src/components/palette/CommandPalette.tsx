import { FloatingPortal } from "@floating-ui/react";
import { useRef } from "react";

import { useClickOutside } from "@hooks/useClickOutside";
import { useCommandPalette } from "@hooks/useCommandPalette";

import PaletteFooter from "./PaletteFooter";
import PaletteInput from "./PaletteInput";
import PaletteResults from "./PaletteResults";

function CommandPalette() {
    const { isOpen, close, query, setQuery, results, selectedIndex, setSelectedIndex, openNote } =
        useCommandPalette();
    const paletteRef = useRef<HTMLDivElement>(null);

    useClickOutside(paletteRef, close, { enabled: isOpen });

    if (!isOpen) {
        return null;
    }

    return (
        <FloatingPortal>
            <div
                ref={paletteRef}
                className="bg-elevated border-border shadow-float fixed top-[15vh] left-1/2 z-50 flex max-h-120 w-130 -translate-x-1/2 flex-col overflow-hidden rounded-md border"
            >
                <PaletteInput value={query} onChange={setQuery} />
                <PaletteResults
                    notes={results.notes}
                    query={query}
                    section={results.section}
                    selectedIndex={selectedIndex}
                    onHover={setSelectedIndex}
                    onSelect={openNote}
                />
                <PaletteFooter />
            </div>
        </FloatingPortal>
    );
}

export default CommandPalette;
