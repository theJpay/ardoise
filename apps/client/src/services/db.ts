import Dexie from "dexie";

import type { Note, Settings } from "@entities";
import type { EntityTable } from "dexie";

const db = new Dexie("ArdoiseDB") as Dexie & {
    notes: EntityTable<Note, "id">;
    settings: EntityTable<Settings, "id">;
};

db.version(5)
    .stores({
        notes: "id, title, updatedAt, lastActivityAt, deletedAt, pinnedAt, archivedAt, parentId",
        settings: "id"
    })
    .upgrade((tx) =>
        tx
            .table("notes")
            .toCollection()
            .modify((note) => {
                note.parentId = null;
                note.lastActivityAt = note.updatedAt;
            })
    );

db.version(4)
    .stores({
        notes: "id, title, updatedAt, deletedAt, pinnedAt, archivedAt",
        settings: "id"
    })
    .upgrade((tx) =>
        tx
            .table("notes")
            .toCollection()
            .modify((note) => {
                note.archivedAt = null;
            })
    );

db.version(3)
    .stores({
        notes: "id, title, updatedAt, deletedAt, pinnedAt",
        settings: "id"
    })
    .upgrade((tx) =>
        tx
            .table("notes")
            .toCollection()
            .modify((note) => {
                note.pinnedAt = null;
            })
    );

db.version(2).stores({
    notes: "id, title, updatedAt, deletedAt",
    settings: "id"
});

export default db;
