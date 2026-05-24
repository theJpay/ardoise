import { ChevronRight, File, Home, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Button, Modal } from "@components/generics";
import { NoteEntity } from "@entities";
import { moveNote } from "@services/notes.service";
import { useNotes } from "@stores/notes.store";
import { useSortOrder } from "@stores/sort.store";
import { buildNoteTree, moveBlocker } from "@utils/noteTree";

import type { Note } from "@entities";
import type { MoveBlocker, NoteTreeNode } from "@utils/noteTree";

const PICKER_BASE_PADDING_PX = 20;
const PICKER_DEPTH_STEP_PX = 14;

type MoveNoteModalProps = {
    note: Note;
    initiallyExpanded: Set<string>;
    onClose: () => void;
};

function MoveNoteModal({ note, initiallyExpanded, onClose }: MoveNoteModalProps) {
    const { notes } = useNotes();
    const order = useSortOrder();
    const [selected, setSelected] = useState<string | null | undefined>(undefined);
    const [expanded, setExpanded] = useState<Set<string>>(() => new Set(initiallyExpanded));
    const [search, setSearch] = useState("");

    const tree = useMemo(() => buildNoteTree(notes, order), [notes, order]);
    const searchMatches = useMemo<Note[]>(() => {
        const q = search.trim().toLowerCase();
        if (q === "") {
            return [];
        }
        return notes.filter((n) => n.title.toLowerCase().includes(q));
    }, [notes, search]);

    const blockerFor = (id: string): MoveBlocker | null => moveBlocker(note.id, id, notes);

    const toggleExpanded = (id: string) =>
        setExpanded((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });

    const moveDisabled =
        selected === undefined ||
        (selected !== null && moveBlocker(note.id, selected, notes) !== null);

    const handleMove = async () => {
        if (selected === undefined) {
            return;
        }
        await moveNote(note.id, selected);
        onClose();
    };

    return (
        <Modal className="w-120 overflow-hidden" open={true}>
            <header className="border-border-soft border-b px-5 pt-4 pb-3">
                <div className="text-ui-base text-text mb-2.5 font-medium">
                    Move "{NoteEntity.getTitle(note)}" to…
                </div>
                <div className="bg-surface border-border focus-within:border-accent flex h-8 items-center gap-2 rounded border px-2.5 transition-colors">
                    <Search className="text-dim shrink-0" size={12} strokeWidth={1.5} />
                    <input
                        className="text-ui-sm text-text placeholder:text-dim w-full bg-transparent font-mono outline-none"
                        placeholder="Search notes..."
                        type="text"
                        value={search}
                        autoFocus
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </header>

            <div className="max-h-70 overflow-y-auto py-2">
                <RootRow selected={selected === null} onSelect={() => setSelected(null)} />
                {search.trim() === ""
                    ? tree.map((node) => (
                          <PickerBranch
                              key={node.note.id}
                              blockerFor={blockerFor}
                              expanded={expanded}
                              node={node}
                              selected={selected}
                              onSelect={setSelected}
                              onToggleExpanded={toggleExpanded}
                          />
                      ))
                    : searchMatches.map((n) => (
                          <PickerRow
                              key={n.id}
                              blocker={blockerFor(n.id)}
                              depth={0}
                              hasChildren={false}
                              isExpanded={false}
                              isSelected={selected === n.id}
                              note={n}
                              onSelect={() => setSelected(n.id)}
                              onToggleExpanded={() => undefined}
                          />
                      ))}
            </div>

            <footer className="border-border-soft flex items-center justify-end gap-2 border-t px-5 py-3">
                <Button label="Cancel" variant="ghost" onClick={onClose} />
                <Button disabled={moveDisabled} label="Move" onClick={handleMove} />
            </footer>
        </Modal>
    );
}

function RootRow({ selected, onSelect }: { selected: boolean; onSelect: () => void }) {
    return (
        <button
            className={`border-border-soft mb-1 flex w-full items-center gap-1.5 border-b py-2 pr-5 pl-5 transition-colors ${
                selected ? "bg-accent-surface text-accent" : "text-text hover:bg-accent-surface"
            }`}
            type="button"
            onClick={onSelect}
        >
            <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center" />
            <Home
                className={selected ? "text-accent shrink-0" : "text-subtle shrink-0"}
                size={12}
                strokeWidth={1.5}
            />
            <span className="text-ui-sm">Root</span>
        </button>
    );
}

