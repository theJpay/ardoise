import Dexie from "dexie";

import type { Note, Settings } from "@entities";
import type { EntityTable } from "dexie";

const db = new Dexie("ArdoiseDB") as Dexie & {
    notes: EntityTable<Note, "id">;
    settings: EntityTable<Settings, "id">;
};

db.version(2).stores({
    notes: "id, title, updatedAt, deletedAt",
    settings: "id"
});

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

export default db;
