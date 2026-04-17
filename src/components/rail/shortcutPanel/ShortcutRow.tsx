import { Badge, ShortcutKey } from "@components/generics";

import type { Shortcut } from "./shortcuts";

function ShortcutRow({ shortcut }: { shortcut: Shortcut }) {
    return (
        <div
            className={`flex items-center justify-between px-4 py-1.25 transition-colors ${
                shortcut.soon ? "" : "hover:bg-accent-surface"
            }`}
        >
            <span
                className={`text-ui-base font-light ${
                    shortcut.soon ? "text-dim" : "text-text"
                }`}
            >
                {shortcut.label}
                {shortcut.soon && <Badge label="soon" />}
            </span>
            <div className="flex items-center gap-0.75">
                {shortcut.keys.map((key, i) => (
                    <ShortcutKey
                        key={i}
                        content={key}
                        variant={shortcut.soon ? "soon" : "surface"}
                    />
                ))}
            </div>
        </div>
    );
}

export default ShortcutRow;
