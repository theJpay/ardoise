import PaletteItem from "./PaletteItem";

import type { Note } from "@entities";

type PaletteResultsProps = {
    notes: Note[];
    selectedIndex: number;
    onHover: (index: number) => void;
    onSelect: (note: Note) => void;
};

function PaletteResults({ notes, selectedIndex, onHover, onSelect }: PaletteResultsProps) {
    return (
        <div className="flex-1 overflow-y-auto py-1">
            <div className="text-ui-xs text-dim px-4 pt-2 pb-1 font-mono">Recent</div>
            {notes.map((note, index) => (
                <PaletteItem
                    key={note.id}
                    note={note}
                    selected={index === selectedIndex}
                    onMouseEnter={() => onHover(index)}
                    onSelect={() => onSelect(note)}
                />
            ))}
        </div>
    );
}

export default PaletteResults;
