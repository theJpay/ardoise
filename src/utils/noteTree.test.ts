import { describe, expect, it } from "vitest";

import { generateNote } from "@entities/note.fixtures";

import { ancestorsOf, buildNoteTree, depthOf, descendantsOf } from "./noteTree";

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
