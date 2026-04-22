import { ShortcutKey } from "@components/generics";

import type { Shortcut } from "./shortcuts";

function ShortcutRow({ shortcut }: { shortcut: Shortcut }) {
    return (
        <div className="hover:bg-accent-surface flex items-center justify-between px-4 py-1.25 transition-colors duration-fast">
            <span className="text-ui-base text-text font-light">{shortcut.label}</span>
            <div className="flex items-center gap-0.75">
                {shortcut.keys.map((key, i) => (
                    <ShortcutKey key={i} content={key} />
                ))}
            </div>
        </div>
    );
}

export default ShortcutRow;
