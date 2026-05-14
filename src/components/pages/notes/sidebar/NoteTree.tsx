import { useIsTreeRowExpanded, useTreeExpansionActions } from "@stores/treeExpansion.store";

import NoteItem from "./NoteItem";

import type { NoteTreeNode } from "@utils/noteTree";

type NoteTreeProps = {
    nodes: NoteTreeNode[];
    dateField: "updatedAt" | "createdAt";
    onContextMenu: (e: React.MouseEvent, noteId: string) => void;
};

function NoteTree({ nodes, dateField, onContextMenu }: NoteTreeProps) {
    return (
        <ul>
            {nodes.map((node) => (
                <NoteTreeRow
                    key={node.note.id}
                    dateField={dateField}
                    node={node}
                    onContextMenu={onContextMenu}
                />
            ))}
        </ul>
    );
}

type NoteTreeRowProps = {
    node: NoteTreeNode;
    dateField: "updatedAt" | "createdAt";
    onContextMenu: (e: React.MouseEvent, noteId: string) => void;
};

function NoteTreeRow({ node, dateField, onContextMenu }: NoteTreeRowProps) {
    const isExpanded = useIsTreeRowExpanded(node.note.id);
    const { toggle } = useTreeExpansionActions();
    const hasChildren = node.children.length > 0;

    return (
        <>
            <li onContextMenu={(e) => onContextMenu(e, node.note.id)}>
                <NoteItem
                    dateField={dateField}
                    note={node.note}
                    treeRow={{
                        depth: node.depth,
                        hasChildren,
                        isExpanded,
                        onToggleExpand: () => toggle(node.note.id)
                    }}
                />
            </li>
            {hasChildren && isExpanded && (
                <NoteTree
                    dateField={dateField}
                    nodes={node.children}
                    onContextMenu={onContextMenu}
                />
            )}
        </>
    );
}

export default NoteTree;
