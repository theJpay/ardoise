import ShortcutRow from "./ShortcutRow";

import type { ShortcutGroup as ShortcutGroupData } from "./shortcuts";

function ShortcutGroup({ group }: { group: ShortcutGroupData }) {
    return (
        <div className="border-border-soft border-b py-1 last:border-b-0">
            <div className="text-ui-xs text-dim px-4 pt-2 pb-1">{group.title}</div>
            {group.shortcuts.map((shortcut) => (
                <ShortcutRow key={shortcut.label} shortcut={shortcut} />
            ))}
        </div>
    );
}

export default ShortcutGroup;
