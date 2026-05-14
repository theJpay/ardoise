import { useIsTreeRowExpanded, useTreeExpansionActions } from "@stores/treeExpansion.store";

import NoteItem from "./NoteItem";

import type { Anchor } from "@hooks/useFloatingMenu";
import type { NoteTreeNode } from "@utils/noteTree";

type NoteTreeProps = {
    nodes: NoteTreeNode[];
    menuOpenNoteId: string | null;
    onOpenMenu: (noteId: string, anchor: Anchor) => void;
    onCloseMenu: () => void;
};

function NoteTree({ nodes, menuOpenNoteId, onOpenMenu, onCloseMenu }: NoteTreeProps) {
    return (
        <ul>
            {nodes.map((node) => (
                <NoteTreeRow
                    key={node.note.id}
                    menuOpenNoteId={menuOpenNoteId}
                    node={node}
                    onCloseMenu={onCloseMenu}
                    onOpenMenu={onOpenMenu}
                />
            ))}
        </ul>
    );
}

type NoteTreeRowProps = {
    node: NoteTreeNode;
    menuOpenNoteId: string | null;
    onOpenMenu: (noteId: string, anchor: Anchor) => void;
    onCloseMenu: () => void;
};

function NoteTreeRow({ node, menuOpenNoteId, onOpenMenu, onCloseMenu }: NoteTreeRowProps) {
    const isExpanded = useIsTreeRowExpanded(node.note.id);
    const { toggle } = useTreeExpansionActions();
    const hasChildren = node.children.length > 0;

    return (
        <>
            <li
                onContextMenu={(e) => {
                    e.preventDefault();
                    onOpenMenu(node.note.id, {
                        type: "coordinates",
                        x: e.clientX,
                        y: e.clientY
                    });
                }}
            >
                <NoteItem
                    isMenuOpen={menuOpenNoteId === node.note.id}
                    note={node.note}
                    treeRow={{
                        depth: node.depth,
                        hasChildren,
                        isExpanded,
                        onToggleExpand: () => toggle(node.note.id)
                    }}
                    onCloseMenu={onCloseMenu}
                    onOpenMenu={(anchor) => onOpenMenu(node.note.id, anchor)}
                />
            </li>
            {hasChildren && isExpanded && (
                <NoteTree
                    menuOpenNoteId={menuOpenNoteId}
                    nodes={node.children}
                    onCloseMenu={onCloseMenu}
                    onOpenMenu={onOpenMenu}
                />
            )}
        </>
    );
}

export default NoteTree;
