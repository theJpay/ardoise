import PaletteItem from "./PaletteItem";

import type { Note } from "@entities";

type PaletteResultsProps = {
    section: string;
    notes: Note[];
    query: string;
    selectedIndex: number;
    onHover: (index: number) => void;
    onSelect: (note: Note) => void;
};

function PaletteResults({
    section,
    notes,
    query,
    selectedIndex,
    onHover,
    onSelect
}: PaletteResultsProps) {
    if (notes.length === 0) {
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
            {notes.map((note, index) => (
                <PaletteItem
                    key={note.id}
                    note={note}
                    query={query}
                    selected={index === selectedIndex}
                    onMouseEnter={() => onHover(index)}
                    onSelect={() => onSelect(note)}
                />
            ))}
        </div>
    );
}

export default PaletteResults;
