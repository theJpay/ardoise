import { ArrowDown, ArrowUp, CornerDownLeft } from "lucide-react";

import { ShortcutKey } from "@components/generics";

function PaletteFooter() {
    return (
        <div className="border-border-soft text-ui-sm text-subtle flex h-8 shrink-0 items-center gap-3 border-t px-4 font-mono">
            <div className="flex items-center gap-1">
                <ShortcutKey content={ArrowUp} />
                <ShortcutKey content={ArrowDown} />
                <span>navigate</span>
            </div>
            <div className="flex items-center gap-1">
                <ShortcutKey content={CornerDownLeft} />
                <span>open</span>
            </div>
            <div className="flex items-center gap-1">
                <ShortcutKey content="esc" />
                <span>close</span>
            </div>
        </div>
    );
}

export default PaletteFooter;