type PickerBranchProps = {
    node: NoteTreeNode;
    selected: string | null | undefined;
    expanded: Set<string>;
    blockerFor: (id: string) => MoveBlocker | null;
    onSelect: (id: string) => void;
    onToggleExpanded: (id: string) => void;
};

function PickerBranch({
    node,
    selected,
    expanded,
    blockerFor,
    onSelect,
    onToggleExpanded
}: PickerBranchProps) {
    const isExpanded = expanded.has(node.note.id);
    const hasChildren = node.children.length > 0;

    return (
        <>
            <PickerRow
                blocker={blockerFor(node.note.id)}
                depth={node.depth}
                hasChildren={hasChildren}
                isExpanded={isExpanded}
                isSelected={selected === node.note.id}
                note={node.note}
                onSelect={() => onSelect(node.note.id)}
                onToggleExpanded={() => onToggleExpanded(node.note.id)}
            />
            {hasChildren &&
                isExpanded &&
                node.children.map((child) => (
                    <PickerBranch
                        key={child.note.id}
                        blockerFor={blockerFor}
                        expanded={expanded}
                        node={child}
                        selected={selected}
                        onSelect={onSelect}
                        onToggleExpanded={onToggleExpanded}
                    />
                ))}
        </>
    );
}

type PickerRowProps = {
    note: Note;
    depth: number;
    hasChildren: boolean;
    isExpanded: boolean;
    isSelected: boolean;
    blocker: MoveBlocker | null;
    onSelect: () => void;
    onToggleExpanded: () => void;
};

const BLOCKER_INFO: Record<MoveBlocker, { label: string; tooltip: string }> = {
    self: {
        label: "this note",
        tooltip: "Cannot move a note into itself"
    },
    descendant: {
        label: "descendant",
        tooltip: "This note is a descendant of the note being moved"
    },
    depth: {
        label: "max depth",
        tooltip: "Moving here would exceed max depth"
    }
};

function PickerRow({
    note,
    depth,
    hasChildren,
    isExpanded,
    isSelected,
    blocker,
    onSelect,
    onToggleExpanded
}: PickerRowProps) {
    const disabled = blocker !== null;
    const paddingLeft = PICKER_BASE_PADDING_PX + PICKER_DEPTH_STEP_PX * depth;

    return (
        <div
            className={`flex h-9 items-center gap-1.5 pr-5 transition-colors ${
                disabled
                    ? "cursor-not-allowed"
                    : isSelected
                      ? "bg-accent-surface cursor-pointer"
                      : "hover:bg-accent-surface cursor-pointer"
            }`}
            role="button"
            style={{ paddingLeft: `${paddingLeft}px` }}
            tabIndex={disabled ? -1 : 0}
            title={blocker ? BLOCKER_INFO[blocker].tooltip : undefined}
            onClick={disabled ? undefined : onSelect}
            onKeyDown={(e) => {
                if (disabled) {
                    return;
                }
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect();
                }
            }}
        >
            <button
                aria-hidden={!hasChildren}
                aria-label={isExpanded ? "Collapse" : "Expand"}
                className={`text-dim flex h-3.5 w-3.5 shrink-0 items-center justify-center ${hasChildren ? "" : "invisible"}`}
                tabIndex={hasChildren ? 0 : -1}
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    onToggleExpanded();
                }}
            >
                <ChevronRight
                    className={`duration-fast transition-transform ${isExpanded ? "rotate-90" : ""}`}
                    size={11}
                    strokeWidth={2}
                />
            </button>
            <File
                className={`shrink-0 ${disabled ? "text-dim" : isSelected ? "text-accent" : "text-subtle"}`}
                size={12}
                strokeWidth={1.5}
            />
            <span
                className={`text-ui-sm flex-1 truncate ${disabled ? "text-dim" : isSelected ? "text-accent" : "text-text"}`}
            >
                {NoteEntity.getTitle(note)}
            </span>
            {blocker !== null && (
                <span className="bg-surface border-border-soft text-dim shrink-0 rounded-sm border px-1.5 py-px font-mono text-[9px]">
                    {BLOCKER_INFO[blocker].label}
                </span>
            )}
        </div>
    );
}

export default MoveNoteModal;
