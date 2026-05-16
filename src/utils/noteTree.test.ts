import { describe, expect, it } from "vitest";

import { generateNote } from "@entities/note.fixtures";

import {
    ancestorsOf,
    buildNoteTree,
    depthOf,
    descendantsOf,
    moveBlocker,
    subtreeDepthOf
} from "./noteTree";

describe("buildNoteTree", () => {
    it("returns an empty array for no notes", () => {
        const tree = buildNoteTree([], "updated");

        expect(tree).toEqual([]);
    });

    it("renders a single root note as one node with no children", () => {
        const note = generateNote({ id: "a" });

        const tree = buildNoteTree([note], "updated");

        expect(tree).toEqual([{ note, children: [], depth: 0 }]);
    });

    it("assembles parents and children with depth", () => {
        const root = generateNote({ id: "root" });
        const child = generateNote({ id: "child", parentId: "root" });
        const grandchild = generateNote({ id: "grand", parentId: "child" });

        const tree = buildNoteTree([grandchild, child, root], "alphabetical");

        expect(tree).toEqual([
            {
                note: root,
                depth: 0,
                children: [
                    {
                        note: child,
                        depth: 1,
                        children: [{ note: grandchild, depth: 2, children: [] }]
                    }
                ]
            }
        ]);
    });

    it("rehomes orphans at root when their parent is not in the live set", () => {
        const orphan = generateNote({ id: "orphan", parentId: "missing" });

        const tree = buildNoteTree([orphan], "updated");

        expect(tree.map((n) => n.note.id)).toEqual(["orphan"]);
        expect(tree[0].depth).toBe(0);
    });

    it("sorts siblings within each parent by the active sort", () => {
        const root = generateNote({ id: "root" });
        const childA = generateNote({ id: "a", parentId: "root", title: "Banana" });
        const childB = generateNote({ id: "b", parentId: "root", title: "apple" });

        const tree = buildNoteTree([root, childA, childB], "alphabetical");

        expect(tree[0].children.map((c) => c.note.id)).toEqual(["b", "a"]);
    });
});

describe("depthOf", () => {
    it("returns 0 for a root note", () => {
        const root = generateNote({ id: "root" });

        expect(depthOf("root", [root])).toBe(0);
    });

    it("counts ancestors up to the queried note", () => {
        const root = generateNote({ id: "root" });
        const child = generateNote({ id: "child", parentId: "root" });
        const grandchild = generateNote({ id: "grand", parentId: "child" });

        expect(depthOf("grand", [root, child, grandchild])).toBe(2);
    });
});

describe("ancestorsOf", () => {
    it("returns an empty array for a root note", () => {
        const root = generateNote({ id: "root" });

        const chain = ancestorsOf("root", [root]);

        expect(chain).toEqual([]);
    });

    it("returns ancestors root-first up to the queried note", () => {
        const root = generateNote({ id: "root" });
        const child = generateNote({ id: "child", parentId: "root" });
        const grandchild = generateNote({ id: "grand", parentId: "child" });

        const chain = ancestorsOf("grand", [root, child, grandchild]);

        expect(chain.map((n) => n.id)).toEqual(["root", "child"]);
    });

    it("stops walking when an ancestor is missing", () => {
        const orphan = generateNote({ id: "orphan", parentId: "missing" });

        const chain = ancestorsOf("orphan", [orphan]);

        expect(chain).toEqual([]);
    });

    it("returns an empty array for an unknown note id", () => {
        const chain = ancestorsOf("nope", [generateNote({ id: "a" })]);

        expect(chain).toEqual([]);
    });
});

describe("subtreeDepthOf", () => {
    it("returns 0 for a leaf", () => {
        const leaf = generateNote({ id: "a" });

        expect(subtreeDepthOf("a", [leaf])).toBe(0);
    });

    it("returns the distance to the deepest descendant", () => {
        const root = generateNote({ id: "root" });
        const child = generateNote({ id: "child", parentId: "root" });
        const grandchild = generateNote({ id: "grand", parentId: "child" });

        expect(subtreeDepthOf("root", [root, child, grandchild])).toBe(2);
    });
});

describe("moveBlocker", () => {
    it("allows moving to root", () => {
        const a = generateNote({ id: "a" });

        expect(moveBlocker("a", null, [a])).toBe(null);
    });

    it("blocks moving a note onto itself", () => {
        const a = generateNote({ id: "a" });

        expect(moveBlocker("a", "a", [a])).toBe("self");
    });

    it("blocks moving a note into one of its descendants", () => {
        const root = generateNote({ id: "root" });
        const child = generateNote({ id: "child", parentId: "root" });

        expect(moveBlocker("root", "child", [root, child])).toBe("descendant");
    });

    it("blocks moves whose resulting depth would exceed the cap", () => {
        const a1 = generateNote({ id: "a1" });
        const a2 = generateNote({ id: "a2", parentId: "a1" });
        const a3 = generateNote({ id: "a3", parentId: "a2" });
        const a4 = generateNote({ id: "a4", parentId: "a3" });
        const b1 = generateNote({ id: "b1" });

        expect(moveBlocker("a1", "b1", [a1, a2, a3, a4, b1])).toBe("depth");
    });

    it("allows moves that just fit within the cap", () => {
        const a1 = generateNote({ id: "a1" });
        const a2 = generateNote({ id: "a2", parentId: "a1" });
        const a3 = generateNote({ id: "a3", parentId: "a2" });
        const b1 = generateNote({ id: "b1" });

        expect(moveBlocker("a1", "b1", [a1, a2, a3, b1])).toBe(null);
    });
});

describe("descendantsOf", () => {
    it("returns an empty array for a leaf", () => {
        const leaf = generateNote({ id: "a" });

        expect(descendantsOf("a", [leaf])).toEqual([]);
    });

    it("returns the full subtree below a note", () => {
        const root = generateNote({ id: "root" });
        const childA = generateNote({ id: "a", parentId: "root" });
        const childB = generateNote({ id: "b", parentId: "root" });
        const grandchild = generateNote({ id: "grand", parentId: "a" });

        const result = descendantsOf("root", [root, childA, childB, grandchild]);

        expect(result.map((n) => n.id).sort()).toEqual(["a", "b", "grand"]);
    });

    it("does not include the queried note itself", () => {
        const root = generateNote({ id: "root" });
        const child = generateNote({ id: "child", parentId: "root" });

        const result = descendantsOf("root", [root, child]);

        expect(result.map((n) => n.id)).toEqual(["child"]);
    });
});
