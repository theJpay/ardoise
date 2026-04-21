import PaletteItem from "./PaletteItem";

import type { Note } from "@entities";
import type { PaletteResult } from "@hooks/usePaletteResults";

type PaletteResultsProps = {
    section: string;
    items: PaletteResult[];
    query: string;
    selectedIndex: number;
    onHover: (index: number) => void;
    onSelect: (note: Note) => void;
};

function PaletteResults({
    section,
    items,
    query,
    selectedIndex,
    onHover,
    onSelect
}: PaletteResultsProps) {
    if (items.length === 0) {
        return query === "" ? (
            <div className="flex-1" />
        ) : (
            <div className="text-ui-sm text-subtle flex-1 py-8 text-center font-mono">
                No matches
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto py-1">
            <div className="text-ui-xs text-dim px-4 pt-2 pb-1 font-mono">{section}</div>
            {items.map((item, index) => (
                <PaletteItem
                    key={item.note.id}
                    note={item.note}
                    query={query}
                    selected={index === selectedIndex}
                    snippet={item.snippet}
                    onMouseEnter={() => onHover(index)}
                    onSelect={() => onSelect(item.note)}
                />
            ))}
        </div>
    );
}

export default PaletteResults;
