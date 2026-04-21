import { File } from "lucide-react";

import { NoteEntity } from "@entities";
import { formatRelativeDate, splitByMatch } from "@utils";

import type { Note } from "@entities";

type PaletteItemProps = {
    note: Note;
    query: string;
    snippet: string | null;
    selected: boolean;
    onMouseEnter: () => void;
    onSelect: () => void;
};

function PaletteItem({ note, query, snippet, selected, onMouseEnter, onSelect }: PaletteItemProps) {
    return (
        <button
            ref={(el) => scrollSelectedIntoView(el, selected)}
            className={`flex w-full items-center gap-3 px-4 py-2 text-left transition-colors ${
                selected ? "bg-accent-surface" : ""
            }`}
            onClick={onSelect}
            onMouseEnter={onMouseEnter}
        >
            <span
                className={`bg-surface flex h-7 w-7 shrink-0 items-center justify-center rounded-sm ${
                    selected ? "text-accent" : "text-subtle"
                }`}
            >
                <File size={13} strokeWidth={1.5} />
            </span>
            <span className="min-w-0 flex-1">
                <span className="text-ui-base text-text block truncate">
                    <Highlighted query={query} text={NoteEntity.getTitle(note)} />
                </span>
                <span className="text-ui-sm text-subtle mt-0.5 block font-mono">
                    {formatRelativeDate(note.updatedAt)}
                </span>
                {snippet && (
                    <span className="text-ui-sm text-subtle mt-0.5 block truncate font-mono">
                        <Highlighted query={query} text={snippet} />
                    </span>
                )}
            </span>
        </button>
    );
}

function Highlighted({ text, query }: { text: string; query: string }) {
    const segments = splitByMatch(text, query);
    return (
        <>
            {segments.map((segment, i) =>
                segment.isMatch ? (
                    <span key={i} className="text-accent font-medium">
                        {segment.text}
                    </span>
                ) : (
                    <span key={i}>{segment.text}</span>
                )
            )}
        </>
    );
}

function scrollSelectedIntoView(el: HTMLButtonElement | null, isSelected: boolean) {
    if (el && isSelected) {
        el.scrollIntoView({ block: "nearest" });
    }
}

export default PaletteItem;
